import { useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldAlert,
  Trash2,
} from "lucide-react";

export default function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await updateProfile({
        username,
        fullName,
        email,
        dateOfBirth,
        password: password || undefined,
      });

      if (res.success) {
        setSuccess("Profile updated successfully!");
        setPassword("");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await deleteAccount();
      if (!res.success) {
        setError(res.message || "Failed to delete account");
      }
    } catch (err) {
      setError(err.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen bg-[var(--app-bg)] flex items-center justify-center text-[var(--text-muted)] font-mono text-xs">
        Loading profile context...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--app-bg)] bg-grid-radial text-[var(--text-main)] py-12 px-4 sm:px-6 lg:px-8 relative select-none transition-colors duration-200">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-[var(--border-main)] pb-6">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/20">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Your Profile</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1 font-sans">
              Manage your personal settings, password, and account status
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main settings form */}
          <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 shadow-sm hover:border-emerald-500/10 transition-all">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 px-3 text-[var(--text-main)] focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Leave blank to keep same"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2 pl-3 pr-10 text-[var(--text-main)] placeholder-slate-450 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-main)] pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Account actions & Info sidebar */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 hover:border-emerald-500/10 transition-all shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
                Account Status
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-[var(--text-muted)] block text-xs uppercase font-bold tracking-wider">User Role</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase text-xs tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 inline-block mt-1">
                    {user.role}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-xs uppercase font-bold tracking-wider">Registered on</span>
                  <span className="text-[var(--text-main)] font-medium font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete Account Card */}
            <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed font-sans">
                Deleting your account will permanently wipe all profile settings and remove your entire submission history. This cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-100/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 rounded-lg text-xs flex gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-700 dark:text-red-400">Are you absolutely sure? Click confirm to proceed.</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-md shadow-red-500/10"
                    >
                      {loading ? "Deleting..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-slate-200 dark:bg-slate-800 text-[var(--text-main)] hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
