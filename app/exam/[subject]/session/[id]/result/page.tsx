"use client";

import React, { useState, useEffect } from "react";
import QuestionNumbersPanel from "@/components/QuestionNumbersPanel";
import TestSubjectPanel from "@/components/TestSubjectPanel";
import QuestionDisplay from "@/components/QuestionDisplay";
import { TestSessionData } from "@/types"; // Question type is implicitly used via TestSessionData

// MOCK DATA - REMOVE AND REPLACE WITH ACTUAL FETCHING
const MOCK_RESULT_DATA: TestSessionData & {
  userScore: number;
  userAnswers: { [key: string]: string };
  questionsStatus: Array<"correct" | "incorrect" | "unanswered">;
  usedTimeInSeconds: number;
} = {
  id: "mockresult123",
  testCode: "2308",
  categoryName: "醫事檢驗師",
  subjectName: "臨床血液學與血庫學",
  durationInSeconds: 3600, // Total duration of the test
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
  ],
  userScore: 1, // Example score (e.g., number of correct answers)
  userAnswers: { q1: "D", q2: "A" },
  questionsStatus: ["correct", "incorrect"],
  usedTimeInSeconds: 2700, // Example: 45 minutes
};

// Populate more mock questions for a fuller example
for (let i = 3; i <= 10; i++) {
  // Reduced for brevity
  const isCorrect = Math.random() > 0.5;
  const userAnswer = isCorrect ? "A" : "C"; // Mock some answers
  MOCK_RESULT_DATA.questions.push({
    id: `q${i}`,
    content: `This is question ${i} for the result view. The user answered ${userAnswer}.`,
    options: {
      A: `Option A for Q${i}`,
      B: `Option B for Q${i}`,
      C: `Option C for Q${i}`,
      D: `Option D for Q${i}`,
    },
    correct_answer: "A", // Let's say A is always correct for these mock ones
    explanation: `This is the detailed explanation for why A is the correct answer for question ${i}.`,
  });
  MOCK_RESULT_DATA.userAnswers[`q${i}`] = userAnswer;
  MOCK_RESULT_DATA.questionsStatus.push(
    userAnswer === "A" ? "correct" : "incorrect"
  );
  if (userAnswer === "A") MOCK_RESULT_DATA.userScore++;
}

const ResultPage = () => {
  const [resultData, setResultData] = useState<typeof MOCK_RESULT_DATA | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    const loadResultData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate loading
      setResultData(MOCK_RESULT_DATA);
      setIsLoading(false);
    };
    loadResultData();

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
      setIsPanelOpen(false);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  if (isLoading || !resultData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">
          {isLoading ? "Loading results..." : "Result data not found."}
        </p>
      </div>
    );
  }

  const currentQuestion = resultData.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out md:static md:w-1/4 lg:w-1/5 md:transform-none md:bg-transparent md:p-0 md:shadow-none md:rounded-none shadow-xl rounded-r-lg ${
            isPanelOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {isPanelOpen && (
            <div
              onClick={togglePanel}
              className="fixed inset-0 bg-black opacity-25 z-20 md:hidden"
            ></div>
          )}
          <div className="relative z-10 bg-gray-100 rounded-lg md:shadow-md h-full flex flex-col">
            <QuestionNumbersPanel
              totalQuestions={resultData.questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              questionsStatus={resultData.questionsStatus}
              userScore={resultData.userScore} // Pass the score here
            />
          </div>
        </aside>

        <main
          className={`flex-1 flex flex-col h-full overflow-y-auto bg-white p-2 md:p-6 rounded-lg shadow transition-all duration-300 ease-in-out md:ml-0`}
        >
          <TestSubjectPanel
            testCode={resultData.testCode}
            categoryName={resultData.categoryName}
            subjectName={resultData.subjectName}
            initialDurationInSeconds={resultData.durationInSeconds} // Total duration context
            usedTimeInSeconds={resultData.usedTimeInSeconds} // Pass time taken
          />

          {currentQuestion && (
            <QuestionDisplay
              questionNumber={currentQuestionIndex + 1}
              questionContent={currentQuestion.content}
              options={currentQuestion.options}
              selectedOptionKey={
                resultData.userAnswers[currentQuestion.id] || null
              }
              onOptionSelect={() => {}} // Disabled for results
              isResultMode={true}
              correctAnswerKey={currentQuestion.correct_answer}
              explanation={currentQuestion.explanation}
            />
          )}

          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
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
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <div className="w-[90.55px] h-[38px]" /> // Placeholder for alignment
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultPage;
