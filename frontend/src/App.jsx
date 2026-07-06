import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Problem from "./pages/Problem";
import Submissions from "./pages/Submissions";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import WorkspaceLayout from "./components/WorkspaceLayout";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[var(--app-bg)] font-sans antialiased text-[var(--text-main)] transition-colors duration-200">
          <Navbar />
          <Routes>
            {/* Public Landing Page */}
            <Route
              path="/"
              element={<Landing />}
            />

            {/* Protected Routes wrapped in Sidebar WorkspaceLayout */}
            <Route
              path="/problems"
              element={
                <ProtectedRoute>
                  <WorkspaceLayout>
                    <Home />
                  </WorkspaceLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <WorkspaceLayout>
                    <Dashboard />
                  </WorkspaceLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <WorkspaceLayout>
                    <Settings />
                  </WorkspaceLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <WorkspaceLayout>
                    <Profile />
                  </WorkspaceLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <WorkspaceLayout>
                    <Submissions />
                  </WorkspaceLayout>
                </ProtectedRoute>
              }
            />

            {/* Editor Workspace (Full width) */}
            <Route
              path="/problems/:id"
              element={
                <ProtectedRoute>
                  <Problem />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Controls */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
