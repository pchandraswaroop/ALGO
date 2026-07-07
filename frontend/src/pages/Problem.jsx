import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  createSubmission,
  getProblemById,
  getSubmissionById,
  getUserSubmissions,
  runCustomCode,
} from "../api";
import {
  ArrowLeft,
  AlertCircle,
  LoaderCircle,
  Clock,
  Play,
  Send,
  History,
  Bookmark,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Panel, Group, Separator } from "react-resizable-panels";

const TEMPLATES = {
  javascript: `// Write your solution here\nfunction solve() {\n    \n}\nsolve();\n`,
  python: `# Write your solution here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`,
  java: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n`
};

export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [customInput, setCustomInput] = useState("");
  const [customRunOutput, setCustomRunOutput] = useState("");
  const [runningCustomCode, setRunningCustomCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("description");
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [activeCase, setActiveCase] = useState("case1");
  const [fontSize, setFontSize] = useState(16);
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState(null);

  // Watch document class changes to dynamically adapt Editor theme
  const [workspaceTheme, setWorkspaceTheme] = useState(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    setCode(TEMPLATES[language] || "// Write your solution here\n");
  }, [language]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setWorkspaceTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const editorLanguage =
    language === "cpp"
      ? "cpp"
      : language === "java"
        ? "java"
        : language === "python"
          ? "python"
          : language === "c"
            ? "c"
            : "javascript";

  const updateSubmissionInList = (updatedSubmission) => {
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission._id === updatedSubmission._id
          ? { ...updatedSubmission, problemId: problem }
          : submission
      )
    );
  };

  const pollSubmissionVerdict = async (submissionId) => {
    const maxAttempts = 15;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await getSubmissionById(submissionId);
      if (!res.success) {
        continue;
      }

      updateSubmissionInList(res.submission);

      if (res.submission.verdict !== "Pending") {
        setSubmissionMessage(`Verdict: ${res.submission.verdict}`);
        setCustomRunOutput(
          `Final Verdict: ${res.submission.verdict}\nExecution Time: ${res.submission.executionTime}ms\nMemory: ${res.submission.memoryUsed}KB`
        );
        
        setLatestSubmission(res.submission);
        setShowResultModal(true);
        
        return;
      }
    }

    setSubmissionMessage("Submission is still Pending. Check again shortly.");
    setCustomRunOutput("Polling timeout reached. Please check the Submissions tab for the final verdict.");
  };

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const [problemRes, submissionsRes] = await Promise.all([
          getProblemById(id),
          getUserSubmissions(),
        ]);

        if (problemRes.success) {
          setProblem(problemRes.problem);
          if (problemRes.problem.sampleInput) {
            setCustomInput(problemRes.problem.sampleInput);
          }
        } else {
          setError(problemRes.message || "Failed to load problem");
        }

        if (submissionsRes.success) {
          setSubmissions(
            (submissionsRes.submissions || []).filter(
              (submission) => submission.problemId?._id === id
            )
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
    if (event) event.preventDefault();
    setError("");
    setSubmissionMessage("");
    setSubmitting(true);
    setConsoleTab("output");
    setActiveTab("submissions");
    setCustomRunOutput("Queueing submission... Waiting for verdict...");

    try {
      const res = await createSubmission({
        problemId: id,
        language,
        code,
      });

      if (res.success) {
        setSubmissionMessage("Submission queued.");
        setSubmissions((currentSubmissions) => [
          { ...res.submission, problemId: problem },
          ...currentSubmissions,
        ]);
        void pollSubmissionVerdict(res.submission._id);
      }
    } catch (err) {
      setError(err.message || "Failed to create submission");
      setCustomRunOutput(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomRun = async () => {
    setError("");
    setCustomRunOutput("Running testcase code in sandbox container...");
    setRunningCustomCode(true);
    setConsoleTab("output");

    try {
      const res = await runCustomCode({
        problemId: id,
        language,
        code,
        input: customInput,
      });

      if (res.success) {
        setCustomRunOutput(
          `Verdict: ${res.result.verdict}\n\nStdout:\n${res.result.stdout || ""}\n\nStderr:\n${res.result.stderr || ""}`
        );
      }
    } catch (err) {
      setError(err.message || "Failed to run custom code");
      setCustomRunOutput(`Error: ${err.message}`);
    } finally {
      setRunningCustomCode(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[var(--app-bg)] flex items-center justify-center text-[var(--text-muted)] transition-colors duration-200">
        <div className="flex items-center gap-3">
          <LoaderCircle className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="font-mono text-xs">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen bg-[var(--app-bg)] flex items-center justify-center px-4 text-[var(--text-main)] transition-colors duration-200">
        <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl p-6">
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="w-5 h-5 animate-bounce" />
            <span>{error || "Problem workspace not found"}</span>
          </div>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[var(--app-bg)] text-[var(--text-main)] overflow-hidden font-sans select-none transition-colors duration-200">
      {/* Top Coding Workspace Header */}
      <header className="h-14 border-b border-[var(--border-main)] bg-[var(--card-bg)] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Problems
          </Link>
          <div className="h-4 w-px bg-[var(--border-main)]"></div>
          <span className="font-bold text-sm text-[var(--text-main)]">
            #{problem._id.slice(-4)} · {problem.title}
          </span>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              problem.difficulty === "Easy"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 border border-emerald-200"
                : problem.difficulty === "Medium"
                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-450 border border-amber-200"
                  : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-450 border border-red-200"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* History / submissions count */}
          <button
            onClick={() => setActiveTab("submissions")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover)] border border-[var(--button-secondary-border)] text-[var(--button-secondary-text)] text-xs font-semibold transition-all"
            title="Submissions History"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] flex items-center justify-center font-bold text-[var(--text-main)]">
              {submissions.length}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover)] border border-[var(--button-secondary-border)] transition-colors ${
              bookmarked ? "text-amber-500" : "text-[var(--text-muted)]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          {/* Run Code */}
          <button
            onClick={handleCustomRun}
            disabled={runningCustomCode}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[var(--button-secondary-bg)] hover:bg-[var(--button-secondary-hover)] border border-[var(--button-secondary-border)] text-[var(--button-secondary-text)] disabled:opacity-50 font-semibold text-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-[var(--text-main)] text-[var(--text-main)]" />
            <span>{runningCustomCode ? "Running" : "Run"}</span>
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-500/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "Submitting" : "Submit"}</span>
          </button>
        </div>
      </header>

      {/* Main Split Columns Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <Group orientation="horizontal">
          
          {/* Left Side Pane: Description & Details */}
          <Panel defaultSize={45} minSize={25} id="left-pane" order={1}>
            <div className="h-full flex flex-col overflow-hidden bg-[var(--sidebar-bg)] border-r border-[var(--border-main)]">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-[var(--input-bg)] px-2 py-1.5 border-b border-[var(--border-main)] shrink-0">
            {["description", "hints", "submissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  activeTab === tab
                    ? "bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-main)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                {tab === "description" ? "Description" : tab === "hints" ? "Hints" : "Submissions"}
              </button>
            ))}
          </div>

          {/* Tab Contents Pane (With Scrollbar) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === "description" && (
              <div className="space-y-6">
                {/* Meta pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(problem.tags || []).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold uppercase tracking-wider bg-[var(--input-bg)] px-2.5 py-1 rounded-md border border-[var(--border-main)] text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 px-2.5 py-1 rounded-md">
                    Acceptance 80%
                  </span>
                </div>

                {/* Problem Statement Body */}
                <div className="space-y-3 font-sans text-base leading-relaxed text-[var(--text-main)] opacity-90">
                  <p className="whitespace-pre-wrap">{problem.statement}</p>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Examples</h3>

                  {/* Sample Input/Output container */}
                  <div className="space-y-3">
                    <div className="bg-[var(--input-bg)] border border-[var(--border-main)] rounded-xl p-4 space-y-2">
                      <span className="block text-[10px] uppercase font-extrabold tracking-wider text-[var(--text-muted)]">
                        Example 1
                      </span>
                      <div className="space-y-1 text-sm font-mono">
                        <div>
                          <span className="text-[var(--text-muted)]">Input:</span>{" "}
                          <span className="text-[var(--text-main)]">{problem.sampleInput || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Output:</span>{" "}
                          <span className="text-[var(--text-main)]">{problem.sampleOutput || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limits & Constraints */}
                <div className="space-y-3 pt-4 border-t border-[var(--border-main)]">
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Constraints</h3>
                  <ul className="list-disc pl-5 text-xs text-[var(--text-muted)] space-y-1.5 font-mono">
                    <li>Time limit: {problem.timeLimit || 2} seconds</li>
                    <li>Memory limit: {problem.memoryLimit || 256} megabytes</li>
                    <li>Follow stdin format. Print output to stdout.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Solution Hints</h3>
                <div className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-main)] text-sm text-[var(--text-main)] leading-relaxed font-sans">
                  {problem.hints || "Use an efficient hash map to match items in O(N) runtime speed."}
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Recent Runs</h3>
                {submissions.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] font-mono">No submissions made yet for this task.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div
                        key={sub._id}
                        className="p-3.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border-main)] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-[var(--text-main)] capitalize font-mono">
                            {sub.language}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              sub.verdict === "Accepted"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
                                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200"
                            }`}
                          >
                            {sub.verdict}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                          <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                          <div className="flex items-center gap-3">
                            <span>Time: {sub.executionTime || 0} ms</span>
                            <button 
                              onClick={() => setExpandedSubmission(expandedSubmission === sub._id ? null : sub._id)}
                              className="text-[var(--text-main)] hover:text-emerald-500 transition-colors font-bold flex items-center gap-1"
                            >
                              <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">&lt;/&gt; View Code</code>
                            </button>
                          </div>
                        </div>
                        
                        {expandedSubmission === sub._id && (
                          <div className="mt-3 pt-3 border-t border-[var(--border-main)]">
                            <pre className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border-main)] overflow-x-auto text-[10px] text-[var(--text-main)] font-mono leading-relaxed">
                              {sub.code}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Panel>

          <Separator className="w-1.5 bg-[var(--border-main)] hover:bg-emerald-500/50 transition-colors cursor-col-resize active:bg-emerald-500 z-50 flex items-center justify-center">
            <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </Separator>

          {/* Right Side Pane: Code Editor & Test Console */}
          <Panel defaultSize={55} minSize={30} id="right-pane" order={2}>
            <div className="h-full w-full flex flex-col">
              <Group orientation="vertical">
              
              {/* Top Panel: Monaco Editor Workspace */}
              <Panel defaultSize={70} minSize={20} id="top-pane" order={1}>
                <div className="h-full flex flex-col overflow-hidden min-h-0 bg-[var(--card-bg)]">
            
            {/* Editor control header */}
            <div className="h-11 px-4 bg-[var(--input-bg)] border-b border-[var(--border-main)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-lg px-2.5 py-1 text-xs text-[var(--text-main)] outline-none focus:border-emerald-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++ 17</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                </select>
              </div>

              {/* Preferences: Font-size, Refresh templates */}
              <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
                <button
                  onClick={() => setCode(TEMPLATES[language] || "// Write your solution here\n")}
                  className="p-1 rounded hover:bg-slate-205 hover:text-[var(--text-main)]"
                  title="Reset code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <div className="h-3.5 w-px bg-[var(--border-main)]"></div>
                <div className="flex items-center gap-1">
                  <span>Size</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded px-1 py-0.5 text-[10px] text-[var(--text-main)] outline-none"
                  >
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <div className="flex-1 overflow-hidden relative">
              <Editor
                height="100%"
                language={editorLanguage}
                theme={workspaceTheme === "dark" ? "vs-dark" : "vs"}
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>
        </Panel>

              <Separator className="h-1.5 bg-[var(--border-main)] hover:bg-emerald-500/50 transition-colors cursor-row-resize active:bg-emerald-500 z-50 flex items-center justify-center">
                <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
              </Separator>

              {/* Bottom Panel: Interactive Test Console */}
              <Panel defaultSize={30} minSize={10} id="bottom-pane" order={2}>
                <div className="h-full border-t border-[var(--border-main)] bg-[var(--app-bg)] flex flex-col overflow-hidden shrink-0">
            {/* Console Control Tabs */}
            <div className="h-10 bg-[var(--input-bg)] border-b border-[var(--border-main)] px-4 flex items-center justify-between shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setConsoleTab("testcase")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    consoleTab === "testcase" ? "bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-main)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  Testcase
                </button>
                <button
                  onClick={() => setConsoleTab("output")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    consoleTab === "output" ? "bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-main)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  Output
                </button>
              </div>
            </div>

            {/* Console body content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {consoleTab === "testcase" ? (
                <div className="space-y-3 h-full flex flex-col">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setActiveCase("case1")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                        activeCase === "case1" ? "bg-slate-200 dark:bg-slate-800 text-[var(--text-main)] border border-[var(--border-main)]" : "bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--border-main)]"
                      }`}
                    >
                      Case 1
                    </button>
                    <button
                      onClick={() => setActiveCase("case2")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                        activeCase === "case2" ? "bg-slate-200 dark:bg-slate-800 text-[var(--text-main)] border border-[var(--border-main)]" : "bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--border-main)]"
                      }`}
                    >
                      Case 2
                    </button>
                  </div>
                  
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 w-full bg-[var(--card-bg)] border border-[var(--border-main)] rounded-xl p-3 text-[var(--text-main)] outline-none focus:border-emerald-500 font-mono text-xs resize-none"
                    placeholder="Enter stdin values..."
                    spellCheck="false"
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {customRunOutput ? (
                    <pre className="flex-1 w-full bg-[var(--card-bg)] border border-[var(--border-main)] rounded-xl p-3 text-[var(--text-main)] overflow-auto whitespace-pre-wrap">
                      {customRunOutput}
                    </pre>
                  ) : (
                    <p className="text-[var(--text-muted)] italic py-6 text-center">Run code to see compile and execution verdicts here.</p>
                  )}
                </div>
              )}
            </div>
                </div>
              </Panel>

              </Group>
            </div>
          </Panel>

        </Group>
      </div>

      {/* Submission Result Modal */}
      {showResultModal && latestSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-main)] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-main)]">
              <div className="flex items-center gap-2">
                {latestSubmission.verdict === "Accepted" ? (
                  <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accepted
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">
                    <XCircle className="w-3.5 h-3.5" />
                    {latestSubmission.verdict}
                  </span>
                )}
                <span className="font-bold text-sm text-[var(--text-main)] ml-1">Submission Result</span>
              </div>
              <button 
                onClick={() => setShowResultModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-[var(--input-bg)]">
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-main)] p-4 space-y-3 font-mono text-sm text-[var(--text-main)] shadow-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Verdict:</span>
                  <span className="font-bold">{latestSubmission.verdict}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Passed:</span>
                  <span className="font-bold">{latestSubmission.testcasesPassed || 0} / {latestSubmission.totalTestcases || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Runtime:</span>
                  <span className="font-bold">{latestSubmission.executionTime} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Memory:</span>
                  <span className="font-bold">{latestSubmission.memoryUsed} MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
