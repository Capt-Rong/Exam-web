import { createClient } from "@/lib/supabase/server";
// Assuming @ is configured for your src directory
import { cookies } from "next/headers";

export default async function PracticePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: questions, error } = await supabase.from("questions").select();

  if (error) {
    console.error("Error fetching questions:", error);
    // Optionally, you could return a more user-friendly error message here
  }

  return (
    <div>
      <h1>Practice Page - Questions</h1>
      <pre>{JSON.stringify(questions, null, 2)}</pre>
      {error && <p>Error loading questions. Check console.</p>}
    </div>
  );
}
