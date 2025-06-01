import HeroSection from "@/components/HeroSection";
import SubjectCard from "@/components/SubjectCard";
import Link from "next/link";
import { subjects } from "@/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-grow">
        <Navbar />
        <HeroSection />
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Featured Subjects
              </h2>
              <Link
                href="/exams"
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Explore All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.name}
                  subjectName={subject.name}
                  description={subject.description}
                  bgColorClass={subject.bgColorClass}
                  textColorClass={subject.textColorClass}
                  buttonColorClass={subject.buttonColorClass}
                  href={subject.href}
                />
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
