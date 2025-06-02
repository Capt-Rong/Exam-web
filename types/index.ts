// types/index.ts or your main types definition file

// Existing Question type (ensure it aligns with QuestionDisplay needs)
export interface Question {
  id: string;
  content: string;
  options: { [key: string]: string };
  correct_answer: string; // Or string[] if QuestionDisplay handles multiple correct answers selection directly
  explanation?: string;
}

// Type for questions fetched directly from the Supabase 'questions' table
export interface FetchedQuestion {
  id: string;
  content: string;
  options: { [key: string]: string }; // JSONB from Supabase is usually object/dictionary
  correct_answer_key: string[]; // As per your questions.sql schema
  explanation?: string | null;
  question_number?: number | null;
  // Add other fields from your questions table if needed (e.g., chapter_id, tags, notes)
}

// Type for Test Information used in ExamTakingPage and TestSubjectPanel
export interface TestInfo {
  id: string; // Test ID
  testCode: string; // Could be a shortened version of ID or a specific code
  categoryName: string; // e.g., "醫事檢驗師"
  subjectName: string;
  durationInSeconds: number;
}

// Existing TestSessionData (ensure it matches what you intend to use)
// This might need to be revised based on how session data is actually structured and fetched.
export interface TestSessionData {
  id: string; // Session ID, not Test ID
  testCode: string;
  categoryName: string;
  subjectName: string;
  durationInSeconds: number;
  questions: Question[]; // Array of questions for display
  // Potentially add user_id, start_time, end_time, score for a full session object later
}

// You might also want a type for SubjectCard props if not already defined
export interface SubjectCardProps {
  subjectName: string;
  description: string | null;
  bgColorClass: string;
  textColorClass: string;
  buttonColorClass: string;
  href: string;
}

// Props for QuestionNumbersPanel
export interface QuestionNumbersPanelProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  questionsStatus?: Array<
    "correct" | "incorrect" | "unanswered" | "answered" | "flagged"
  >; // Made optional if combining with userAnswers
  userScore?: number;
  userAnswers?: { [questionId: string]: string };
  questions?: { id: string }[];
}

// Type for individual Note content
export interface Note {
  id: string;
  title: string;
  content: string;
  chapter_id?: string;
  order?: number;
  // created_at?: string; // Optional: if you fetch/use it
  // updated_at?: string; // Optional: if you fetch/use it
}

// Type for Headings extracted from Markdown for right outline
export interface Heading {
  id: string;
  text: string;
  level: number;
}

// Type for basic note info, typically used in lists (like in a chapter's notes array)
export interface BasicNoteInfo {
  id: string;
  title: string;
  order?: number;
}

// Type for Chapter, including its notes for the sidebar
export interface Chapter {
  id: string;
  title: string;
  subject_id?: string; // Foreign key to subjects table
  order?: number;
  parent_id?: string | null; // Optional: For hierarchical chapters
  notes: BasicNoteInfo[]; // Array of notes belonging to this chapter
  subChapters?: Chapter[]; // Optional: For nested chapters
}
