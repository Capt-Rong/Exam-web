"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import type { Chapter, Heading } from "@/types";

// Import the extracted components
import NoteLeftSidebar from "@/components/NoteLeftSidebar";
import NoteMainContent from "@/components/NoteMainContent";
import NoteRightOutline from "@/components/NoteRightOutline";

// Mock data (can be moved to a separate file or fetched later)
const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    notes: [
      { id: "introduction", title: "Introduction to Subject X" },
      { id: "core-concepts", title: "Core Concepts" },
    ],
  },
  {
    id: "advanced-topics",
    title: "Advanced Topics",
    notes: [
      { id: "topic-a", title: "Advanced Topic A" },
      { id: "topic-b", title: "Advanced Topic B" },
    ],
  },
];

const MOCK_NOTE_CONTENT = `
Excellent question, Captain — this touches on data design philosophy and why normalized databases improve scalability, accuracy, and flexibility.

Let’s break it down using the Feynman method:
\`\`\`js
this is a test
\`\`\`

---


# 🧪 What is a test_session?

A test_session is like a container that represents a single time a student starts and finishes a test — like “a test-taking event.”

## 🎯 Think of it like:

### 🗂️ A folder that includes:
	•	Who took the test (user)
	•	What mode (practice or real test)
	•	When it started/ended
	•	All the answers submitted

⸻

## 🧾 Why do we need test_sessions and test_answers tables?

### 🎯 Because:

We want to store user-specific history, not just questions.

Let’s compare:

Feature	✅ With test_sessions + test_answers	❌ Just using questions
Track multiple attempts	✅ Easily track session 1, 2, 3…	❌ Can’t track who answered what
Store answers per user	✅ Separate answers by session	❌ Would overwrite shared question data
Scoring & review	✅ Show correct/wrong per session	❌ No place to record answers
Show progress	✅ Session-based stats	❌ No context
RLS (per-user data)	✅ Secure with user_id	❌ All data is public or duplicated
Multiple users	✅ Each has their own history	❌ Impossible to distinguish

---
<hr />

## 💡 Real-World Analogy

Imagine a shared question bank (like a textbook):
	•	That’s your questions table — same for everyone.

Now imagine:
	•	You take a test → you get your own answer sheet (test_answers)
	•	That sheet is grouped into a folder for this test attempt (test_session)

---

## 🧩 Table Purposes

1. questions (static data)
	•	Master question bank
	•	Used to render test sessions
	•	Never changes based on user

2. test_sessions (per attempt)
	•	Tracks when and how a user started/finished a test
	•	Links to the user (user_id)
	•	Includes mode: practice / real-test

3. test_answers (per question answered)
	•	Records each answer the user gave during a session
	•	Links to both session_id and question_id
	•	Records: selected option, is it correct, answer time

⸻

## 🧠 Bonus Benefits

Feature	Benefit
AI Analysis	Recommend weak topics per user based on test_answers
Retakes	Show improvement over time
Test Review UI	Let user revisit previous answers
Scoring Logic	Calculate score after test using this data
Difficulty Filter	Store per-question stats (e.g. accuracy rate)
Bookmarking	Add a “bookmark” field per answer for review later


⸻

## ❌ Why Not Just Add Answer Fields to questions?

Because:
- Multiple users would conflict (who answered what?)
- You’d pollute clean, reusable question data
- You can’t model history (e.g. session time, retakes, etc.)
- RLS becomes nearly impossible — questions would need to be duplicated per user (huge bloat)

⸻

## ✅ Final Summary

### Table	Stores
questions	Shared question content
test_sessions	When and how a user took a test
test_answers	What answers a user gave during that test

### 🧠 Separation = clean logic, security, and future AI/statistical power.

⸻

Would you like:
	•	A query that generates a user’s score from test_answers?
	•	A Next.js test UI that starts a test_session and records answers?

Let’s go full-stack with this logic.
`;

const SubjectNotePage = () => {
  const params = useParams();
  const subject = params.subject as string;
  const noteId = params.noteId as string;

  const [chapters, _setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [noteContent, setNoteContent] = useState(MOCK_NOTE_CONTENT);
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
    console.log(`Fetching note for: ${subject} / ${noteId}`);
    setNoteContent(MOCK_NOTE_CONTENT + `\n\n*Path: ${subject}/${noteId}*`);
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, [subject, noteId]);

  const handleNewHeadings = useCallback((newHeadings: Heading[]) => {
    if (isMountedRef.current) {
      setHeadings((currentHeadings) => {
        if (currentHeadings.length !== newHeadings.length) {
          return newHeadings;
        }
        const areDifferent = currentHeadings.some(
          (ch, i) =>
            ch.id !== newHeadings[i]?.id ||
            ch.text !== newHeadings[i]?.text ||
            ch.level !== newHeadings[i]?.level
        );
        if (areDifferent) {
          return newHeadings;
        }
        return currentHeadings;
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen h-full bg-white">
      <NoteLeftSidebar chapters={chapters} currentPath={currentPath} />
      <NoteMainContent
        markdownContent={noteContent}
        onHeadingParse={handleNewHeadings}
      />
      <NoteRightOutline headings={headings} />
    </div>
  );
};

export default SubjectNotePage;
