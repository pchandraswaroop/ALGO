import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems, getUserSubmissions } from "../api";
import { Flame, Award, Star, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProblems(), getUserSubmissions()])
      .then(([probRes, subRes]) => {
        if (probRes && probRes.success) {
          setProblems(probRes.problems || []);
        }
        if (subRes && subRes.success) {
          setSubmissions(subRes.submissions || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const difficultyCounts = problems.reduce(
    (acc, prob) => {
      acc[prob.difficulty] = (acc[prob.difficulty] || 0) + 1;
      return acc;
    },
    { Easy: 0, Medium: 0, Hard: 0 }
  );

  // Count actual solved problems by finding successful submissions
  const solvedProblemIds = new Set(
    submissions
      .filter((s) => s.verdict === "Accepted" && s.problemId)
      .map((s) => s.problemId._id || s.problemId)
  );

  const solvedCount = solvedProblemIds.size;

  const solvedDifficultyCounts = problems
    .filter((p) => solvedProblemIds.has(p._id))
    .reduce(
      (acc, p) => {
        acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
        return acc;
      },
      { Easy: 0, Medium: 0, Hard: 0 }
    );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--app-bg)] text-[var(--text-main)] py-10 px-6 sm:px-10 max-w-5xl space-y-8 select-none transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Dashboard</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Review your stats, progress tracker, and submission log.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Difficulty counts */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--text-main)]">Progress Tracker</h2>

          <div className="space-y-4">
            {/* Easy */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                <span>Easy Solved</span>
                <span className="text-emerald-600 font-mono">
                  {solvedDifficultyCounts.Easy} / {difficultyCounts.Easy}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-[var(--border-main)]">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      difficultyCounts.Easy
                        ? (solvedDifficultyCounts.Easy / difficultyCounts.Easy) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                <span>Medium Solved</span>
                <span className="text-amber-600 font-mono">
                  {solvedDifficultyCounts.Medium} / {difficultyCounts.Medium}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-[var(--border-main)]">
                <div
                  className="bg-amber-505 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      difficultyCounts.Medium
                        ? (solvedDifficultyCounts.Medium / difficultyCounts.Medium) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[var(--text-muted)]">
                <span>Hard Solved</span>
                <span className="text-red-650 font-mono">
                  {solvedDifficultyCounts.Hard} / {difficultyCounts.Hard}
                </span>
              </div>
              <div className="w-full bg-[var(--input-bg)] rounded-full h-2 overflow-hidden border border-[var(--border-main)]">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      difficultyCounts.Hard
                        ? (solvedDifficultyCounts.Hard / difficultyCounts.Hard) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-main)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Streak: {solvedCount > 0 ? "1 day" : "0 days"}
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Solved: {solvedCount}
            </span>
          </div>
        </div>

        {/* Right Column - Recent Submissions Log */}
        <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)] mb-4">Recent Submissions Log</h2>
            {loading ? (
              <p className="text-xs text-[var(--text-muted)] font-mono">Checking submissions...</p>
            ) : submissions.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] font-mono py-8 text-center border border-dashed border-[var(--border-main)] rounded-xl">
                No submissions made yet. Jump into workspace to solve your first task!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                {submissions.slice(0, 4).map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-main)]"
                  >
                    <div className="flex items-center gap-3">
                      {sub.verdict === "Accepted" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-xs text-[var(--text-main)] block">
                          {sub.problemId?.title || "Unknown Problem"}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {sub.language.toUpperCase()} · {sub.executionTime || 0}ms
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                        sub.verdict === "Accepted"
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                          : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200"
                      }`}
                    >
                      {sub.verdict}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/submissions"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-3"
          >
            View all submissions &rarr;
          </Link>
        </div>
      </div>

      {/* Recommended Problems */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-[var(--text-main)]">Recommended Challenges</h2>
        {loading ? (
          <div className="text-sm text-[var(--text-muted)] font-mono">Scanning challenges...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.slice(0, 4).map((p) => (
              <Link
                key={p._id}
                to={`/problems/${p._id}`}
                className="bg-[var(--input-bg)] border border-[var(--border-main)] hover:border-emerald-500/20 p-4 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="space-y-1">
                  <span className="font-bold text-sm text-[var(--text-main)] group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-600/40 group-hover:text-emerald-600" />
                    {p.title}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider block">
                    {p.difficulty} · #{p._id.slice(-6)}
                  </span>
                </div>
                <div className="text-[var(--text-muted)] group-hover:text-emerald-600 font-semibold text-xs flex items-center gap-1 transition-colors">
                  Solve &rarr;
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
