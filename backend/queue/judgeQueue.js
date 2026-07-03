const { getRabbitChannel } = require("./rabbitmq");

const JUDGE_QUEUE_NAME = process.env.JUDGE_QUEUE_NAME || "judge.submissions";

const enqueueJudgeJob = async (judgeJobId, submissionId) => {
  const channel = await getRabbitChannel();

  await channel.assertQueue(JUDGE_QUEUE_NAME, {
    durable: true,
  });

  const payload = Buffer.from(
    JSON.stringify({
      judgeJobId: judgeJobId.toString(),
      submissionId: submissionId.toString(),
    }),
  );

  const queued = channel.sendToQueue(JUDGE_QUEUE_NAME, payload, {
    persistent: true,
    contentType: "application/json",
  });

  if (!queued) {
    throw new Error("RabbitMQ write buffer is full");
  }
};

module.exports = {
  enqueueJudgeJob,
  JUDGE_QUEUE_NAME,
};
