import { QuestionDisplayProps } from "@/types";
import React from "react";

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionNumber,
  questionContent,
  options,
  selectedOptionKey,
  onOptionSelect,
  isSubmitted = false,
  correctAnswerKey = null,
}) => {
  const optionEntries = Object.entries(options);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Question {questionNumber}
      </h2>
      <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
        {questionContent}
      </p>

      <div className="space-y-3">
        {optionEntries.map(([key, text]) => {
          const isSelected = selectedOptionKey === key;
          let buttonStyle =
            "bg-white hover:bg-gray-100 border-gray-300 text-gray-700 hover:cursor-pointer hover:text-blue-500";
          let indicator = null;

          if (isSubmitted && correctAnswerKey) {
            if (key === correctAnswerKey) {
              buttonStyle = "bg-green-100 border-green-400 text-green-800";
              indicator = (
                <span className="text-green-600 ml-2">✓ Correct</span>
              );
            } else if (isSelected && key !== correctAnswerKey) {
              buttonStyle = "bg-red-100 border-red-400 text-red-800";
              indicator = (
                <span className="text-red-600 ml-2">✗ Incorrect</span>
              );
            }
          } else if (isSelected) {
            buttonStyle = "bg-blue-500 border-blue-500 text-white";
          }

          return (
            <button
              key={key}
              onClick={() => !isSubmitted && onOptionSelect(key)}
              disabled={isSubmitted}
              className={`w-full flex items-center p-4 text-left rounded-md border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${buttonStyle}`}
            >
              <span className="font-medium mr-3">{key}.</span>
              <span className="flex-1">{text}</span>
              {indicator}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
