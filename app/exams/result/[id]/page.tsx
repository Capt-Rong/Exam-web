"use client";

import React, { useState, useEffect } from "react";
// We might need useParams if the result is tied to a specific session ID in the URL
// import { useParams } from "next/navigation";
import QuestionNumbersPanel from "@/components/QuestionNumbersPanel";
import TestSubjectPanel from "@/components/TestSubjectPanel";
import QuestionDisplay from "@/components/QuestionDisplay"; // This might become QuestionResultDisplay
import { Question, TestSessionData } from "@/types"; // Assuming TestSessionData might still be relevant for subject info

// MOCK DATA - REMOVE AND REPLACE WITH ACTUAL FETCHING
// This will need to be adapted for result data
const MOCK_RESULT_DATA: TestSessionData & {
  userScore: number;
  userAnswers: { [key: string]: string };
  questionsStatus: Array<"correct" | "incorrect" | "unanswered">;
} = {
  id: "mockresult123",
  testCode: "2308",
  categoryName: "醫事檢驗師",
  subjectName: "臨床血液學與血庫學",
  durationInSeconds: 0, // Duration might not be relevant here or could be the time taken
  questions: [
    {
      id: "q1",
      content:
        "某成年女性最近體檢發現有點貧血：血色素10 g/dL、MCV 72 fL，白血球和血小板數量皆正常。就貧血的原因而言，下列何者最不可能？",
      options: {
        A: "Iron deficiency anemia",
        B: "Hereditary thalassemia",
        C: "Anemia of chronic disorder",
        D: "Pernicious anemia",
      },
      correct_answer: "D",
      explanation:
        "Pernicious anemia typically presents with macrocytic anemia (MCV > 100 fL), not microcytic (MCV 72 fL).",
    },
    {
      id: "q2",
      content:
        "某名中年男性因慢性咳嗽就診，胸部X光顯示肺部有模糊影，血液檢查顯示白血球升高：總白血球數為12,000/uL。以下哪種診斷最不可能？",
      options: {
        A: "Bacterial pneumonia",
        B: "Tuberculosis",
        C: "Lung cancer",
        D: "Allergy related asthma",
      },
      correct_answer: "D",
      explanation:
        "Allergy related asthma typically does not cause infiltrates on chest X-ray or significant leukocytosis without infection.",
    },
    // Add more mock questions
  ],
  userScore: 85, // Example score
  userAnswers: { q1: "D", q2: "A" }, // Example user answers
  questionsStatus: ["correct", "incorrect"], // Example status based on userAnswers and correct_answer
};

for (let i = 3; i <= 20; i++) {
  // Reduced number for mock result
  const isCorrect = Math.random() > 0.5;
  MOCK_RESULT_DATA.questions.push({
    id: `q${i}`,
    content: `This is question ${i} for the result. How did the user do?`,
    options: {
      A: `Option A for Q${i}`,
      B: `Option B for Q${i}`,
      C: `Option C for Q${i}`,
      D: `Option D for Q${i}`,
    },
    correct_answer: isCorrect ? "A" : "B",
    explanation: `This is the explanation for question ${i}. The correct option was ${
      isCorrect ? "A" : "B"
    }.`,
  });
  MOCK_RESULT_DATA.userAnswers[`q${i}`] = "A"; // Mocking all answered 'A'
  MOCK_RESULT_DATA.questionsStatus.push(isCorrect ? "correct" : "incorrect");
}

// END MOCK DATA

const ResultPage = () => {
  // const params = useParams();
  // const resultId = params.id; // If using dynamic routing for results

  const [resultData, setResultData] = useState<typeof MOCK_RESULT_DATA | null>(
    MOCK_RESULT_DATA
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Or false if directly using mock
  const [isPanelOpen, setIsPanelOpen] = useState(true); // For layout consistency with session page

  useEffect(() => {
    // Simulating data load for results
    const loadResultData = async () => {
      setIsLoading(true);
      // In a real app, fetch result data using resultId or other identifier
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResultData(MOCK_RESULT_DATA); // Using mock data
      setIsLoading(false);
    };
    loadResultData();

    // Adjust panel visibility based on screen size (similar to SessionPage)
    const handleResize = () => {
      if (window.innerWidth < 768) setIsPanelOpen(false);
      else setIsPanelOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 768) {
      setIsPanelOpen(false); // Close panel on selection on small screens
    }
  };

  // No toggle for panel in header, but keep function if needed for overlay
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading results or results not found.</p>
      </div>
    );
  }

  const currentQuestion = resultData.questions[currentQuestionIndex];

  return (
    // Assuming a similar overall page structure to session page
    // The local header is removed as per previous discussions, relying on global Navbar
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Optional: A specific header for the result page could go here or be part of the main content area */}
      {/* For now, we assume the global Navbar and Footer are sufficient */}

      <div className="flex flex-1 overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
        {/* Left Panel: Question Numbers */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out md:static md:w-1/4 lg:w-1/5 md:transform-none md:bg-transparent md:p-0 md:shadow-none md:rounded-none shadow-xl rounded-r-lg ${
            isPanelOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {isPanelOpen && (
            <div
              onClick={togglePanel} // Allows closing by clicking overlay on mobile
              className="fixed inset-0 bg-black opacity-25 z-20 md:hidden"
            ></div>
          )}
          <div className="relative z-10 bg-gray-100 rounded-lg md:shadow-md h-full">
            <QuestionNumbersPanel
              totalQuestions={resultData.questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              questionsStatus={resultData.questionsStatus} // Pass the new status prop
              // Markings for correct/incorrect will be handled in QuestionNumbersPanel
            />
          </div>
        </aside>

        {/* Right Panel: Test Info, Score, and Question Result */}
        <main
          className={`flex-1 flex flex-col h-full overflow-y-auto bg-white p-2 rounded-lg shadow transition-all duration-300 ease-in-out md:ml-0`}
        >
          <TestSubjectPanel
            testCode={resultData.testCode}
            categoryName={resultData.categoryName}
            subjectName={resultData.subjectName}
            initialDurationInSeconds={resultData.durationInSeconds} // Or time taken
            // onTimeUp is not relevant for results page
            userScore={resultData.userScore} // New prop for score
          />

          {currentQuestion && (
            <QuestionDisplay
              questionNumber={currentQuestionIndex + 1}
              questionContent={currentQuestion.content}
              options={currentQuestion.options}
              selectedOptionKey={
                resultData.userAnswers[currentQuestion.id] || null
              } // Show what user selected
              // For results, selection should be disabled:
              onOptionSelect={() => {}} // No action on select
              isResultMode={true} // New prop to indicate result display
              correctAnswerKey={currentQuestion.correct_answer} // Pass correct answer
              explanation={currentQuestion.explanation} // Pass explanation
            />
          )}

          {/* Navigation for questions, but no submission */}
          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 hover:cursor-pointer"
            >
              Previous
            </button>
            {currentQuestionIndex < resultData.questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(resultData.questions.length - 1, prev + 1)
                  )
                }
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 hover:cursor-pointer"
              >
                Next
              </button>
            ) : (
              // No submit button, or a "Back to Dashboard" type button could go here
              <div className="w-[90.55px]" /> // Placeholder to keep alignment if Next button isn't there
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultPage;
