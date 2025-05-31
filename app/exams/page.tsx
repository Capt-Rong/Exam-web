import SubjectCard from "@/components/SubjectCard";
import { subjects } from "@/constants";
// import { createClient } from "@/lib/supabase/server";
// Assuming @ is configured for your src directory
// import { cookies } from "next/headers";

export default async function PracticePage() {
  // const cookieStore = cookies();
  // const supabase = createClient(cookieStore);

  // const { data: questions, error } = await supabase.from("questions").select();

  // if (error) {
  //   console.error("Error fetching questions:", error);
    // Optionally, you could return a more user-friendly error message here
  // }

  return (
    <main>
      <section className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Practice Page - Questions
        </h1>
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
      </section>
    </main>
  );
}
