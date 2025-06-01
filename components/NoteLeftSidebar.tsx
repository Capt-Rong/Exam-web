import React from "react";
import type { Chapter } from "@/types";

interface NoteLeftSidebarProps {
  chapters: Chapter[];
  currentPath: string;
  subjectSlug: string;
}

const NoteLeftSidebar: React.FC<NoteLeftSidebarProps> = ({
  chapters,
  currentPath,
  subjectSlug,
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
              <span className="font-medium block py-1 text-sm text-gray-600 break-words">
                {chapter.title}
              </span>
              {chapter.notes && chapter.notes.length > 0 && (
                <ul className="ml-2 mt-1 space-y-1 border-l border-gray-300 pl-3">
                  {chapter.notes.map((note) => {
                    const notePath = `/notes/${subjectSlug}/${note.id}`;
                    return (
                      <li key={note.id}>
                        <a
                          href={notePath}
                          className={`block text-sm py-1 rounded-md transition-colors duration-150 break-words ${
                            currentPath === notePath
                              ? "text-blue-600 font-semibold bg-blue-100 px-2"
                              : "text-gray-600 hover:text-blue-600 hover:bg-gray-200 px-2"
                          }`}
                        >
                          {note.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          No chapters available for this subject.
        </p>
      )}
    </aside>
  );
};

export default NoteLeftSidebar;
