"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"; // For redirecting after logout

const Navbar = () => {
  const navbarRef = useRef<HTMLElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${height}px`
        );
      }
    };

    updateNavbarHeight(); // Initial measurement
    window.addEventListener("resize", updateNavbarHeight);

    // Listen for auth changes
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      setSession(data.session);
    };
    getSession();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      authSubscription?.unsubscribe();
    };
  }, [supabase, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/"); // Redirect to homepage after logout
    router.refresh(); // Ensure server components re-render if needed
  };

  return (
    <header
      ref={navbarRef}
      className="py-2 md:px-2 shadow-md border-b border-gray-100"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-20">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            KoTest
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/exam"
              className="text-base text-gray-700 hover:text-gray-900"
            >
              Practice
            </Link>
            <Link
              href="/notes"
              className="text-base text-gray-700 hover:text-gray-900"
            >
              Learning
            </Link>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {session.user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
