const crypto = require("crypto");
const { spawn } = require("child_process");

const toDockerMountPath = (workDir) => workDir.replace(/\\/g, "/");

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

const runDockerContainer = async ({
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
    "--user",
    "judge",
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
    await execFile("docker", ["rm", "-f", containerName], {
      timeoutMs: 2000,
    });
  }
};

module.exports = {
  runDockerContainer,
};
