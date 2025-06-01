"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import type { Chapter, Heading, Note, BasicNoteInfo } from "@/types";
import { createClient } from "@/lib/supabase/client";

// Import the extracted components
import NoteLeftSidebar from "@/components/NoteLeftSidebar";
import NoteMainContent from "@/components/NoteMainContent";
import NoteRightOutline from "@/components/NoteRightOutline";

const SubjectNotePage = () => {
  const params = useParams();
  const subjectSlug = params.subject as string;
  const noteId = params.noteId as string;
  const supabase = createClient();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [noteError, setNoteError] = useState<string | null>(null);

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [currentPath, setCurrentPath] = useState("");

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!noteId) {
      setIsLoadingNote(false);
      return;
    }
    setCurrentNote(null);
    setIsLoadingNote(true);
    setNoteError(null);

    const fetchNoteContent = async () => {
      const { data: noteData, error } = await supabase
        .from("notes")
        .select("id, title, content, chapter_id")
        .eq("id", noteId)
        .single();

      if (error) {
        console.error("Error fetching note content:", error);
        setNoteError(
          `Failed to load note: ${error.message}. Please check if the note ID is correct.`
        );
      } else if (noteData) {
        setCurrentNote(noteData as Note);
      } else {
        setNoteError("Note not found (ID: " + noteId + ").");
      }
      setIsLoadingNote(false);
    };

    fetchNoteContent();
  }, [noteId, supabase]);

  useEffect(() => {
    if (!subjectSlug) return;

    const fetchChaptersAndNotes = async () => {
      setIsLoadingChapters(true);
      setChaptersError(null);
      setChapters([]);

      try {
        const { data: subjectData, error: subjectError } = await supabase
          .from("subjects")
          .select("id, name")
          .eq("slug", subjectSlug)
          .single();

        if (subjectError) throw subjectError;
        if (!subjectData)
          throw new Error(`Subject with slug '${subjectSlug}' not found.`);

        const { data: chaptersData, error: chaptersError } = await supabase
          .from("chapters")
          .select("id, title, order")
          .eq("subject_id", subjectData.id)
          .order("order", { ascending: true });

        if (chaptersError) throw chaptersError;
        if (!chaptersData)
          throw new Error("No chapters found for this subject.");

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
      } catch (e: unknown) {
        console.error("Error fetching chapters or notes for sidebar:", e);
        let message = "An unknown error occurred while loading chapters.";
        if (e instanceof Error) {
          message = e.message;
        }
        setChaptersError(message);
      }
      setIsLoadingChapters(false);
    };

    fetchChaptersAndNotes();
  }, [subjectSlug, supabase]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

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

  if (isLoadingNote || isLoadingChapters) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full">
        Loading note data...
      </div>
    );
  }

  const prioritizedError = chaptersError || noteError;
  if (prioritizedError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen h-full p-4 text-center">
        <p className="text-red-500 text-xl">Error</p>
        <p>{prioritizedError}</p>
      </div>
    );
  }

  if (!noteId || (!currentNote && !noteError)) {
    if (chapters.length > 0 && !isLoadingChapters) {
      return (
        <div className="flex min-h-screen h-full bg-white">
          <NoteLeftSidebar
            chapters={chapters}
            currentPath={currentPath}
            subjectSlug={subjectSlug}
          />
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold mb-4">Select a note</h1>
            <p>Please select a note from the sidebar to view its content.</p>
            {chaptersError && (
              <p className="text-red-500 mt-4">
                Error loading chapters: {chaptersError}
              </p>
            )}
          </main>
          <NoteRightOutline headings={[]} />
        </div>
      );
    }
  }

  if (!currentNote) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full">
        Note content is not available.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen h-full bg-white">
      <NoteLeftSidebar
        chapters={chapters}
        currentPath={currentPath}
        subjectSlug={subjectSlug}
      />
      <NoteMainContent
        markdownContent={currentNote.content || ""}
        onHeadingParse={handleNewHeadings}
      />
      <NoteRightOutline headings={headings} />
    </div>
  );
};

export default SubjectNotePage;
