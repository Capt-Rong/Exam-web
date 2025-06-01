import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Error exchanging code for session:", error);
      // Optionally, redirect to an error page or show a message
      return NextResponse.redirect(
        new URL("/login?error=auth_callback_failed", req.url)
      );
    }
  }

  // URL to redirect to after sign in process completes
  // Default to home page, but you can customize this
  // For example, redirect to a specific dashboard page: new URL('/dashboard', req.url)
  return NextResponse.redirect(new URL("/", req.url));
}
