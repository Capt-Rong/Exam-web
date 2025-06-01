"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

import QuestionNumbersPanel from "@/components/QuestionNumbersPanel";
import TestSubjectPanel from "@/components/TestSubjectPanel";
import QuestionDisplay from "@/components/QuestionDisplay";
// Ensure these types are correctly defined and exported from '@/types'
import { FetchedQuestion, Question, TestInfo } from "@/types";
import { createClient } from "@/lib/supabase/client";

// Helper function to transform DB questions (FetchedQuestion) to display format (Question)
const transformFetchedQuestion = (fq: FetchedQuestion): Question => {
  // The 'correct_answer' field in the original MOCK_QUESTIONS was a single string.
  // The DB 'correct_answer_key' is string[].
  // For now, we'll take the first key as the 'correct_answer' for the Question type.
  // This might need adjustment if QuestionDisplay is to handle multiple correct answers for display logic.
  return {
    id: fq.id,
    content: fq.content,
    options: fq.options, // Assuming fq.options is already in the correct {key: string} format
    correct_answer: fq.correct_answer_key?.[0] || "", // Take the first answer key
    explanation: fq.explanation || undefined, // Ensure explanation can be undefined
  };
};

const ExamTakingPage = ({
  params,
}: {
  params: { subject: string; id: string }; // id here is test_id
}) => {
  const { subject: subjectSlug, id: testId } = params;
  const supabase = createClient();

  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]); // Holds Question[] for display
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string; // Store selected option key, e.g., "A"
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Default to open on larger screens
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const loadExamData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch test details (name, duration, subject_id)
      const { data: testDetailsData, error: testDetailsError } = await supabase
        .from("tests")
        .select("name, duration_in_seconds, subject_id")
        .eq("id", testId)
        .single();

      if (testDetailsError) throw testDetailsError;
      if (!testDetailsData) throw new Error("Test not found.");

      // 2. Fetch subject name using subject_id from testDetailsData
      let subjectNameDisplay = subjectSlug; // Fallback to slug
      if (testDetailsData.subject_id) {
        const { data: subjectDetails, error: subjectDetailsError } =
          await supabase
            .from("subjects")
            .select("name")
            .eq("id", testDetailsData.subject_id)
            .single();
        if (subjectDetailsError) {
          console.warn(
            "Could not fetch subject details:",
            subjectDetailsError.message
          );
        } else if (subjectDetails) {
          subjectNameDisplay = subjectDetails.name;
        }
      }

      setTestInfo({
        id: testId,
        testCode: testId.substring(0, 7), // Example: use part of UUID as testCode
        categoryName: "醫事檢驗師", // Placeholder, consider fetching if dynamic
        subjectName: subjectNameDisplay,
        durationInSeconds: testDetailsData.duration_in_seconds,
      });

      // 3. Fetch questions for the test
      const { data: fetchedQuestionsData, error: questionsError } =
        await supabase
          .from("questions")
          .select(
            "id, content, options, explanation, correct_answer_key, question_number"
          )
          .eq("test_id", testId)
          .order("question_number", { ascending: true });

      if (questionsError) throw questionsError;
      if (!fetchedQuestionsData || fetchedQuestionsData.length === 0) {
        throw new Error("No questions found for this test.");
      }

      const formattedQuestions = fetchedQuestionsData.map(
        transformFetchedQuestion
      );
      setQuestions(formattedQuestions);
      setStartTime(new Date()); // Record start time
    } catch (e: unknown) {
      console.error("Error loading exam data:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else if (typeof e === "string") {
        setError(e);
      } else {
        setError("Failed to load exam data due to an unknown error.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [testId, supabase, subjectSlug]);

  useEffect(() => {
    loadExamData();
  }, [loadExamData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsPanelOpen(false);
      } else {
        setIsPanelOpen(true);
      }
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

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionKey,
    }));
  };

  const goToNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    // TODO: Implement actual submission logic (e.g., save to DB) before navigating
    alert("Time is up! Navigating to results...");
    // Temporary navigation, passing answers via URL (consider a more robust solution)
    window.location.href = `/exam/${subjectSlug}/session/${testId}/result?user_answers=${encodeURIComponent(
      JSON.stringify(userAnswers)
    )}&start_time=${startTime?.toISOString()}`;
  };

  const handleSubmit = async () => {
    // TODO: Implement actual submission logic (save to DB, calculate score server-side)
    alert("Submitting test... (actual submission logic pending)");
    // Temporary navigation
    window.location.href = `/exam/${subjectSlug}/session/${testId}/result?user_answers=${encodeURIComponent(
      JSON.stringify(userAnswers)
    )}&start_time=${startTime?.toISOString()}`;
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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-xl mb-4">Error loading test:</p>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link
          href={`/exam/${subjectSlug}/session`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Test Selection
        </Link>
      </div>
    );
  }

  if (!testInfo || questions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-gray-700 text-xl mb-6">
          Test data is not available or no questions found.
        </p>
        <Link
          href={`/exam/${subjectSlug}/session`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Test Selection
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
        <button
          onClick={togglePanel}
          className="p-2 rounded-md md:hidden hover:bg-gray-200"
          aria-label="Toggle question panel"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-center text-gray-800 flex-grow truncate px-2">
          {testInfo.subjectName} - {testInfo.testCode}
        </h1>
        {/* Invisible div to help center title when menu is present on mobile */}
        <div className="w-8 h-8 md:hidden"></div>
      </header>

      <div className="flex flex-1 overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-60 sm:w-64 bg-gray-100 p-3 transform transition-transform duration-300 ease-in-out md:static md:w-1/4 lg:w-1/5 md:transform-none md:bg-transparent md:p-0 md:shadow-none md:rounded-none shadow-xl rounded-r-lg ${
            isPanelOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {isPanelOpen && (
            <div
              onClick={togglePanel}
              className="fixed inset-0 bg-black opacity-25 z-20 md:hidden"
              aria-hidden="true"
            ></div>
          )}
          <div className="relative z-10 bg-gray-100 rounded-lg md:shadow-md h-full flex flex-col">
            {/* Pass questions with IDs for the panel to map answers correctly if needed */}
            <QuestionNumbersPanel
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              userAnswers={userAnswers}
              questions={questions.map((q) => ({ id: q.id }))} // Pass only id
            />
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-white p-3 md:p-6 rounded-lg shadow">
          <TestSubjectPanel
            testCode={testInfo.testCode}
            categoryName={testInfo.categoryName}
            subjectName={testInfo.subjectName}
            initialDurationInSeconds={testInfo.durationInSeconds}
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
              // correctAnswerKey={currentQuestion.correct_answer} // Pass for review mode later
              // explanation={currentQuestion.explanation} // Pass for review mode later
            />
          )}

          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
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

export default ExamTakingPage;
