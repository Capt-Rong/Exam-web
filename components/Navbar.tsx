"use client";

import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="py-4 px-6 md:px-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-20">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            KoTest
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/notes"
              className="text-base text-gray-700 hover:text-gray-900"
            >
              Notes
            </Link>
            <Link
              href="/exams"
              className="text-base text-gray-700 hover:text-gray-900"
            >
              Practice
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
