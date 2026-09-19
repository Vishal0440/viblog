import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import logo from "../utils/logo.svg";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/" className="inline-flex">
              <img src={logo} alt="Vi Blog" className="h-8 w-auto" />
            </Link>
            <p className="mt-2 text-sm text-slate-500">
              Write, discover, and share ideas.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-sm">
            <Link to="/" className="text-slate-500 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/feed" className="text-slate-500 hover:text-indigo-600">
              Feed
            </Link>
            <Link to="/login" className="text-slate-500 hover:text-indigo-600">
              Login
            </Link>
            <a
              href="mailto:hello@viblog.com"
              className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600"
            >
              <Mail size={16} />
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 text-center text-xs text-slate-400 sm:text-left">
          © {new Date().getFullYear()} Vi Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
