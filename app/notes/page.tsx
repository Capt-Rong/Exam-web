import SubjectCard from "@/components/SubjectCard";
import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";
import { noteSubjects } from "@/constants";

export default async function NotePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: notes, error } = await supabase.from("notes").select();

  if (error) {
    console.error("Error fetching notes:", error);
  }

  return (
    <main>
    <section className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Practice Page - Questions
      </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {noteSubjects.map((subject) => (
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
