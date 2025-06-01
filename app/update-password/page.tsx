"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionFromRecovery, setSessionFromRecovery] =
    useState<Session | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "PASSWORD_RECOVERY") {
          if (session) {
            // This session object is created after the user clicks the password recovery link.
            // It contains the user's identity but is typically short-lived and only for password reset.
            setSessionFromRecovery(session);
            setMessage("You can now set your new password.");
          } else {
            setError(
              "Invalid or expired password recovery link. Please try again."
            );
            // Optionally redirect to forgot-password or login after a delay
            setTimeout(() => router.push("/forgot-password"), 5000);
          }
        }
      }
    );

    // Check if the URL might contain a recovery token (though onAuthStateChange should handle it)
    // This is a fallback or for immediate UI update if needed, but onAuthStateChange is more robust.
    // Example: const hash = window.location.hash;
    // if (hash.includes('type=recovery')) {
    //   setMessage('Processing password recovery link...');
    // }

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [supabase, router]);

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!sessionFromRecovery) {
      setError(
        "No valid session for password recovery. Please request a new link."
      );
      return;
    }

    setIsLoading(true);

    // The user is already authenticated at this point due to the PASSWORD_RECOVERY event providing a session.
    // We use updateUser to set the new password.
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    setIsLoading(false);

    if (updateError) {
      console.error("Error updating password:", updateError);
      setError(updateError.message);
    } else {
      setMessage(
        "Password updated successfully! You can now log in with your new password."
      );
      // It's good practice to sign the user out of this temporary recovery session.
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  // If no recovery session is detected yet, or if there was an error with the link
  if (!sessionFromRecovery && !message && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
          <p className="text-gray-700">Verifying password recovery link...</p>
          <p className="text-sm text-gray-500 mt-2">
            If you are not redirected, please ensure you clicked the link from
            your email.
          </p>
        </div>
      </div>
    );
  }
  // Show error if link was invalid from onAuthStateChange
  if (error && !sessionFromRecovery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-center text-red-700">
            Password Reset Error
          </h1>
          <p className="text-sm text-red-600 text-center">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Set New Password
        </h1>
        {sessionFromRecovery && (
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password (min. 6 characters)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {message && !error && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
