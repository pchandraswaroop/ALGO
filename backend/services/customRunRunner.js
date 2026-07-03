const crypto = require("crypto");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const { runDockerContainer } = require("./dockerSandbox");
const { LANGUAGE_SPECS } = require("./languageRuntime");

const runCustomCode = async ({
  language,
  code,
  input,
  timeLimitMs,
  memoryLimitMb,
}) => {
  const spec = LANGUAGE_SPECS[language];

  if (!spec) {
    return {
      success: false,
      verdict: "Runtime Error",
      stdout: "",
      stderr: `Unsupported language: ${language}`,
      executionTime: 0,
      memoryUsed: 0,
    };
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "custom-run-"));

  try {
    await fs.chmod(workDir, 0o777);
    await fs.writeFile(path.join(workDir, spec.file), code, "utf8");

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
          success: true,
          verdict: "Compilation Error",
          stdout: compileResult.stdout,
          stderr: (compileResult.stderr || compileResult.stdout).slice(0, 4000),
          executionTime: Math.ceil(compileResult.runtimeMs),
          memoryUsed: 0,
        };
      }
    }

    const runResult = await runDockerContainer({
      workDir,
      image: spec.image,
      command: spec.run,
      input,
      readonly: true,
      memoryLimitMb,
      timeLimitMs,
    });

    if (runResult.timedOut) {
      return {
        success: true,
        verdict: "Time Limit Exceeded",
        stdout: runResult.stdout,
        stderr: runResult.stderr,
        executionTime: Math.ceil(runResult.runtimeMs),
        memoryUsed: 0,
      };
    }

    if (runResult.code !== 0) {
      return {
        success: true,
        verdict: "Runtime Error",
        stdout: runResult.stdout,
        stderr: runResult.stderr.slice(0, 4000),
        executionTime: Math.ceil(runResult.runtimeMs),
        memoryUsed: 0,
      };
    }

    return {
      success: true,
      verdict: "Accepted",
      stdout: runResult.stdout,
      stderr: "",
      executionTime: Math.ceil(runResult.runtimeMs),
      memoryUsed: 0,
    };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
};

module.exports = {
  runCustomCode,
};
