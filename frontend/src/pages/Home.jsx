import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getProblems, getUserSubmissions } from "../api";
import {
  Award,
  BookOpen,
  Clock,
  Activity,
  ArrowRight,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [probRes, subRes] = await Promise.all([
          getProblems(),
          user ? getUserSubmissions() : Promise.resolve({ success: true, submissions: [] })
        ]);
        
        if (probRes.success) {
          setProblems(probRes.problems || []);
        } else {
          setError(probRes.message || "Failed to load problems");
        }

        if (subRes && subRes.success) {
          setSubmissions(subRes.submissions || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const totalProblems = problems.length;
  const submissionsCount = submissions.length;
  
  const solvedProblemIds = new Set(
    submissions
      .filter((s) => s.verdict === "Accepted" && s.problemId)
      .map((s) => s.problemId._id || s.problemId)
  );
  const solvedCount = solvedProblemIds.size;
  
  const acceptanceRate = submissionsCount > 0 
    ? Math.round((submissions.filter((s) => s.verdict === "Accepted").length / submissionsCount) * 100)
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--app-bg)] bg-grid-radial text-[var(--text-main)] py-12 px-4 sm:px-6 lg:px-8 relative select-none transition-colors duration-200">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Welcome Banner */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-3xl p-8 shadow-sm relative overflow-hidden transition-all hover:border-emerald-500/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Welcome back, {user ? user.fullName || user.username : "Coder"}!
            </h1>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed font-sans">
              Explore the algorithmic coding challenges, write code, run custom
              test inputs, and check your test case solutions against the judge.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border-main)] p-6 rounded-2xl flex items-center gap-4 hover:border-[var(--text-muted)] transition-all shadow-sm">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 p-3 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs block uppercase font-bold tracking-wider">
                Solved Problems
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-main)]">{solvedCount}</span>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-main)] p-6 rounded-2xl flex items-center gap-4 hover:border-[var(--text-muted)] transition-all shadow-sm">
            <div className="bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 p-3 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs block uppercase font-bold tracking-wider">
                Total Problems
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-main)]">
                {totalProblems}
              </span>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-main)] p-6 rounded-2xl flex items-center gap-4 hover:border-[var(--text-muted)] transition-all shadow-sm">
            <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs block uppercase font-bold tracking-wider">
                Submissions
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-main)]">{submissionsCount}</span>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-main)] p-6 rounded-2xl flex items-center gap-4 hover:border-[var(--text-muted)] transition-all shadow-sm">
            <div className="bg-teal-50 dark:bg-teal-500/10 text-teal-600 p-3 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-xs block uppercase font-bold tracking-wider">
                Acceptance Rate
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-main)]">
                {acceptanceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Problem List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)]">
              Available Challenges
            </h2>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-sm hover:border-emerald-500/10 transition-all">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-[var(--text-muted)]">
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Loading problems...
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 px-6 py-8 text-red-655">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : problems.length === 0 ? (
              <div className="px-6 py-10 text-[var(--text-muted)]">
                No problems are available yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--input-bg)] text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider border-b border-[var(--border-main)]">
                      <th className="py-4 px-6">Problem ID</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Difficulty</th>
                      <th className="py-4 px-6">Acceptance</th>
                      <th className="py-4 px-6">Topics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-main)]">
                    {problems.map((problem) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-[var(--input-bg)] transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-sm text-[var(--text-muted)]">
                          #{problem._id.slice(-6)}
                        </td>
                        <td className="py-4 px-6 font-bold text-[var(--text-main)] hover:text-emerald-600">
                          <Link
                            to={`/problems/${problem._id}`}
                            className="inline-flex items-center gap-2 group"
                          >
                            {problem.title}
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                              problem.difficulty === "Easy"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                                : problem.difficulty === "Medium"
                                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200"
                                  : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[var(--text-muted)] text-sm font-medium">
                          {problem.acceptanceRate !== undefined ? `${problem.acceptanceRate}%` : "--"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {(problem.tags || []).length > 0 ? (
                              problem.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-wider bg-[var(--input-bg)] px-2 py-0.5 rounded border border-[var(--border-main)]"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-[var(--text-muted)] text-xs">
                                No tags
                              </span>
                            )}
                          </div>
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
    </div>
  );
}
