import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookieStore).get(name)?.value;
          },
          async set() {
            // In Route Handlers, this attempts to set a cookie on the INCOMING request's
            // cookie store, which is read-only. This is generally a no-op or might error
            // if the underlying store strictly enforces read-only.
            // The actual cookie setting to the browser is handled by the middleware
            // by re-reading the request and setting cookies on the RESPONSE.
            // So, for Supabase internal state, we can try to update the mutable request cookies if available,
            // but this is non-standard. For safety, this can be a no-op.
            // Or, more correctly, it should interact with the response, but that needs a ref to `res`.
            // Given @supabase/ssr design, middleware is the primary writer.
            // cookieStore.set(name, value, options); // This would error as cookieStore is Readonly
          },
          async remove() {
            // Similar to set, this would be a no-op on a ReadonlyRequestCookies store.
            // cookieStore.delete(name, options); // This would error
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Construct the redirect URL using origin to ensure it's absolute.
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error(
      "[Auth Callback] Error exchanging code for session:",
      error.message
    );
  } else {
    console.error("[Auth Callback] No code provided.");
  }

  // If there was an error or no code, redirect to an error page or login
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_failed&message=${
      code ? "exchange_failed" : "no_code"
    }`
  );
}
