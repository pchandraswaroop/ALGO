const crypto = require("crypto");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const TestCase = require("../model/TestCase");

const LANGUAGE_SPECS = {
  c: {
    file: "main.c",
    image: process.env.JUDGE_IMAGE_C || "judge-gcc:13",
    compile: "gcc -std=c11 -O2 -pipe /workspace/main.c -o /workspace/main",
    run: "/workspace/main",
  },
  cpp: {
    file: "main.cpp",
    image: process.env.JUDGE_IMAGE_CPP || "judge-gcc:13",
    compile: "g++ -std=c++17 -O2 -pipe /workspace/main.cpp -o /workspace/main",
    run: "/workspace/main",
  },
  java: {
    file: "Main.java",
    image: process.env.JUDGE_IMAGE_JAVA || "judge-java:17",
    compile: "javac /workspace/Main.java",
    run: "java -cp /workspace Main",
  },
  javascript: {
    file: "main.js",
    image: process.env.JUDGE_IMAGE_JAVASCRIPT || "judge-node:18",
    run: "node /workspace/main.js",
  },
  python: {
    file: "main.py",
    image: process.env.JUDGE_IMAGE_PYTHON || "judge-python:3.10",
    run: "python3 /workspace/main.py",
  },
};

const normalizeOutput = (value) =>
  String(value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();

const execFile = (command, args, options = {}) =>
  new Promise((resolve) => {
    const startedAt = process.hrtime.bigint();
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: false,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill("SIGKILL");
        }, options.timeoutMs)
      : null;

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      if (timer) {
        clearTimeout(timer);
      }
      resolve({
        code: null,
        stdout,
        stderr: stderr || error.message,
        timedOut,
        runtimeMs: 0,
      });
    });

    child.on("close", (code) => {
      if (timer) {
        clearTimeout(timer);
      }
      const runtimeMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      resolve({ code, stdout, stderr, timedOut, runtimeMs });
    });

    child.stdin.end(options.input || "");
  });

const toDockerMountPath = (workDir) => workDir.replace(/\\/g, "/");

const runDocker = async ({
  workDir,
  image,
  command,
  input = "",
  readonly = false,
  memoryLimitMb,
  timeLimitMs,
}) => {
  const containerName = `judge_${crypto.randomBytes(8).toString("hex")}`;
  const args = [
    "run",
    "--name",
    containerName,
    "--network",
    "none",
    "--cpus",
    process.env.JUDGE_DOCKER_CPUS || "0.5",
    "--memory",
    `${memoryLimitMb}m`,
    "--memory-swap",
    `${memoryLimitMb}m`,
    "--pids-limit",
    process.env.JUDGE_DOCKER_PIDS_LIMIT || "128",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "--read-only",
    "--workdir",
    "/workspace",
    "--tmpfs",
    "/tmp:rw,noexec,nosuid,size=64m",
    "-v",
    `${toDockerMountPath(workDir)}:/workspace${readonly ? ":ro" : ""}`,
    "-i",
    image,
    "sh",
    "-c",
    command,
  ];

  try {
    return await execFile("docker", args, {
      input,
      timeoutMs: timeLimitMs + 2000,
    });
  } finally {
    await execFile("docker", ["rm", "-f", containerName], { timeoutMs: 2000 });
  }
};

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
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "judge-"));

  try {
    await fs.chmod(workDir, 0o777);
    await fs.writeFile(path.join(workDir, spec.file), submission.code, "utf8");

    if (spec.compile) {
      const compileResult = await runDocker({
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
          error: (compileResult.stderr || compileResult.stdout).slice(0, 4000),
        };
      }
    }

    let maxExecutionTime = 0;

    for (const testCase of testCases) {
      const runResult = await runDocker({
        workDir,
        image: spec.image,
        command: spec.run,
        input: testCase.input,
        readonly: true,
        memoryLimitMb,
        timeLimitMs,
      });

      const executionTime = Math.ceil(runResult.runtimeMs);
      maxExecutionTime = Math.max(maxExecutionTime, executionTime);

      if (runResult.timedOut || executionTime > timeLimitMs) {
        return {
          verdict: "Time Limit Exceeded",
          executionTime: maxExecutionTime,
          memoryUsed: 0,
          error: "Execution timed out",
        };
      }

      if (runResult.code !== 0) {
        return {
          verdict: "Runtime Error",
          executionTime: maxExecutionTime,
          memoryUsed: 0,
          error: runResult.stderr.slice(0, 4000),
        };
      }

      if (normalizeOutput(runResult.stdout) !== normalizeOutput(testCase.expectedOutput)) {
        return {
          verdict: "Wrong Answer",
          executionTime: maxExecutionTime,
          memoryUsed: 0,
          error: "",
        };
      }
    }

    return {
      verdict: "Accepted",
      executionTime: maxExecutionTime,
      memoryUsed: 0,
      error: "",
    };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
};

module.exports = {
  runSubmission,
  normalizeOutput,
};
