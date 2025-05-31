import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16 md:mt-24">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-8 mb-4 md:mb-0">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            Terms Policy
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            About Us
          </Link>
        </div>
        <Link
          href="/"
          className="p-2 border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 hover:border-gray-400 "
        >
          <ArrowRight size={20} />
        </Link>
      </div>
      <div className="text-center py-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} KoTest. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
