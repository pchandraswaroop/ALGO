const dotenv = require("dotenv");

const DBConnection = require("./database/db");
const JudgeJob = require("./model/JudgeJob");
const Submission = require("./model/Submission");
const { getRabbitChannel, closeRabbitConnection } = require("./queue/rabbitmq");
const { JUDGE_QUEUE_NAME } = require("./queue/judgeQueue");
const { runSubmission } = require("./services/judgeRunner");

dotenv.config();

const workerEnabled = process.env.JUDGE_WORKER_ENABLED === "true";
const workerPrefetch = Number(process.env.JUDGE_WORKER_PREFETCH || 1);

const parseMessage = (message) => {
  try {
    return JSON.parse(message.content.toString("utf8"));
  } catch (error) {
    return null;
  }
};

const processJudgeMessage = async (payload) => {
  const { judgeJobId, submissionId } = payload;

  const judgeJob = await JudgeJob.findByIdAndUpdate(
    judgeJobId,
    {
      $set: {
        status: "running",
        startedAt: new Date(),
        error: "",
      },
      $inc: {
        attempts: 1,
      },
    },
    { new: true },
  );

  if (!judgeJob) {
    throw new Error(`Judge job not found: ${judgeJobId}`);
  }

  const submission = await Submission.findById(submissionId).populate(
    "problemId",
  );
  if (!submission) {
    throw new Error(`Submission not found: ${submissionId}`);
  }

  if (!submission.problemId) {
    throw new Error(`Problem not found for submission: ${submissionId}`);
  }

  const result = await runSubmission({
    submission,
    problem: submission.problemId,
  });

  await Submission.findByIdAndUpdate(submission._id, {
    verdict: result.verdict,
    executionTime: result.executionTime,
    memoryUsed: result.memoryUsed,
  });

  await JudgeJob.findByIdAndUpdate(judgeJob._id, {
    status: "completed",
    finishedAt: new Date(),
    error: result.error || "",
  });

  console.log(
    `Judged submission ${submissionId}: ${result.verdict}`,
  );
};

const startWorker = async () => {
  await DBConnection();

  if (!workerEnabled) {
    console.log(
      "Judge worker is disabled. Set JUDGE_WORKER_ENABLED=true after the Docker runner is implemented.",
    );
    return;
  }

  const channel = await getRabbitChannel();
  await channel.assertQueue(JUDGE_QUEUE_NAME, { durable: true });
  channel.prefetch(workerPrefetch);

  await channel.consume(
    JUDGE_QUEUE_NAME,
    async (message) => {
      if (!message) {
        return;
      }

      const payload = parseMessage(message);
      if (!payload?.judgeJobId || !payload?.submissionId) {
        console.error("Invalid judge message:", message.content.toString());
        channel.ack(message);
        return;
      }

      try {
        await processJudgeMessage(payload);
        channel.ack(message);
      } catch (error) {
        console.error("Judge worker failed:", error.message);
        if (payload.judgeJobId) {
          await JudgeJob.findByIdAndUpdate(payload.judgeJobId, {
            status: "failed",
            finishedAt: new Date(),
            error: error.message,
          });
        }
        channel.nack(message, false, false);
      }
    },
    { noAck: false },
  );

  console.log(`Judge worker is listening on queue: ${JUDGE_QUEUE_NAME}`);
};

const shutdown = async () => {
  try {
    await closeRabbitConnection();
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startWorker().catch((error) => {
  console.error("Failed to start judge worker:", error);
  process.exit(1);
});
