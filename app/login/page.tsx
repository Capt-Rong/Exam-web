"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      console.error("Error signing in:", signInError);
      setError(signInError.message);
    } else {
      router.push("/"); // Redirect to home page on successful login
      router.refresh(); // Important to re-fetch server components and refresh session in middleware
    }
  };

  // Example function to handle OAuth sign-in (e.g., Google)
  // You would call this from an OAuth button
  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // You can add redirectTo here if needed, otherwise it uses default from Supabase settings
        // redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setIsLoading(false);
      console.error(`Error with ${provider} OAuth:`, oauthError);
    }
    // If successful, Supabase handles the redirect to the provider and then to your callback URL
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Log In</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Example OAuth button - replace with your actual UI */}
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {/* You can add a Google icon here */}
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M44.5 20H24v8h11.3c-1.6 5.2-6.4 9-11.3 9-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1L36.4 9C32.6 5.6 27.7 4 23 4 12.4 4 4 12.4 4 23s8.4 19 19 19c10.2 0 18.4-7.5 18.4-18.6 0-1.2-.1-2.4-.3-3.4z"
                fill="#FFC107"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M44.5 20H24v8h11.3c-1.6 5.2-6.4 9-11.3 9-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1L36.4 9C32.6 5.6 27.7 4 23 4 12.4 4 4 12.4 4 23s8.4 19 19 19c10.2 0 18.4-7.5 18.4-18.6 0-1.2-.1-2.4-.3-3.4z"
                fill="#FFC107"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.9 14.9L12 20.3c-1.2 2.1-1.9 4.5-1.9 7s.7 4.9 1.9 7l-7.1 5.3C3.7 35.3 3 30.9 3 26s.7-9.3 1.9-11.1z"
                fill="#FF3D00"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23 48c5.5 0 10.4-1.8 13.9-4.9l-7.1-5.3c-1.9 1.3-4.2 2.1-6.8 2.1-5.2 0-9.6-3.5-11.1-8.1l-7.1 5.3C7.6 43.2 14.7 48 23 48z"
                fill="#4CAF50"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M43.6 14.9L36.4 22c1.4 2.2 2.1 4.8 2.1 7.5s-.7 5.3-2.1 7.5l7.2 5.3c1.7-2.9 2.6-6.2 2.6-9.8s-.9-6.9-2.6-9.8z"
                fill="#1976D2"
              />
            </svg>
            Sign in with Google
          </button>
          {/* Add other OAuth providers similarly */}
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
