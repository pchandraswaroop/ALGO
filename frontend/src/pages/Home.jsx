import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProblems } from "../api";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const res = await getProblems();
        if (res.success) {
          setProblems(res.problems || []);
        } else {
          setError(res.message || "Failed to load problems");
        }
      } catch (err) {
        setError(err.message || "Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const totalProblems = problems.length;
  const difficultyCount = problems.reduce(
    (accumulator, problem) => {
      accumulator[problem.difficulty] =
        (accumulator[problem.difficulty] || 0) + 1;
      return accumulator;
    },
    { Easy: 0, Medium: 0, Hard: 0 },
  );

  const acceptanceRate = totalProblems
    ? Math.round(
        ((difficultyCount.Easy +
          difficultyCount.Medium * 0.7 +
          difficultyCount.Hard * 0.4) /
          (totalProblems * 1.5)) *
          100,
      )
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Welcome back, {user ? user.fullName || user.username : "Coder"}!
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Explore the algorithmic coding challenges, write code, run custom
              test inputs, and check your test case solutions against the judge.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">
                Solved Problems
              </span>
              <span className="text-2xl font-extrabold text-white">0</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">
                Total Problems
              </span>
              <span className="text-2xl font-extrabold text-white">
                {totalProblems}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">
                Submissions
              </span>
              <span className="text-2xl font-extrabold text-white">0</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-cyan-500/10 text-cyan-400 p-3 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">
                Acceptance Rate
              </span>
              <span className="text-2xl font-extrabold text-white">
                {acceptanceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Problem List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Available Challenges
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Loading problems...
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 px-6 py-8 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : problems.length === 0 ? (
              <div className="px-6 py-10 text-slate-400">
                No problems are available yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                      <th className="py-4 px-6">Problem ID</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Difficulty</th>
                      <th className="py-4 px-6">Acceptance</th>
                      <th className="py-4 px-6">Topics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {problems.map((problem) => (
                      <tr
                        key={problem._id}
                        className="hover:bg-slate-850/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-sm text-slate-500">
                          #{problem._id.slice(-6)}
                        </td>
                        <td className="py-4 px-6 font-bold text-white hover:text-indigo-400">
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
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-900/50"
                                : problem.difficulty === "Medium"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-900/50"
                                  : "bg-red-500/10 text-red-400 border-red-900/50"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 text-sm font-medium">
                          --
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {(problem.tags || []).length > 0 ? (
                              problem.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-slate-500 text-[10px] uppercase font-bold tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-600 text-xs">
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
