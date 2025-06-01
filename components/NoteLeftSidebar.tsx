import React from "react";
import type { Chapter } from "@/types";

interface NoteLeftSidebarProps {
  chapters: Chapter[];
  currentPath: string;
}

const NoteLeftSidebar: React.FC<NoteLeftSidebarProps> = ({
  chapters,
  currentPath,
}) => {
  return (
    <aside className="w-1/6 min-h-screen p-4 border-r border-gray-200 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Chapters</h2>
      {chapters.length > 0 ? (
        <ul className="space-y-2">
          {chapters.map((chapter) => (
            <li key={chapter.id} className="text-gray-700">
              <span className="font-medium block py-1">{chapter.title}</span>
              {chapter.notes && chapter.notes.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                  {chapter.notes.map((note) => (
                    <li key={note.id}>
                      <a
                        href={`/notes/${chapter.id}/${note.id}`}
                        className={`block text-sm py-1 rounded-md transition-colors duration-150 ${
                          currentPath === `/notes/${chapter.id}/${note.id}`
                            ? "text-blue-600 font-semibold bg-blue-50 px-2"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200 px-2"
                        }`}
                      >
                        {note.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No chapters available.</p>
      )}
    </aside>
  );
};

export default NoteLeftSidebar;
