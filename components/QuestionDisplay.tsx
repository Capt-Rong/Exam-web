import React from "react";
import { QuestionDisplayProps } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questionNumber,
  questionContent,
  options,
  selectedOptionKey,
  onOptionSelect,
  isResultMode,
  correctAnswerKey,
  explanation,
}) => {
  return (
    <div className="p-1 flex-grow flex flex-col">
      <h2 className="text-xl font-semibold mb-1 text-gray-800">
        Question {questionNumber}
      </h2>
      <p
        className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed"
        style={{ fontFamily: "inherit" }}
      >
        {questionContent}
      </p>
      <div className="space-y-3 flex-grow">
        {Object.entries(options).map(([key, value]) => {
          const isSelected = selectedOptionKey === key;
          const isCorrect = correctAnswerKey === key;
          const isUserSelectionCorrect = isSelected && isCorrect;
          const isUserSelectionIncorrect =
            isSelected && !isCorrect && correctAnswerKey !== null;

          let buttonStyle = "border-gray-300 hover:bg-gray-100";
          if (isResultMode) {
            if (isCorrect) {
              buttonStyle = "border-green-500 bg-green-50 text-green-700";
            } else if (isSelected && !isCorrect) {
              buttonStyle = "border-red-500 bg-red-50 text-red-700";
            } else {
              buttonStyle = "border-gray-300 text-gray-500";
            }
          } else if (isSelected) {
            buttonStyle = "border-blue-500 bg-blue-50 ring-2 ring-blue-400";
          }

          return (
            <button
              key={key}
              onClick={() => !isResultMode && onOptionSelect(key)}
              disabled={isResultMode}
              className={`w-full text-left p-4 border rounded-lg transition-all duration-150 focus:outline-none flex justify-between items-center ${buttonStyle} ${
                isResultMode ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span className="flex-1">
                <span className="font-medium mr-2">{key}.</span>
                {value}
              </span>
              {isResultMode && isSelected && isUserSelectionCorrect && (
                <CheckCircle className="text-green-500 ml-2" />
              )}
              {isResultMode && isUserSelectionIncorrect && (
                <XCircle className="text-red-500 ml-2" />
              )}
            </button>
          );
        })}
      </div>
      {isResultMode && correctAnswerKey && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Correct Answer: {correctAnswerKey}
          </h3>
          {explanation && (
            <div className="p-3 bg-sky-50 rounded-md text-sky-700 text-sm">
              <p className="font-semibold mb-1">Explanation:</p>
              <p className="whitespace-pre-line leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
