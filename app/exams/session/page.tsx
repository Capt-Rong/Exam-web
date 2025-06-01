import React from "react";

interface Subject {
  id: string;
  name: string;
  description: string;
}

const subjectsData: Subject[] = [
  {
    id: "111-1-mathematics",
    name: "Mathematics",
    description:
      "Explore advanced mathematical concepts and problem-solving techniques.",
  },
  {
    id: "111-2-physics",
    name: "Physics",
    description:
      "Dive into the world of physics and understand the laws of nature.",
  },
  {
    id: "110-1-chemistry",
    name: "Chemistry",
    description: "Study chemical reactions and the properties of matter.",
  },
  {
    id: "110-2-biology",
    name: "Biology",
    description: "Explore the science of life and living organisms.",
  },
  {
    id: "109-1-history",
    name: "History",
    description:
      "Learn about historical events and their impact on the modern world.",
  },
  {
    id: "109-2-geography",
    name: "Geography",
    description:
      "Understand the physical features of the Earth and human-environment interaction.",
  },
];

const ExamSessionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Subjects</h1>
      <div className="space-y-6">
        {subjectsData.map((subject) => (
          <div
            key={subject.id}
            className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{subject.name}</h2>
              <p className="text-gray-600 mt-1">{subject.description}</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start Test
            </button>
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
              >
                {/* <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg> */}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ExamSessionPage;
