"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation"; // For accessing URL params
import QuestionNumbersPanel from "@/components/QuestionNumbersPanel";
import TestSubjectPanel from "@/components/TestSubjectPanel";
import QuestionDisplay from "@/components/QuestionDisplay";
// Ensure these types are correctly defined and exported from '@/types'
import { FetchedQuestion, Question, TestInfo } from "@/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link"; // For navigation if needed

// Helper function to transform DB questions to display format (similar to ExamTakingPage)
const transformFetchedQuestionForResult = (fq: FetchedQuestion): Question => {
  return {
    id: fq.id,
    content: fq.content,
    options: fq.options,
    correct_answer: fq.correct_answer_key?.[0] || "", // For display, might take the first correct answer
    explanation: fq.explanation || undefined,
  };
};

// Type for the structured result data we will build
interface ResultPageData extends TestInfo {
  questions: Question[]; // Transformed questions for display
  userScore: number;
  userAnswers: { [questionId: string]: string };
  questionsStatus: Array<"correct" | "incorrect" | "unanswered">;
  usedTimeInSeconds: number;
  allCorrectAnswerKeys: { [questionId: string]: string[] }; // To store all correct keys from DB for checking
}

const ResultPage = () => {
  const params = useParams(); // Gets { subject: string, id: string }
  const searchParams = useSearchParams(); // Gets URL query parameters

  const [resultData, setResultData] = useState<ResultPageData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadAndProcessResultData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const subjectSlug = params.subject as string;
      const testId = params.id as string;

      const userAnswersString = searchParams.get("user_answers");
      const startTimeString = searchParams.get("start_time");

      if (!userAnswersString || !testId) {
        throw new Error("Missing user answers or test ID in URL parameters.");
      }

      const userAnswersFromURL: { [questionId: string]: string } = JSON.parse(
        decodeURIComponent(userAnswersString)
      );
      const startTime = startTimeString
        ? new Date(startTimeString)
        : new Date(); // Fallback to now if not provided
      const endTime = new Date();
      const usedTimeInSeconds = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000
      );

      // 1. Fetch test details
      const { data: testDetailsData, error: testDetailsError } = await supabase
        .from("tests")
        .select("name, duration_in_seconds, subject_id")
        .eq("id", testId)
        .single();

      if (testDetailsError) throw testDetailsError;
      if (!testDetailsData) throw new Error("Test details not found.");

      // 2. Fetch subject name
      let subjectNameDisplay = subjectSlug;
      if (testDetailsData.subject_id) {
        const { data: subjectDetails, error: subjectDetailsError } =
          await supabase
            .from("subjects")
            .select("name")
            .eq("id", testDetailsData.subject_id)
            .single();
        if (!subjectDetailsError && subjectDetails) {
          subjectNameDisplay = subjectDetails.name;
        }
      }

      // 3. Fetch all questions for this test (including correct_answer_key)
      const { data: fetchedQuestions, error: questionsError } = await supabase
        .from("questions")
        .select(
          "id, content, options, explanation, correct_answer_key, question_number"
        ) // Ensure correct_answer_key is fetched
        .eq("test_id", testId)
        .order("question_number", { ascending: true });

      if (questionsError) throw questionsError;
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        throw new Error(
          "No questions found for this test to generate results."
        );
      }

      // 4. Process results: calculate score and status
      let calculatedScore = 0;
      const questionsStatus: Array<"correct" | "incorrect" | "unanswered"> = [];
      const allCorrectAnswerKeys: { [questionId: string]: string[] } = {};

      const transformedDisplayQuestions = fetchedQuestions.map(
        (fq: FetchedQuestion) => {
          allCorrectAnswerKeys[fq.id] = fq.correct_answer_key; // Store all correct keys
          const userAnswer = userAnswersFromURL[fq.id];
          let status: "correct" | "incorrect" | "unanswered" = "unanswered";

          if (userAnswer !== undefined) {
            // A question is correct if the user's answer is IN the array of correct_answer_key(s)
            if (fq.correct_answer_key.includes(userAnswer)) {
              status = "correct";
              calculatedScore++;
            } else {
              status = "incorrect";
            }
          }
          questionsStatus.push(status);
          return transformFetchedQuestionForResult(fq); // Transform for display
        }
      );

      setResultData({
        id: testId,
        testCode: testId.substring(0, 7),
        categoryName: "醫事檢驗師", // Placeholder
        subjectName: subjectNameDisplay,
        durationInSeconds: testDetailsData.duration_in_seconds,
        questions: transformedDisplayQuestions,
        userScore: calculatedScore,
        userAnswers: userAnswersFromURL,
        questionsStatus,
        usedTimeInSeconds,
        allCorrectAnswerKeys, // Store for QuestionDisplay
      });
    } catch (e: unknown) {
      console.error("Error loading or processing result data:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred while preparing results.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [params, searchParams, supabase]);

  useEffect(() => {
    loadAndProcessResultData();
  }, [loadAndProcessResultData]);

  useEffect(() => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center">
        <p className="text-red-500 text-xl mb-4">
          {error ? "Error loading results:" : "Result data not found."}
        </p>
        {error && <p className="text-gray-700 mb-6">{error}</p>}
        <Link
          href="/" // Link to homepage or a relevant previous page
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  const currentQuestion = resultData.questions[currentQuestionIndex];
  // Use the specific correct answer key(s) for the current question from the allCorrectAnswerKeys map
  const currentQuestionCorrectKeys = resultData.allCorrectAnswerKeys[
    currentQuestion.id
  ] || [currentQuestion.correct_answer];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Optional: Add a header or navigation bar specific to results page */}
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
            <QuestionNumbersPanel
              totalQuestions={resultData.questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              questionsStatus={resultData.questionsStatus}
              userScore={resultData.userScore}
              // No 'questions' prop with IDs needed if not using it for answer marking logic here
            />
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-white p-3 md:p-6 rounded-lg shadow">
          <TestSubjectPanel
            testCode={resultData.testCode}
            categoryName={resultData.categoryName}
            subjectName={resultData.subjectName}
            initialDurationInSeconds={resultData.durationInSeconds}
            usedTimeInSeconds={resultData.usedTimeInSeconds}
            isResultMode={true} // Indicate to TestSubjectPanel it's a result view
          />

          {currentQuestion && (
            <QuestionDisplay
              questionNumber={currentQuestionIndex + 1}
              questionContent={currentQuestion.content}
              options={currentQuestion.options}
              selectedOptionKey={
                resultData.userAnswers[currentQuestion.id] || null
              }
              onOptionSelect={() => {}} // Selection disabled in result mode
              isResultMode={true}
              // Pass the array of correct keys for the specific question
              correctAnswerKey={currentQuestionCorrectKeys.join(", ")} // Join if QuestionDisplay expects a string
              explanation={currentQuestion.explanation}
            />
          )}

          <div className="mt-auto pt-6 flex justify-between">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
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
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              // Placeholder for alignment, or could be a "Back to Dashboard" button
              <Link
                href={`/exam/${params.subject}/session/`} // Or a more relevant link like back to subject selection
                className="px-5 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Finish Review
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultPage;
