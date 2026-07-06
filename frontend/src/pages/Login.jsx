import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Terminal, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate("/problems");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[var(--app-bg)] bg-grid-radial px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden transition-colors duration-200">
      {/* Background blobs for premium glassmorphism aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-main)] p-8 rounded-2xl shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/20">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-450 mb-4">
            <Terminal className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Sign in to start submitting solutions
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 pl-3 pr-10 text-[var(--text-main)] placeholder-slate-450 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
          >
            <LogIn className="w-4 h-4 text-white" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6 font-sans">
          New to AlgoU?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
