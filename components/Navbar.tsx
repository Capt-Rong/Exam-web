"use client";

import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import Link from "next/link";

const Navbar = () => {
  return (
    <main>
      <div className="flex justify-between items-center px-10 py-2 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-xl font-bold">Test bro</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/notes">Notes</Link>
            <Link href="/exams">Exams</Link>
            <Link href="/subscription">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </main>
  );
};

export default Navbar;
