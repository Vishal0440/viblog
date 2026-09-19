import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, PenLine } from "lucide-react";
import logo from "../utils/logo.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Vi Blog" className="h-8 w-auto" />
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/feed" className={navClass}>
            Feed
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navClass}>
              <span className="flex items-center gap-1.5">
                <LayoutDashboard size={16} />
                Dashboard
              </span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/create"
                className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:flex"
              >
                <PenLine size={16} />
                Write
              </Link>
              <span
                className="hidden h-8 w-px bg-slate-200 sm:block"
                aria-hidden="true"
              />
              <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-slate-400 text-sm font-semibold text-white sm:flex">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden max-w-28 truncate text-sm font-semibold capitalize text-slate-700 sm:block">
                {user.name}
                <span className="ml-1 text-xs block font-normal text-slate-400">
                  Writer
                </span>
              </span>

              <button
                onClick={logout}
                title="Logout"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
