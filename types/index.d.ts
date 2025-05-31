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
}

//testSubjectPanel
export interface TestSubjectPanelProps {
  testCode: string;
  categoryName: string;
  subjectName: string;
  initialDurationInSeconds: number; // Duration in seconds
  onTimeUp?: () => void; // Made optional as it's not used in result page
  userScore?: number; // Added userScore
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
  correctAnswerKey?: string; // To show correct answer after submission or in review
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
