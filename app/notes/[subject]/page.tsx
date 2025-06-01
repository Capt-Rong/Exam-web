"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Chapter, Heading, Note, BasicNoteInfo } from "@/types";
import { createClient } from "@/lib/supabase/client";

// Import the extracted components
import NoteLeftSidebar from "@/components/NoteLeftSidebar";
import NoteMainContent from "@/components/NoteMainContent";
import NoteRightOutline from "@/components/NoteRightOutline";

const SubjectNotesDisplayPage = () => {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = params.subject as string;
  const supabase = createClient();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [noteError, setNoteError] = useState<string | null>(null);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [currentPath, setCurrentPath] = useState("");

  const isMountedRef = useRef(false);
  const initialLoadAttemptedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!subjectSlug || initialLoadAttemptedRef.current) return;
    initialLoadAttemptedRef.current = true;

    const fetchInitialDataAndDetermineNote = async () => {
      setIsLoadingChapters(true);
      setIsLoadingNote(true);
      setChaptersError(null);
      setNoteError(null);
      setChapters([]);
      setCurrentNote(null);
      setActiveNoteId(null);

      try {
        const { data: subjectData, error: subjectFetchError } = await supabase
          .from("subjects")
          .select("id, name")
          .eq("slug", subjectSlug)
          .single();

        if (subjectFetchError) throw subjectFetchError;
        if (!subjectData)
          throw new Error(`Subject with slug '${subjectSlug}' not found.`);

        const { data: chaptersData, error: chaptersFetchError } = await supabase
          .from("chapters")
          .select("id, title, order")
          .eq("subject_id", subjectData.id)
          .order("order", { ascending: true });

        if (chaptersFetchError) throw chaptersFetchError;
        if (!chaptersData || chaptersData.length === 0) {
          setChapters([]);
          setIsLoadingChapters(false);
          setIsLoadingNote(false);
          return;
        }

        const chaptersWithNotes: Chapter[] = await Promise.all(
          chaptersData.map(async (chapter) => {
            const { data: notesData, error: notesError } = await supabase
              .from("notes")
              .select("id, title, order")
              .eq("chapter_id", chapter.id)
              .order("order", { ascending: true });
            if (notesError) {
              console.warn(
                `Error fetching notes for chapter ${chapter.title}:`,
                notesError.message
              );
              return { ...chapter, notes: [] };
            }
            return { ...chapter, notes: (notesData as BasicNoteInfo[]) || [] };
          })
        );
        setChapters(chaptersWithNotes);
        setIsLoadingChapters(false);

        let firstNoteId: string | null = null;
        for (const chap of chaptersWithNotes) {
          if (chap.notes && chap.notes.length > 0) {
            firstNoteId = chap.notes[0].id;
            break;
          }
        }

        if (firstNoteId) {
          setActiveNoteId(firstNoteId);
        } else {
          setIsLoadingNote(false);
        }
      } catch (e: unknown) {
        console.error("Error fetching initial data for subject page:", e);
        let message = "An unknown error occurred.";
        if (e instanceof Error) message = e.message;
        setChaptersError(message);
        setNoteError(message);
        setIsLoadingChapters(false);
        setIsLoadingNote(false);
      }
    };

    fetchInitialDataAndDetermineNote();
  }, [subjectSlug, supabase, router]);

  useEffect(() => {
    if (!activeNoteId) {
      setIsLoadingNote(false);
      setCurrentNote(null);
      return;
    }

    setIsLoadingNote(true);
    setNoteError(null);

    const fetchNoteContent = async () => {
      const { data: noteData, error } = await supabase
        .from("notes")
        .select("id, title, content, chapter_id")
        .eq("id", activeNoteId)
        .single();

      if (error) {
        console.error("Error fetching note content for activeNoteId:", error);
        setNoteError(`Failed to load note: ${error.message}.`);
        setCurrentNote(null);
      } else if (noteData) {
        setCurrentNote(noteData as Note);
      } else {
        setNoteError(
          activeNoteId
            ? `Note not found (ID: ${activeNoteId}).`
            : "Note not found."
        );
        setCurrentNote(null);
      }
      setIsLoadingNote(false);
    };

    fetchNoteContent();
  }, [activeNoteId, supabase]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (subjectSlug && activeNoteId) {
        setCurrentPath(`/notes/${subjectSlug}/${activeNoteId}`);
      } else if (subjectSlug) {
        setCurrentPath(`/notes/${subjectSlug}`);
      }
    }
  }, [subjectSlug, activeNoteId]);

  const handleNewHeadings = useCallback((newHeadings: Heading[]) => {
    if (isMountedRef.current) {
      setHeadings((currentHeadings) => {
        if (JSON.stringify(currentHeadings) !== JSON.stringify(newHeadings)) {
          return newHeadings;
        }
        return currentHeadings;
      });
    }
  }, []);

  // Callback to be passed to NoteLeftSidebar for note selection
  const handleNoteSelection = useCallback((selectedNoteId: string) => {
    if (isMountedRef.current) {
      setActiveNoteId(selectedNoteId);
      // Optionally, scroll to top or handle other UI changes upon note selection
    }
  }, []);

  if (
    isLoadingChapters ||
    (isLoadingNote && !currentNote && !chaptersError && !activeNoteId)
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full">
        Loading subject notes...
      </div>
    );
  }

  const prioritizedError = chaptersError || (noteError && !currentNote);
  if (prioritizedError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen h-full p-4 text-center">
        <p className="text-red-500 text-xl">Error</p>
        <p>{prioritizedError}</p>
      </div>
    );
  }

  if (
    !subjectSlug ||
    (chapters.length === 0 && !isLoadingChapters && !chaptersError)
  ) {
    return (
      <div className="flex min-h-screen h-full bg-white">
        {subjectSlug && (
          <NoteLeftSidebar
            chapters={chapters}
            currentPath={currentPath}
            subjectSlug={subjectSlug}
            onNoteSelect={handleNoteSelection}
          />
        )}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-4">
            {chaptersError
              ? "Error Loading Subject"
              : subjectSlug
              ? "No Notes Available"
              : "Subject Not Specified"}
          </h1>
          <p>
            {chaptersError
              ? chaptersError
              : subjectSlug
              ? "There are no notes or chapters available for this subject, or the subject was not found."
              : "Please select a subject to view notes."}
          </p>
        </main>
        <NoteRightOutline headings={[]} />
      </div>
    );
  }

  if (!currentNote && !isLoadingNote) {
    return (
      <div className="flex min-h-screen h-full bg-white">
        <NoteLeftSidebar
          chapters={chapters}
          currentPath={currentPath}
          subjectSlug={subjectSlug}
          onNoteSelect={handleNoteSelection}
        />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-4">
            {noteError
              ? "Error Loading Note"
              : "Select a Note or No Notes Available"}
          </h1>
          <p>
            {noteError ||
              "Please select a note from the sidebar. If the sidebar is empty or shows errors, there might be no notes for this subject."}
          </p>
          {chapters.length > 0 &&
            chapters.every((c) => c.notes.length === 0) && (
              <p className="mt-4 text-orange-600">
                This subject has chapters, but no notes have been added to them
                yet.
              </p>
            )}
        </main>
        <NoteRightOutline headings={[]} />
      </div>
    );
  }

  if (currentNote) {
    return (
      <div className="flex min-h-screen h-full bg-white">
        <NoteLeftSidebar
          chapters={chapters}
          currentPath={currentPath}
          subjectSlug={subjectSlug}
          onNoteSelect={handleNoteSelection}
        />
        <NoteMainContent
          markdownContent={currentNote.content || ""}
          onHeadingParse={handleNewHeadings}
        />
        <NoteRightOutline headings={headings} />
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex min-h-screen h-full bg-white">
      {chapters.length > 0 && subjectSlug && (
        <NoteLeftSidebar
          chapters={chapters}
          currentPath={currentPath}
          subjectSlug={subjectSlug}
          onNoteSelect={handleNoteSelection}
        />
      )}
      <main className="flex-1 p-8 flex justify-center items-center">
        <p>
          Preparing notes display... If this message persists, please check the
          console for errors or try again.
        </p>
      </main>
      {chapters.length > 0 && <NoteRightOutline headings={[]} />}
    </div>
  );
};

export default SubjectNotesDisplayPage;
