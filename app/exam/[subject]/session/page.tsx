import React from "react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  description: string;
}

const subjectsData: Subject[] = [
  {
    id: "111-1-mathematics",
    name: "111-1 Biochemistry",
    description: "Biochemistry",
  },
  {
    id: "111-2-physics",
    name: "111-2 Biochemistry",
    description: "Biochemistry",
  },
  {
    id: "110-1-chemistry",
    name: "110-1 Biochemistry",
    description: "Biochemistry",
  },
  {
    id: "110-2-biology",
    name: "110-2 Biochemistry",
    description: "Biochemistry",
  },
  {
    id: "109-1-history",
    name: "109-1 Biochemistry",
    description: "Biochemistry",
  },
  {
    id: "109-2-geography",
    name: "109-2 Biochemistry",
    description: "Biochemistry",
  },
];

const ExamSubjectSessionPage = ({
  params,
}: {
  params: { subject: string };
}) => {
  const currentSubject = params.subject;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        Test Sessions for{" "}
        {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)}
      </h1>
      <p className="text-gray-500 mb-8">
        Please select a test session to start.
      </p>
      <div className="space-y-6">
        {subjectsData.map((subjectSession) => (
          <div
            key={subjectSession.id}
            className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{subjectSession.name}</h2>
              <p className="text-gray-600 mt-1">{subjectSession.description}</p>
            </div>
            <Link
              href={`/exam/${currentSubject}/session/${subjectSession.id}`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Test
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination (optional, can be implemented later) */}
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

export default ExamSubjectSessionPage;
