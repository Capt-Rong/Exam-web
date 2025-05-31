import { TestSubjectPanelProps } from "@/types";
import React, { useState, useEffect } from "react";

const TestSubjectPanel: React.FC<TestSubjectPanelProps> = ({
  testCode,
  categoryName,
  subjectName,
  initialDurationInSeconds,
  onTimeUp,
}) => {
  const [remainingTime, setRemainingTime] = useState(initialDurationInSeconds);

  // countdown timer
  useEffect(() => {
    if (remainingTime <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, onTimeUp]);

  // format time
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-semibold text-gray-700">代號:</span>
          <span className="ml-2 text-gray-600">{testCode}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">類科名稱:</span>
          <span className="ml-2 text-gray-600">{categoryName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">科目名稱:</span>
          <span className="ml-2 text-gray-600">{subjectName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">剩餘時間:</span>
          <span
            className={`ml-2 font-bold ${
              remainingTime < 600 ? "text-red-500" : "text-gray-800"
            }`}
          >
            {formatTime(remainingTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestSubjectPanel;
