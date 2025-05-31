import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">
          Master Your Medical Lab Exams
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comprehensive mock tests, detailed subject notes, and AI-powered
          insights to ensure your success.
          <div className="flex justify-center mt-8 gap-4">
            <Link
              href="/practice"
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
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
