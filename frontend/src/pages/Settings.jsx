import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [fullName, setFullName] = useState(
    user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
  );
  const [email, setEmail] = useState(user?.email || "");
  const [country, setCountry] = useState("India");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getInitials = () => {
    if (fullName) {
      const parts = fullName.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return fullName.slice(0, 2).toUpperCase();
    }
    return user?.username?.slice(0, 2).toUpperCase() || "US";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await updateProfile({ username, fullName, email });
      if (res.success) {
        setSuccess("Settings updated successfully!");
      }
    } catch (err) {
      setError(err.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--app-bg)] text-[var(--text-main)] py-10 px-6 sm:px-10 max-w-4xl space-y-8 select-none transition-colors duration-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Settings</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm max-w-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm max-w-2xl">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Main Settings Panel */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-8 space-y-8 max-w-3xl shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-main)] pb-3">Profile</h2>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-main)]">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
            >
              {loading ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-main)] pb-3">Appearance</h2>
        <div className="space-y-4">
          <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Theme mode</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-4 cursor-pointer text-center">
              <span className="block text-sm font-bold text-emerald-700 dark:text-emerald-400">Dynamic Toggler Active</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-1 block">Toggle via Sun/Moon icon in header</span>
            </div>
            <div className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 opacity-50 cursor-not-allowed text-center">
              <span className="block text-sm font-bold text-[var(--text-muted)]">Custom Palettes</span>
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
