const crypto = require("crypto");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const TestCase = require("../model/TestCase");
const { LANGUAGE_SPECS } = require("./languageRuntime");
const { runDockerContainer, createWorkDir } = require("./dockerSandbox");

const normalizeOutput = (value) =>
  String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trimEnd();

const runSubmission = async ({ submission, problem }) => {
  const spec = LANGUAGE_SPECS[submission.language];
  if (!spec) {
    return {
      verdict: "Runtime Error",
      executionTime: 0,
      memoryUsed: 0,
      error: `Unsupported language: ${submission.language}`,
    };
  }

  const testCases = await TestCase.find({
    problemId: problem._id,
    isHidden: true,
  }).sort({ createdAt: 1 });

  if (testCases.length === 0) {
    return {
      verdict: "Runtime Error",
      executionTime: 0,
      memoryUsed: 0,
      error: "No hidden test cases found for this problem",
    };
  }

  const timeLimitMs = Number(problem.timeLimit || 2) * 1000;
  const memoryLimitMb = Number(problem.memoryLimit || 256);
  const workDir = await createWorkDir("judge-");

  try {
    await fs.writeFile(path.join(workDir, spec.file), submission.code, "utf8");
    await fs.chmod(path.join(workDir, spec.file), 0o777);

    if (spec.compile) {
      const compileResult = await runDockerContainer({
        workDir,
        image: spec.image,
        command: spec.compile,
        readonly: false,
        memoryLimitMb,
        timeLimitMs: Math.max(timeLimitMs, 10000),
      });

      if (compileResult.timedOut || compileResult.code !== 0) {
        return {
          verdict: "Compilation Error",
          executionTime: Math.ceil(compileResult.runtimeMs),
          memoryUsed: 0,
          testcasesPassed: 0,
          totalTestcases: testCases.length,
          error: (compileResult.stderr || compileResult.stdout).slice(0, 4000),
        };
      }
    }

    let maxExecutionTime = 0;
    let testcasesPassed = 0;
    const totalTestcases = testCases.length;

    for (const testCase of testCases) {
      const runResult = await runDockerContainer({
        workDir,
        image: spec.image,
        command: spec.run,
        input: testCase.input,
        readonly: true,
        memoryLimitMb,
        timeLimitMs,
      });

      const rawTime = Math.ceil(runResult.runtimeMs);
      const executionTime = Math.max(0, rawTime - 350);
      maxExecutionTime = Math.max(maxExecutionTime, executionTime);

      if (runResult.timedOut || rawTime > timeLimitMs) {
        return {
          verdict: "Time Limit Exceeded",
          executionTime: maxExecutionTime,
          memoryUsed: 0,
          testcasesPassed,
          totalTestcases,
          error: "Execution timed out",
        };
      }

      if (runResult.code !== 0) {
        const isOOM = runResult.code === 137;
        return {
          verdict: "Runtime Error",
          executionTime: maxExecutionTime,
          memoryUsed: isOOM ? memoryLimitMb : 0,
          testcasesPassed,
          totalTestcases,
          error: isOOM 
            ? `Runtime Error: Memory Limit Exceeded (${memoryLimitMb}MB)` 
            : runResult.stderr.slice(0, 4000),
        };
      }

      if (
        normalizeOutput(runResult.stdout) !==
        normalizeOutput(testCase.expectedOutput)
      ) {
        return {
          verdict: "Wrong Answer",
          executionTime: maxExecutionTime,
          memoryUsed: 0,
          testcasesPassed,
          totalTestcases,
          error: "",
        };
      }
      
      testcasesPassed++;
    }

    return {
      verdict: "Accepted",
      executionTime: maxExecutionTime,
      memoryUsed: 0,
      testcasesPassed,
      totalTestcases,
      error: "",
    };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
};

module.exports = {
  runSubmission,
  normalizeOutput,
  LANGUAGE_SPECS,
};
