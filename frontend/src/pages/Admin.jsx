import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  createAdminProblem,
  createAdminTestCase,
  deleteAdminProblem,
  deleteAdminTestCase,
  deleteAdminUser,
  getAdminProblemTestCases,
  getAdminProblems,
  getAdminUsers,
  updateAdminProblem,
} from "../api";

const emptyProblemForm = {
  title: "",
  statement: "",
  difficulty: "Easy",
  timeLimit: 2,
  memoryLimit: 256,
  inputFormat: "",
  outputFormat: "",
  sampleInput: "",
  sampleOutput: "",
  tags: "",
};

const emptyTestCaseForm = {
  input: "",
  expectedOutput: "",
  isHidden: true,
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("problems");
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [problemForm, setProblemForm] = useState(emptyProblemForm);
  const [testCaseForm, setTestCaseForm] = useState(emptyTestCaseForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem._id === selectedProblemId) || null,
    [problems, selectedProblemId],
  );

  const loadAdminData = useCallback(async () => {
    try {
      const [usersRes, problemsRes] = await Promise.all([
        getAdminUsers(),
        getAdminProblems(),
      ]);

      if (usersRes.success) {
        setUsers(usersRes.users || []);
      }

      if (problemsRes.success) {
        setProblems(problemsRes.problems || []);
        if (!selectedProblemId && problemsRes.problems?.length > 0) {
          setSelectedProblemId(problemsRes.problems[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [selectedProblemId]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadAdminData();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadAdminData]);

  useEffect(() => {
    const loadTestCases = async () => {
      if (!selectedProblemId) {
        setTestCases([]);
        return;
      }

      try {
        const res = await getAdminProblemTestCases(selectedProblemId);
        if (res.success) {
          setTestCases(res.testCases || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load test cases");
      }
    };

    loadTestCases();
  }, [selectedProblemId]);

  const resetProblemForm = () => {
    setProblemForm(emptyProblemForm);
    setSelectedProblemId("");
    setTestCases([]);
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblemId(problem._id);
    setProblemForm({
      title: problem.title || "",
      statement: problem.statement || "",
      difficulty: problem.difficulty || "Easy",
      timeLimit: problem.timeLimit ?? 2,
      memoryLimit: problem.memoryLimit ?? 256,
      inputFormat: problem.inputFormat || "",
      outputFormat: problem.outputFormat || "",
      sampleInput: problem.sampleInput || "",
      sampleOutput: problem.sampleOutput || "",
      tags: Array.isArray(problem.tags) ? problem.tags.join(", ") : "",
    });
  };

  const handleProblemSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...problemForm,
      timeLimit: Number(problemForm.timeLimit),
      memoryLimit: Number(problemForm.memoryLimit),
      tags: problemForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const res = selectedProblemId
        ? await updateAdminProblem(selectedProblemId, payload)
        : await createAdminProblem(payload);

      if (res.success) {
        setMessage(res.message);
        await loadAdminData();
        if (res.problem?._id) {
          setSelectedProblemId(res.problem._id);
          setProblemForm({
            title: res.problem.title || "",
            statement: res.problem.statement || "",
            difficulty: res.problem.difficulty || "Easy",
            timeLimit: res.problem.timeLimit ?? 2,
            memoryLimit: res.problem.memoryLimit ?? 256,
            inputFormat: res.problem.inputFormat || "",
            outputFormat: res.problem.outputFormat || "",
            sampleInput: res.problem.sampleInput || "",
            sampleOutput: res.problem.sampleOutput || "",
            tags: Array.isArray(res.problem.tags)
              ? res.problem.tags.join(", ")
              : "",
          });
        }
      }
    } catch (err) {
      setError(err.message || "Failed to save problem");
    } finally {
      setSaving(false);
    }
  };

  const handleProblemDelete = async (problemId) => {
    if (!window.confirm("Delete this problem and its test cases?")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await deleteAdminProblem(problemId);
      if (res.success) {
        setMessage(res.message);
        await loadAdminData();
        if (selectedProblemId === problemId) {
          resetProblemForm();
        }
      }
    } catch (err) {
      setError(err.message || "Failed to delete problem");
    } finally {
      setSaving(false);
    }
  };

  const handleTestCaseSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProblemId) {
      setError("Select a problem first");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await createAdminTestCase(selectedProblemId, testCaseForm);
      if (res.success) {
        setMessage(res.message);
        setTestCaseForm(emptyTestCaseForm);
        const refreshed = await getAdminProblemTestCases(selectedProblemId);
        if (refreshed.success) {
          setTestCases(refreshed.testCases || []);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to save test case");
    } finally {
      setSaving(false);
    }
  };

  const handleTestCaseDelete = async (testCaseId) => {
    if (!window.confirm("Delete this test case?")) {
      return;
    }

    try {
      const res = await deleteAdminTestCase(testCaseId);
      if (res.success) {
        const refreshed = await getAdminProblemTestCases(selectedProblemId);
        if (refreshed.success) {
          setTestCases(refreshed.testCases || []);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to delete test case");
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Delete this user and their submissions?")) {
      return;
    }

    try {
      const res = await deleteAdminUser(userId);
      if (res.success) {
        setMessage(res.message);
        const refreshed = await getAdminUsers();
        if (refreshed.success) {
          setUsers(refreshed.users || []);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to problems
        </Link>

        <div className="bg-linear-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600/20 text-indigo-400 p-4 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Manage problems, test cases, and users.
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex items-center gap-3 px-6 py-4 text-red-400 bg-red-950/20 border border-red-900/40 rounded-2xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {message ? (
          <div className="flex items-center gap-3 px-6 py-4 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("problems")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "problems"
                ? "bg-indigo-600 text-white"
                : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Problems
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "users"
                ? "bg-indigo-600 text-white"
                : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
        </div>

        {activeTab === "problems" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Problem Library</h2>
                  <button
                    type="button"
                    onClick={resetProblemForm}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Problem
                  </button>
                </div>

                <div className="space-y-3 max-h-144 overflow-y-auto pr-1">
                  {problems.map((problem) => (
                    <button
                      key={problem._id}
                      type="button"
                      onClick={() => handleProblemSelect(problem)}
                      className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${
                        selectedProblemId === problem._id
                          ? "bg-indigo-600/15 border-indigo-500/40"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{problem.title}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {problem.difficulty}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          {problem.timeLimit}s
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProblem ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold">Test Cases</h2>
                    <span className="text-xs text-slate-500">
                      {selectedProblem.title}
                    </span>
                  </div>

                  <form onSubmit={handleTestCaseSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Input
                      </label>
                      <textarea
                        value={testCaseForm.input}
                        onChange={(event) =>
                          setTestCaseForm({
                            ...testCaseForm,
                            input: event.target.value,
                          })
                        }
                        rows={4}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Expected Output
                      </label>
                      <textarea
                        value={testCaseForm.expectedOutput}
                        onChange={(event) =>
                          setTestCaseForm({
                            ...testCaseForm,
                            expectedOutput: event.target.value,
                          })
                        }
                        rows={4}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={testCaseForm.isHidden}
                        onChange={(event) =>
                          setTestCaseForm({
                            ...testCaseForm,
                            isHidden: event.target.checked,
                          })
                        }
                      />
                      Hidden test case
                    </label>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Add Test Case"}
                    </button>
                  </form>

                  <div className="space-y-3">
                    {testCases.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No test cases yet.
                      </p>
                    ) : (
                      testCases.map((testCase) => (
                        <div
                          key={testCase._id}
                          className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                              {testCase.isHidden ? "Hidden" : "Visible"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTestCaseDelete(testCase._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                            {testCase.input}
                          </pre>
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {selectedProblemId ? "Edit Problem" : "Create Problem"}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Build the statement, metadata, and sample I/O.
                  </p>
                </div>
                {selectedProblemId ? (
                  <button
                    type="button"
                    onClick={() => handleProblemDelete(selectedProblemId)}
                    className="inline-flex items-center gap-2 bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Problem
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleProblemSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={problemForm.title}
                    onChange={(event) =>
                      setProblemForm({
                        ...problemForm,
                        title: event.target.value,
                      })
                    }
                    placeholder="Problem title"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                  <select
                    value={problemForm.difficulty}
                    onChange={(event) =>
                      setProblemForm({
                        ...problemForm,
                        difficulty: event.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <textarea
                  value={problemForm.statement}
                  onChange={(event) =>
                    setProblemForm({
                      ...problemForm,
                      statement: event.target.value,
                    })
                  }
                  placeholder="Problem statement"
                  rows={8}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={problemForm.timeLimit}
                    onChange={(event) =>
                      setProblemForm({
                        ...problemForm,
                        timeLimit: event.target.value,
                      })
                    }
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Time limit in seconds"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                  <input
                    value={problemForm.memoryLimit}
                    onChange={(event) =>
                      setProblemForm({
                        ...problemForm,
                        memoryLimit: event.target.value,
                      })
                    }
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Memory limit in MB"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <input
                  value={problemForm.inputFormat}
                  onChange={(event) =>
                    setProblemForm({
                      ...problemForm,
                      inputFormat: event.target.value,
                    })
                  }
                  placeholder="Input format"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
                <input
                  value={problemForm.outputFormat}
                  onChange={(event) =>
                    setProblemForm({
                      ...problemForm,
                      outputFormat: event.target.value,
                    })
                  }
                  placeholder="Output format"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    value={problemForm.sampleInput}
                    onChange={(event) =>
                      setProblemForm({
                        ...problemForm,
                        sampleInput: event.target.value,
                      })
                    }
                    placeholder="Sample input"
                    rows={6}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                  <textarea
                    value={problemForm.sampleOutput}
                    onChange={(event) =>
                      setProblemForm({
                        ...problemForm,
                        sampleOutput: event.target.value,
                      })
                    }
                    placeholder="Sample output"
                    rows={6}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <input
                  value={problemForm.tags}
                  onChange={(event) =>
                    setProblemForm({ ...problemForm, tags: event.target.value })
                  }
                  placeholder="Tags, separated by commas"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? "Saving..."
                      : selectedProblemId
                        ? "Update Problem"
                        : "Create Problem"}
                  </button>
                  {selectedProblemId ? (
                    <button
                      type="button"
                      onClick={resetProblemForm}
                      className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Clear Selection
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold">Users</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Username</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-850/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-slate-200">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-300">
                        {user.username || "-"}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-300">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => handleUserDelete(user._id)}
                          className="inline-flex items-center gap-2 bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
