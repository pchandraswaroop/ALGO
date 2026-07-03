import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  User,
  Calendar,
  Key,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const formatProfileDate = (dateOfBirth) =>
  dateOfBirth ? new Date(dateOfBirth).toISOString().split("T")[0] : "";

export default function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [fullName, setFullName] = useState(
    user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
  );
  const [email, setEmail] = useState(user?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    formatProfileDate(user?.dateOfBirth),
  );
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updateData = { username, fullName, email, dateOfBirth };
      if (password) {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        updateData.password = password;
      }

      const res = await updateProfile(updateData);
      if (res.success) {
        setSuccess("Profile updated successfully!");
        setPassword(""); // Clear password field
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteAccount();
      if (res.success) {
        navigate("/register");
      }
    } catch (err) {
      setError(err.message || "Failed to delete account");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="bg-indigo-600/20 text-indigo-400 p-4 rounded-2xl">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your personal settings, password, and account status
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-900/50 text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 bg-green-950/30 border border-green-900/50 text-green-400 p-3 rounded-lg text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main settings form */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Leave blank to keep same"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-all shadow-lg shadow-indigo-600/20"
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Account actions & Info sidebar */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Account Status
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-slate-500 block">User Role</span>
                  <span className="font-semibold text-indigo-400 uppercase text-xs tracking-wider bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/50 inline-block mt-1">
                    {user.role}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Registered on</span>
                  <span className="text-slate-300 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete Account Card */}
            <div className="bg-slate-900 border border-red-950/30 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Deleting your account will permanently wipe all profile settings and remove your entire submission history. This cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/40 font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-xs flex gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-300">Are you absolutely sure? Click confirm to proceed.</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                    >
                      {loading ? "Deleting..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-colors"
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
