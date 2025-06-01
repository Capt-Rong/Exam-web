import HeroSection from "@/components/HeroSection";
import SubjectCard from "@/components/SubjectCard";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "../lib/supabase/server";
import { cookies } from "next/headers";

// Define color themes to be applied cyclically
const colorThemes = [
  {
    bgColorClass: "bg-emerald-100",
    textColorClass: "text-emerald-800",
    buttonColorClass: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    bgColorClass: "bg-sky-100",
    textColorClass: "text-sky-800",
    buttonColorClass: "bg-sky-600 hover:bg-sky-700",
  },
  {
    bgColorClass: "bg-rose-100",
    textColorClass: "text-rose-800",
    buttonColorClass: "bg-rose-600 hover:bg-rose-700",
  },
  {
    bgColorClass: "bg-purple-100",
    textColorClass: "text-purple-800",
    buttonColorClass: "bg-purple-600 hover:bg-purple-700",
  },
  {
    bgColorClass: "bg-amber-100",
    textColorClass: "text-amber-800",
    buttonColorClass: "bg-amber-600 hover:bg-amber-700",
  },
  {
    bgColorClass: "bg-slate-100",
    textColorClass: "text-slate-800",
    buttonColorClass: "bg-slate-600 hover:bg-slate-700",
  },
];

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("name, slug, description")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching subjects for homepage:", error);
    // Optionally render an error message or fallback UI
  }

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
                href="/notes"
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Explore All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {subjects &&
                subjects.map((subject, index) => {
                  const theme = colorThemes[index % colorThemes.length];
                  return (
                    <SubjectCard
                      key={subject.slug}
                      subjectName={subject.name}
                      description={subject.description || ""}
                      bgColorClass={theme.bgColorClass}
                      textColorClass={theme.textColorClass}
                      buttonColorClass={theme.buttonColorClass}
                      href={`/notes/${subject.slug}`}
                    />
                  );
                })}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
