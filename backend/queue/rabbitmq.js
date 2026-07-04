const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

let connection = null;
let channel = null;

const getRabbitChannel = async (retries = 10, delay = 3000) => {
  if (channel) {
    return channel;
  }

  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);

      connection.on("error", (error) => {
        console.error("RabbitMQ connection error:", error.message);
        channel = null;
        connection = null;
      });

      connection.on("close", () => {
        console.warn("RabbitMQ connection closed");
        channel = null;
        connection = null;
      });

      channel = await connection.createChannel();
      console.log("Successfully connected to RabbitMQ");
      return channel;
    } catch (err) {
      console.warn(`Failed to connect to RabbitMQ (attempt ${i + 1}/${retries}): ${err.message}`);
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
};

const closeRabbitConnection = async () => {
  if (channel) {
    await channel.close();
    channel = null;
  }

  if (connection) {
    await connection.close();
    connection = null;
  }
};

module.exports = {
  getRabbitChannel,
  closeRabbitConnection,
};
