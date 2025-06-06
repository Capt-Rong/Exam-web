import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 text-center flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
            Master Your Medical Lab Exams
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive mock tests, detailed subject notes, and AI-powered
            insights to ensure your success.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/exams"
            className="px-8 py-3 text-lg font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
          >
            Start Practicing
          </Link>
          <Link
            href="/notes"
            className="px-8 py-3 text-lg font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Browse Notes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
