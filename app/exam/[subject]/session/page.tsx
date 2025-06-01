import React from "react";
import Link from "next/link";
import { createClient } from "../../../../lib/supabase/server"; // Adjusted path
import { cookies } from "next/headers";
import { notFound } from "next/navigation"; // To handle case where subject is not found

// Interface for the test data we expect from Supabase
interface Test {
  id: string;
  name: string;
  description: string | null;
  // duration_in_seconds: number; // Can be added if needed for display
}

const ExamSessionSelectionPage = async ({
  // Changed to async function
  params,
}: {
  params: { subject: string }; // subject here is the slug
}) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const currentSubjectSlug = params.subject;

  // 1. Fetch the subject_id based on the slug
  const { data: subjectData, error: subjectError } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("slug", currentSubjectSlug)
    .single(); // We expect only one subject for a given slug

  if (subjectError || !subjectData) {
    console.error(
      `Error fetching subject with slug ${currentSubjectSlug}:`,
      subjectError
    );
    notFound(); // Or return a custom error component
  }

  // 2. Fetch tests for the obtained subject_id
  const { data: testsData, error: testsError } = await supabase
    .from("tests")
    .select("id, name, description")
    .eq("subject_id", subjectData.id)
    .order("created_at", { ascending: false }); // Show newest tests first

  const tests: Test[] = testsData as Test[]; // Explicitly type testsData

  if (testsError) {
    console.error(
      `Error fetching tests for subject ${subjectData.name}:`,
      testsError
    );
    // Handle error, e.g., show a message to the user
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        Test Sessions for {subjectData.name} {/* Display actual subject name */}
      </h1>
      <p className="text-gray-500 mb-8">
        Please select a test session to start.
      </p>
      {tests && tests.length > 0 ? (
        <div className="space-y-6">
          {tests.map((testSession) => (
            <div
              key={testSession.id}
              className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{testSession.name}</h2>
                {testSession.description && (
                  <p className="text-gray-600 mt-1">
                    {testSession.description}
                  </p>
                )}
              </div>
              <Link
                href={`/exam/${currentSubjectSlug}/session/${testSession.id}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-150"
              >
                Start Test
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">
          No test sessions available for this subject at the moment.
        </p>
      )}
      {/* Pagination (remains optional and would need further implementation if tests are numerous) */}
      <div className="mt-8 flex justify-center">
        <nav aria-label="Page navigation">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <a
                href="#"
                className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                4
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              ></a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ExamSessionSelectionPage;
