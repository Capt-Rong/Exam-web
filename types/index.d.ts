//subjectCard
export interface SubjectCardProps {
  subjectName: string;
  description: string; // Added description to match reference image more closely
  bgColorClass: string; // e.g., 'bg-green-200'
  textColorClass: string; // e.g., 'text-green-800'
  buttonColorClass: string; // e.g., 'bg-green-600 hover:bg-green-700'
  href: string; // Link for the card
}

//questionNumbersPanel
export type QuestionStatus =
  | "unanswered"
  | "answered"
  | "flagged"
  | "correct"
  | "incorrect";

export interface QuestionNumbersPanelProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  questionsStatus?: QuestionStatus[];
  userScore?: number; // Added userScore for display
}

//testSubjectPanel
export interface TestSubjectPanelProps {
  testCode: string;
  categoryName: string;
  subjectName: string;
  initialDurationInSeconds: number; // For session page, can be total duration
  onTimeUp?: () => void;
  usedTimeInSeconds?: number; // Added for displaying time taken on results page
  isResultMode?: boolean; // Added to indicate if the panel is in a result display context
}

//questionDisplay
export interface QuestionOptions {
  //assume the options are structured like: { "A": "Option A Text", "B": "Option B Text", ... }
  [key: string]: string;
}

export interface QuestionDisplayProps {
  questionNumber: number;
  questionContent: string;
  options: QuestionOptions;
  selectedOptionKey: string | null;
  onOptionSelect: (optionKey: string) => void;
  isSubmitted?: boolean; // Or use a more general mode flag
  correctAnswerKey?: string | string[]; // Can be a string or an array of strings
  explanation?: string; // To show explanation
  isResultMode?: boolean; // Explicit flag for result display
}

// sessionPage
export interface Question {
  // Mock data structure - replace with actual data fetching
  id: string;
  content: string;
  options: { [key: string]: string };
  correct_answer: string;
  explanation?: string; // Added explanation field
}

export interface TestSessionData {
  id: string;
  testCode: string;
  categoryName: string;
  subjectName: string;
  durationInSeconds: number;
  questions: Question[];
}

// Note Page specific types
export interface Note {
  id: string;
  title: string;
  // slug?: string; // If using slugs for URLs
  // content?: string; // Markdown content, could be fetched separately
}

export interface Chapter {
  id: string;
  title: string;
  // slug?: string;
  notes: Note[];
}

export interface Heading {
  id: string;
  level: number;
  text: string;
}

// 應該在 types/index.ts 或類似檔案中
export interface FetchedQuestion {
  id: string;
  content: string;
  options: { [key: string]: string };
  correct_answer_key: string[];
  explanation?: string | null;
  question_number?: number | null;
}

export interface TestInfo {
  id: string;
  testCode: string;
  categoryName: string;
  subjectName: string;
  durationInSeconds: number;
}

export interface Question {
  // 確保 Question 類型也存在且符合您的需求
  id: string;
  content: string;
  options: { [key: string]: string };
  correct_answer: string;
  explanation?: string;
}

export interface QuestionNumbersPanelProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  questionsStatus?: Array<
    "correct" | "incorrect" | "unanswered" | "answered" | "flagged"
  >;
  userScore?: number;
  userAnswers?: { [questionId: string]: string }; // 確保這個存在
  questions?: { id: string }[]; // 確保這個存在
}
