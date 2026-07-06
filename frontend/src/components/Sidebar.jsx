import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Terminal,
  ClipboardList,
  User,
  Settings,
  CloudSun,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const navItems = {
    workspace: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Problems", path: "/problems", icon: Terminal },
      { name: "Submissions", path: "/submissions", icon: ClipboardList },
    ],
    account: [
      { name: "Profile", path: "/profile", icon: User },
      { name: "Settings", path: "/settings", icon: Settings },
    ],
  };

  const linkClass = (active) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active
        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-750 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 font-bold"
        : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-slate-100 dark:hover:bg-slate-900/60"
    }`;

  return (
    <aside className="w-64 border-r border-[var(--border-main)] bg-[var(--sidebar-bg)] flex flex-col justify-between p-4 shrink-0 font-sans select-none min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="space-y-6">
        {/* Home / Global link */}
        <Link to="/" className={linkClass(isLinkActive("/"))}>
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {/* WORKSPACE group */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase px-4 block">
            Workspace
          </span>
          <nav className="space-y-1">
            {navItems.workspace.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={linkClass(isLinkActive(item.path))}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ACCOUNT group */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase px-4 block">
            Account
          </span>
          <nav className="space-y-1">
            {navItems.account.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={linkClass(isLinkActive(item.path))}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-[var(--border-main)]">
        {/* Weather Indicator */}
        <div className="flex items-center gap-2.5 px-4 text-xs text-[var(--text-muted)] font-mono">
          <CloudSun className="w-4 h-4 text-amber-500/80" />
          <span>33°C · Mostly cloudy</span>
        </div>
      </div>
    </aside>
  );
}
