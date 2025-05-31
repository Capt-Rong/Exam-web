import React from "react";
import { QuestionNumbersPanelProps } from "@/types";

const QuestionNumbersPanel: React.FC<QuestionNumbersPanelProps> = ({
  totalQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  questionsStatus = [],
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const status = questionsStatus[i];
          let bgColor = "bg-white hover:bg-gray-200";
          let textColor = "text-gray-700";

          if (i === currentQuestionIndex) {
            bgColor = "bg-blue-500 hover:bg-blue-600";
            textColor = "text-white";
          } else if (status === "correct") {
            bgColor = "bg-green-500 hover:bg-green-700";
            textColor = "text-white";
          } else if (status === "incorrect") {
            bgColor = "bg-red-500 hover:bg-red-700";
            textColor = "text-white";
          } else if (status === "answered") {
            bgColor = "bg-green-200 hover:bg-green-300";
            textColor = "text-green-800";
          } else if (status === "flagged") {
            bgColor = "bg-yellow-200 hover:bg-yellow-300";
            textColor = "text-yellow-800";
          }

          return (
            <button
              key={i}
              onClick={() => onQuestionSelect(i)}
              className={`w-full aspect-square flex items-center justify-center text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${bgColor} ${textColor}`}
              aria-current={i === currentQuestionIndex ? "page" : undefined}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNumbersPanel;
