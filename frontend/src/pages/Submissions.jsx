import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserSubmissions } from "../api";
import {
  ClipboardList,
  AlertCircle,
  LoaderCircle,
  Clock3,
  ArrowRight,
} from "lucide-react";

const verdictStyles = {
  Accepted: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-800",
  "Wrong Answer": "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-450 border border-red-200 dark:border-red-800",
  "Runtime Error": "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-450 border border-orange-200 dark:border-orange-850",
  "Compilation Error": "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-450 border border-amber-200 dark:border-amber-800",
  Pending: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
};

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const res = await getUserSubmissions();
        if (res.success) {
          setSubmissions(res.submissions || []);
        } else {
          setError(res.message || "Failed to load submissions");
        }
      } catch (err) {
        setError(err.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--app-bg)] bg-grid-radial text-[var(--text-main)] py-12 px-4 sm:px-6 lg:px-8 relative select-none transition-colors duration-200">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-3xl p-8 shadow-sm relative overflow-hidden transition-all hover:border-emerald-500/10">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-start gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-950/20">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
                Submission History
              </h1>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl font-sans">
                Review every submission you have made, track verdicts, and jump
                back into the problem when needed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-sm transition-all hover:border-emerald-500/10">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-[var(--text-muted)]">
              <LoaderCircle className="w-5 h-5 animate-spin text-emerald-600" />
              Loading submissions...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 px-6 py-8 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="px-6 py-10 text-[var(--text-muted)] font-mono text-xs">No submissions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--input-bg)] text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider border-b border-[var(--border-main)]">
                    <th className="py-4 px-6">Problem</th>
                    <th className="py-4 px-6">Language</th>
                    <th className="py-4 px-6">Verdict</th>
                    <th className="py-4 px-6">Time</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-main)]">
                  {submissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-[var(--input-bg)] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[var(--text-main)]">
                            {submission.problemId?.title || "Unknown Problem"}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-mono">
                            #
                            {String(
                              submission.problemId?._id ||
                                submission.problemId ||
                                submission._id
                            ).slice(-6)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-main)] opacity-95 capitalize">
                        {submission.language}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${verdictStyles[submission.verdict] || verdictStyles.Pending}`}
                        >
                          {submission.verdict}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-main)] text-sm font-mono">
                        {submission.executionTime || 0} ms
                      </td>
                      <td className="py-4 px-6 text-[var(--text-muted)] text-sm whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 font-mono">
                          <Clock3 className="w-4 h-4 text-[var(--text-muted)]" />
                          {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {submission.problemId?._id ? (
                          <Link
                            to={`/problems/${submission.problemId._id}`}
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                          >
                            View
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span className="text-[var(--text-muted)] text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
