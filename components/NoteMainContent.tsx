import React, { useEffect, useCallback } from "react";
import type { Heading } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit"; // Utility to traverse the tree

// Custom Rehype plugin to extract headings after slugs are generated
const extractHeadingsPlugin = (options: {
  onHeadings: (headings: Heading[]) => void;
}) => {
  return (tree: any) => {
    const headings: Heading[] = [];
    visit(tree, "element", (node: any) => {
      if (
        node.tagName &&
        ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
      ) {
        // Ensure there's an ID (rehype-slug should have added it)
        if (node.properties && node.properties.id) {
          // Extract text content
          let textContent = "";
          visit(node, "text", (textNode: any) => {
            textContent += textNode.value;
          });
          headings.push({
            id: String(node.properties.id),
            level: parseInt(node.tagName.substring(1), 10),
            text: textContent.trim(),
          });
        }
      }
    });
    if (options.onHeadings) {
      // Defer the call to avoid updating parent during child render
      setTimeout(() => options.onHeadings(headings), 0);
    }
  };
};

interface NoteMainContentProps {
  markdownContent: string;
  onHeadingParse: (headings: Heading[]) => void;
}

const NoteMainContent: React.FC<NoteMainContentProps> = ({
  markdownContent,
  onHeadingParse,
}) => {
  // Memoize customRehypePlugin so it's stable unless onHeadingParse changes
  const customRehypePlugin = useCallback(() => {
    return extractHeadingsPlugin({ onHeadings: onHeadingParse });
  }, [onHeadingParse]);

  // This useEffect might not be strictly necessary anymore for heading extraction,
  // as the plugin handles it. Can be removed if no other side effects are tied to markdownContent change here.
  useEffect(() => {
    // console.log("NoteMainContent useEffect for markdownContent/onHeadingParse ran");
  }, [markdownContent, onHeadingParse]);

  return (
    <main className="w-2/3 min-h-screen p-6 lg:p-8">
      <div className="prose sm:prose-m max-w-none">
        <ReactMarkdown
          rehypePlugins={[
            [rehypeRaw, { passThrough: ["element"] }],
            rehypeSlug,
            customRehypePlugin,
          ]}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </main>
  );
};

export default NoteMainContent;
