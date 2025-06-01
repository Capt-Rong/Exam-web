import React, { useEffect, useState } from "react";
import type { Heading } from "@/types";
import { Switch } from "@/components/ui/switch";

interface NoteRightOutlineProps {
  headings: Heading[];
}

const NoteRightOutline: React.FC<NoteRightOutlineProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observerOptions = {
      rootMargin: "-100px 0px -50% 0px", // Adjust based on your header/sticky elements
      threshold: 0.5, // Trigger when 50% of the element is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el) => el !== null) as HTMLElement[];

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [headings]); // Re-run if headings change

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Offset for sticky header (adjust if necessary)
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Update URL hash without page reload, and for activeId highlighting consistency
      window.history.pushState(null, "", `#${id}`);
      setActiveId(id); // Set active on click immediately
    }
  };

  const handleSidebarToggle = () => {
    const sidebarContent = document.querySelector(".sidebar-content");
    if (sidebarContent) {
      sidebarContent.classList.toggle("hidden");
    }
  };

  return (
    <aside className="w-1/6 sticky top-[calc(var(--navbar-height)+16px)] right-2 h-fit p-4  rounded-lg border border-gray-200 shadow-sm text-sm bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold sticky top-0  text-gray-800  bg-gray-50 hover:cursor-pointer hover:text-blue-600">
          On this page
        </h2>
        <Switch onClick={handleSidebarToggle} />
      </div>
      {headings.length > 0 ? (
        <ul className="space-y-1 sidebar-content">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ marginLeft: `${(heading.level - 1) * 0.75}rem` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={`block py-1 transition-colors duration-150 rounded-md text-xs px-2 ${
                  activeId === heading.id
                    ? "text-blue-600 font-semibold bg-blue-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">No outline available.</p>
      )}
    </aside>
  );
};

export default NoteRightOutline;
