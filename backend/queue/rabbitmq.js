const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

let connection = null;
let channel = null;

const getRabbitChannel = async () => {
  if (channel) {
    return channel;
  }

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
  return channel;
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
