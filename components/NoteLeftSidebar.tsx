import React, { useState } from "react";
import type { Chapter, BasicNoteInfo } from "@/types";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface NoteLeftSidebarProps {
  chapters: Chapter[];
  currentPath: string;
  subjectSlug: string;
  onNoteSelect: (noteId: string) => void;
}

interface ChapterNodeProps {
  chapter: Chapter;
  currentPath: string;
  subjectSlug: string;
  onNoteSelect: (noteId: string) => void;
  level: number;
}

const ChapterNode: React.FC<ChapterNodeProps> = ({
  chapter,
  currentPath,
  subjectSlug,
  onNoteSelect,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubChapters = chapter.subChapters && chapter.subChapters.length > 0;
  const hasNotes = chapter.notes && chapter.notes.length > 0;

  const toggleExpansion = () => {
    if (hasSubChapters) {
      setIsExpanded(!isExpanded);
    }
  };

  const paddingLeft = level * 16;

  return (
    <li className="text-gray-700">
      <div
        className={`flex items-center justify-between font-medium text-sm uppercase tracking-wider text-gray-600 mb-1 pt-2 cursor-pointer hover:bg-gray-100 rounded-md`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={toggleExpansion}
      >
        <span>{chapter.title}</span>
        {hasSubChapters && (
          <span
            className={`text-xs transform transition-transform duration-150 ${
              isExpanded ? "rotate-90" : ""
            }`}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </span>
        )}
      </div>

      {hasNotes && (isExpanded || !hasSubChapters) && (
        <ul
          className="space-y-1"
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
        >
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
      )}

      {hasSubChapters && isExpanded && (
        <ul className="space-y-1 mt-1">
          {chapter.subChapters?.map((subChapter) => (
            <ChapterNode
              key={subChapter.id}
              chapter={subChapter}
              currentPath={currentPath}
              subjectSlug={subjectSlug}
              onNoteSelect={onNoteSelect}
              level={level + 1}
            />
          ))}
        </ul>
      )}
      {!hasNotes && !hasSubChapters && level > 0 && (
        <p
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
          className="ml-2 text-xs text-gray-500 italic"
        >
          No content in this section.
        </p>
      )}
    </li>
  );
};

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
        <ul className="space-y-1">
          {chapters.map((chapter) => (
            <ChapterNode
              key={chapter.id}
              chapter={chapter}
              currentPath={currentPath}
              subjectSlug={subjectSlug}
              onNoteSelect={onNoteSelect}
              level={0}
            />
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
