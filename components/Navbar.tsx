"use client";

import React, { useEffect, useRef } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkProvider,
} from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const navbarRef = useRef<HTMLElement>(null);

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

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

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
              href="/exams"
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
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
                Login
              </button>
            </SignInButton>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
            >
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
