import Sidebar from "./Sidebar";

export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[var(--app-bg)] font-sans text-[var(--text-main)] transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--app-bg)]">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
