import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserSubmissions } from "../api";
import {
  AlertCircle,
  ArrowRight,
  Clock3,
  LoaderCircle,
  ClipboardList,
} from "lucide-react";

const verdictStyles = {
  Accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-900/50",
  "Wrong Answer": "bg-red-500/10 text-red-400 border-red-900/50",
  "Time Limit Exceeded": "bg-amber-500/10 text-amber-400 border-amber-900/50",
  "Runtime Error": "bg-orange-500/10 text-orange-400 border-orange-900/50",
  "Compilation Error":
    "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-900/50",
  Pending: "bg-slate-500/10 text-slate-300 border-slate-700",
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-linear-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-2xl border border-indigo-500/20">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Submission History
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                Review every submission you have made, track verdicts, and jump
                back into the problem when needed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
              <LoaderCircle className="w-5 h-5 animate-spin" />
              Loading submissions...
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 px-6 py-8 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="px-6 py-10 text-slate-400">No submissions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-6">Problem</th>
                    <th className="py-4 px-6">Language</th>
                    <th className="py-4 px-6">Verdict</th>
                    <th className="py-4 px-6">Time</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {submissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-slate-850/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-white">
                            {submission.problemId?.title || "Unknown Problem"}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            #
                            {String(
                              submission.problemId?._id ||
                                submission.problemId ||
                                submission._id,
                            ).slice(-6)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 capitalize">
                        {submission.language}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${verdictStyles[submission.verdict] || verdictStyles.Pending}`}
                        >
                          {submission.verdict}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 text-sm">
                        {submission.executionTime || 0} ms
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-sm whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Clock3 className="w-4 h-4 text-slate-500" />
                          {new Date(submission.submittedAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {submission.problemId?._id ? (
                          <Link
                            to={`/problems/${submission.problemId._id}`}
                            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                          >
                            View
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span className="text-slate-600 text-sm">N/A</span>
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
