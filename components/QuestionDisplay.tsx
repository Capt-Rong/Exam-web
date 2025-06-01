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
  // Helper to check if a given option key is correct
  const isOptionCorrect = (optionKey: string): boolean => {
    if (correctAnswerKey === undefined || correctAnswerKey === null)
      return false;

    let correctKeysArray: string[];
    if (Array.isArray(correctAnswerKey)) {
      correctKeysArray = correctAnswerKey;
    } else {
      // If it's a string (e.g., "A, B, C" from ResultPage), split it into an array
      correctKeysArray = correctAnswerKey.split(",").map((k) => k.trim());
    }
    return correctKeysArray.includes(optionKey);
  };

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
          const isThisOptionActuallyCorrect = isOptionCorrect(key);

          const isUserSelectionCorrectForThisOption =
            isSelected && isThisOptionActuallyCorrect;

          const isUserSelectionIncorrectForThisOption =
            isSelected && !isThisOptionActuallyCorrect;

          let buttonStyle = "border-gray-300 hover:bg-gray-100";
          if (isResultMode) {
            if (isThisOptionActuallyCorrect) {
              buttonStyle = "border-green-500 bg-green-50 text-green-700"; // Correct option
            }
            if (isSelected) {
              // Override for selected options
              if (isThisOptionActuallyCorrect) {
                buttonStyle =
                  "border-green-600 bg-green-100 text-green-800 ring-2 ring-green-500"; // User selected a correct option
              } else {
                buttonStyle =
                  "border-red-500 bg-red-100 text-red-700 ring-2 ring-red-500"; // User selected an incorrect option
              }
            } else if (isThisOptionActuallyCorrect) {
              // If the option is correct but not selected by the user, show it as correct but not emphasized as user's choice
              buttonStyle = "border-green-500 bg-green-50 text-green-700";
            } else {
              // Default for non-selected, incorrect options in result mode
              buttonStyle = "border-gray-300 text-gray-500";
            }
          } else if (isSelected) {
            // Non-result mode (exam taking)
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
              {/* Show check only if user selected THIS specific correct option */}
              {isResultMode && isUserSelectionCorrectForThisOption && (
                <CheckCircle className="text-green-600 ml-2" />
              )}
              {/* Show X only if user selected THIS specific option and it's incorrect */}
              {isResultMode && isUserSelectionIncorrectForThisOption && (
                <XCircle className="text-red-600 ml-2" />
              )}
            </button>
          );
        })}
      </div>
      {isResultMode && correctAnswerKey && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Correct Answer:{" "}
            {/* Display logic remains the same as ResultPage sends a pre-formatted string */}
            {typeof correctAnswerKey === "string"
              ? correctAnswerKey
              : correctAnswerKey.join(", ")}
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
