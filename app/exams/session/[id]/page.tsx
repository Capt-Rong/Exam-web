"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // To get [id] from URL
import { Menu } from "lucide-react"; // Icon for toggle button

import QuestionNumbersPanel from "@/components/QuestionNumbersPanel";
import TestSubjectPanel from "@/components/TestSubjectPanel";
import QuestionDisplay from "@/components/QuestionDisplay";
import { Question, TestSessionData } from "@/types";
// import { createClient } from '@/lib/supabase/client'; // For client-side data fetching later

// MOCK DATA - REMOVE AND REPLACE WITH ACTUAL FETCHING
const MOCK_QUESTIONS: Question[] = [
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
  },
  // Add more mock questions up to 80 if needed for testing QuestionNumbersPanel
];

for (let i = 3; i <= 80; i++) {
  MOCK_QUESTIONS.push({
    id: `q${i}`,
    content: `This is question ${i}. What is the answer?\nSecond line of the question content.`,
    options: {
      A: `Option A for Q${i}`,
      B: `Option B for Q${i}`,
      C: `Option C for Q${i}`,
      D: `Option D for Q${i}`,
    },
    correct_answer: "A",
  });
}

const MOCK_SESSION_DATA: TestSessionData = {
  id: "mocksession123",
  testCode: "2308",
  categoryName: "醫事檢驗師",
  subjectName: "臨床血液學與血庫學",
  durationInSeconds: 1 * 60 * 60, // 1 hour
  questions: MOCK_QUESTIONS,
};
// END MOCK DATA

const SessionPage = () => {
  const params = useParams();
  const sessionId = params.id; // Get session ID from URL

  // const supabase = createClient(); // Initialize Supabase client if needed for fetching
  const [sessionData, setSessionData] = useState<TestSessionData | null>(
    MOCK_SESSION_DATA
  ); // Using mock data for now
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // State for panel visibility, true by default on larger screens

  useEffect(() => {
    // Initialize panel visibility based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // md breakpoint
        setIsPanelOpen(false);
      } else {
        setIsPanelOpen(true);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // TODO: Fetch actual session data based on sessionId
    // For now, we just use mock data and simulate a load
    const loadData = async () => {
      setIsLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // const { data, error } = await supabase.from('test_sessions').select('*, questions(*)').eq('id', sessionId).single();
      // if (error) { console.error('Error fetching session:', error); setSessionData(null); }
      // else { setSessionData(data); }
      setSessionData(MOCK_SESSION_DATA); // Using mock data
      setIsLoading(false);
    };

    if (sessionId) {
      loadData();
    }
  }, [sessionId]);

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 768) {
      // Close panel on selection on small screens
      setIsPanelOpen(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionKey,
    }));
  };

  const goToNextQuestion = () => {
    if (
      sessionData &&
      currentQuestionIndex < sessionData.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    // TODO: Implement what happens when time is up (e.g., auto-submit, show results)
    alert("Time is up! Auto-submitting...");
    // Potentially navigate to results page or show a summary
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading test session...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading test session or session not found.</p>
      </div>
    );
  }

  const currentQuestion = sessionData.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <button
          onClick={togglePanel}
          className="p-2 rounded-md md:hidden hover:bg-gray-200"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 flex-grow md:text-center">
          {sessionData.subjectName}
        </h1>
        <div className="w-8 md:hidden">
          {/* Spacer for mobile to balance title */}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden p-4 md:p-6 gap-4 md:gap-6">
        {/* Left Panel: Question Numbers - conditionally rendered and styled */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out md:static md:w-1/4 lg:w-1/5 md:transform-none md:bg-transparent md:p-0 md:shadow-none md:rounded-none shadow-xl rounded-r-lg ${
            isPanelOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {/* Overlay for mobile to close panel on click outside */}
          {isPanelOpen && (
            <div
              onClick={togglePanel}
              className="fixed inset-0 bg-black opacity-25 z-20 md:hidden"
            ></div>
          )}
          <div className="relative z-10 bg-gray-100 rounded-lg md:shadow-md h-full">
            {" "}
            {/* Ensure content is above overlay and has style */}
            <QuestionNumbersPanel
              totalQuestions={sessionData.questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              // TODO: Implement questionsStatus based on userAnswers or other flags
            />
          </div>
        </aside>

        {/* Right Panel: Test Info and Question */}
        <main
          className={`flex-1 flex flex-col h-full overflow-y-auto bg-white p-2 rounded-lg shadow transition-all duration-300 ease-in-out md:ml-0`}
        >
          <TestSubjectPanel
            testCode={sessionData.testCode}
            categoryName={sessionData.categoryName}
            subjectName={sessionData.subjectName}
            initialDurationInSeconds={sessionData.durationInSeconds}
            onTimeUp={handleTimeUp}
          />

          {currentQuestion && (
            <QuestionDisplay
              questionNumber={currentQuestionIndex + 1}
              questionContent={currentQuestion.content}
              options={currentQuestion.options}
              selectedOptionKey={userAnswers[currentQuestion.id] || null}
              onOptionSelect={(optionKey) =>
                handleOptionSelect(currentQuestion.id, optionKey)
              }
              // TODO: Add isSubmitted and correctAnswerKey logic later for review mode
            />
          )}

          {/* Navigation Buttons */}
          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestionIndex < sessionData.questions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                // TODO: Implement submit logic
                onClick={() =>
                  alert("End of test - Submit logic to be implemented")
                }
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 hover:cursor-pointer"
              >
                Submit Test
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SessionPage;
