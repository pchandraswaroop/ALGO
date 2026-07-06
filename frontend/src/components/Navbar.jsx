import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  LogOut,
  Terminal,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (user) {
      const name =
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username;
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return "US";
  };

  return (
    <nav className="bg-[var(--navbar-bg)] backdrop-blur-md border-b border-[var(--border-main)] text-[var(--text-main)] sticky top-0 z-50 select-none transition-colors duration-200">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand and Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="bg-emerald-600 p-2 rounded-lg text-white group-hover:bg-emerald-600 transition-colors">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--text-main)]">
                AlgoU Judge
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2 font-sans">
              <Link
                to="/problems"
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Problems
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="flex items-center gap-3.5">
            {/* Theme Toggler */}
            <button
              onClick={toggleTheme}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3.5">
                {/* Admin controls badge link */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-[var(--text-muted)] hover:text-[var(--text-main)] px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-[var(--border-main)] bg-[var(--input-bg)]"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Circular Profile Initials Avatar Link */}
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-xs font-extrabold text-[var(--text-main)] transition-all border border-[var(--border-main)] shadow-sm"
                  title="View Profile"
                >
                  {getInitials()}
                </Link>

                {/* Log out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 text-red-600 hover:text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-900/50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3.5">
                <Link
                  to="/login"
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
