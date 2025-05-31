import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Using lucide-react for icons as per project setup
import { SubjectCardProps } from "@/types";

const SubjectCard: React.FC<SubjectCardProps> = ({
  subjectName,
  description,
  bgColorClass,
  textColorClass,
  buttonColorClass,
  href,
}) => {
  return (
    <Link
      href={href}
      className={`block p-8 min-w-64 min-h-64 rounded-lg shadow-lg ${bgColorClass} flex flex-col justify-between h-full`}
    >
      <div>
        <h3 className={`text-xl font-semibold ${textColorClass} mb-2`}>
          {subjectName}
        </h3>
        <p className={`text-sm ${textColorClass} opacity-90 mb-4`}>
          {description}
        </p>
      </div>
      <div className="flex justify-end mt-auto">
        <div className={`p-2 rounded-full ${buttonColorClass} text-white`}>
          <ArrowRight size={20} />
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
