const crypto = require("crypto");
const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");

let hostBackendPath = process.env.HOST_BACKEND_PATH || null;

const detectHostBackendPath = () => {
  if (hostBackendPath) return hostBackendPath;
  try {
    const hostname = os.hostname();
    const execSync = require("child_process").execSync;
    const inspectOutput = execSync(`docker inspect ${hostname}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const inspectData = JSON.parse(inspectOutput);
    const mounts = inspectData[0]?.Mounts || [];
    const appMount = mounts.find((m) => m.Destination === "/app");
    if (appMount) {
      hostBackendPath = appMount.Source;
      console.log(
        `[Docker Sandbox] Auto-detected host backend path: ${hostBackendPath}`
      );
    }
  } catch (err) {
    // Fallback if not inside docker container or docker inspect is unavailable
  }
  return hostBackendPath;
};

// Run auto-detection
detectHostBackendPath();

const toDockerMountPath = (workDir) => {
  let mappedPath = workDir;
  if (hostBackendPath && workDir.startsWith("/app")) {
    mappedPath = workDir.replace(/^\/app/, hostBackendPath);
  }
  return mappedPath.replace(/\\/g, "/");
};

const createWorkDir = async (prefix) => {
  const tempParent = path.join(process.cwd(), "temp");
  await fs.mkdir(tempParent, { recursive: true });
  const workDir = await fs.mkdtemp(path.join(tempParent, prefix));
  await fs.chmod(workDir, 0o777);
  return workDir;
};

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
  createWorkDir,
  toDockerMountPath,
};
