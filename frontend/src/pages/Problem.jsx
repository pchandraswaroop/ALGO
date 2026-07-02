import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createSubmission, getProblemById, getUserSubmissions } from "../api";
import {
  ArrowLeft,
  AlertCircle,
  LoaderCircle,
  Clock3,
  Gauge,
  Play,
  Send,
} from "lucide-react";

export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your solution here\n");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const [problemRes, submissionsRes] = await Promise.all([
          getProblemById(id),
          getUserSubmissions(),
        ]);

        if (problemRes.success) {
          setProblem(problemRes.problem);
        } else {
          setError(problemRes.message || "Failed to load problem");
        }

        if (submissionsRes.success) {
          setSubmissions(
            (submissionsRes.submissions || []).filter(
              (submission) => submission.problemId?._id === id,
            ),
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmissionMessage("");
    setSubmitting(true);

    try {
      const res = await createSubmission({
        problemId: id,
        language,
        code,
      });

      if (res.success) {
        setSubmissionMessage("Submission saved. Verdict is Pending.");
        setSubmissions((currentSubmissions) => [
          { ...res.submission, problemId: problem },
          ...currentSubmissions,
        ]);
      }
    } catch (err) {
      setError(err.message || "Failed to create submission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          Loading problem...
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center px-4 text-slate-200">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-red-400 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>{error || "Problem not found"}</span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to problems
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
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
                  <span className="text-slate-500 text-sm font-mono">
                    {problem._id}
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  {problem.title}
                </h1>
              </div>

              <section className="space-y-3">
                <h2 className="text-xl font-bold">Problem Statement</h2>
                <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                  {problem.statement}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold">Input Format</h2>
                <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                  {problem.inputFormat}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold">Output Format</h2>
                <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                  {problem.outputFormat}
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Sample Input
                  </h3>
                  <pre className="text-sm text-slate-200 whitespace-pre-wrap overflow-x-auto">
                    {problem.sampleInput}
                  </pre>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Sample Output
                  </h3>
                  <pre className="text-sm text-slate-200 whitespace-pre-wrap overflow-x-auto">
                    {problem.sampleOutput}
                  </pre>
                </div>
              </section>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Code Editor
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Store a submission now. Judging comes next.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500">
                    Language
                  </span>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  rows={18}
                  spellCheck="false"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-4 font-mono text-sm text-slate-100 outline-none focus:border-indigo-500"
                  placeholder="Write your solution here"
                />

                {submissionMessage ? (
                  <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-900/40 rounded-xl px-4 py-3">
                    {submissionMessage}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Run later
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-bold">Limits</h2>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Clock3 className="w-4 h-4 text-indigo-400" />
                  Time limit: {problem.timeLimit} sec
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Memory limit: {problem.memoryLimit} MB
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-bold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {(problem.tags || []).length > 0 ? (
                  problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm">No tags</span>
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-lg font-bold">Recent Submissions</h2>
              {submissions.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No submissions yet for this problem.
                </p>
              ) : (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((submission) => (
                    <div
                      key={submission._id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white capitalize">
                          {submission.language}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                          {submission.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
