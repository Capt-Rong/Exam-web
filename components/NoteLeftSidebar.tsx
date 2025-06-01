import React from "react";
import type { Chapter, BasicNoteInfo } from "@/types";

interface NoteLeftSidebarProps {
  chapters: Chapter[];
  currentPath: string;
  subjectSlug: string;
  onNoteSelect: (noteId: string) => void;
}

const NoteLeftSidebar: React.FC<NoteLeftSidebarProps> = ({
  chapters,
  currentPath,
  subjectSlug,
  onNoteSelect,
}) => {
  return (
    <aside className="w-1/5 min-w-[200px] max-w-[300px] h-screen sticky top-0 overflow-y-auto p-4 border-r border-gray-200 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 sticky top-0 bg-gray-50 py-2 z-10">
        Chapters
      </h2>
      {chapters.length > 0 ? (
        <ul className="space-y-2">
          {chapters.map((chapter) => (
            <li key={chapter.id} className="text-gray-700">
              <h3 className="font-medium text-sm uppercase tracking-wider text-gray-600 mb-1 pt-2">
                {chapter.title}
              </h3>
              {chapter.notes && chapter.notes.length > 0 ? (
                <ul className="ml-2 space-y-1">
                  {chapter.notes.map((note: BasicNoteInfo) => {
                    const notePath = `/notes/${subjectSlug}/${note.id}`;
                    const isActive = currentPath === notePath;
                    return (
                      <li key={note.id}>
                        <button
                          onClick={() => onNoteSelect(note.id)}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ease-in-out ${
                            isActive
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          }`}
                        >
                          {note.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="ml-2 text-xs text-gray-500 italic">
                  No notes in this chapter.
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No chapters available for this subject.
        </p>
      )}
    </aside>
  );
};

export default NoteLeftSidebar;
