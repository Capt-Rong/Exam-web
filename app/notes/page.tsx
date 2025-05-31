import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";

export default async function NotePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: notes, error } = await supabase.from("notes").select();

  if (error) {
    console.error("Error fetching notes:", error);
  }

  return (
    <div>
      <h1>Notes Page</h1>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
      {error && <p>Error loading notes. Check console.</p>}
    </div>
  );
}
