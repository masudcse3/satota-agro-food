/** @format */
import amqp from "amqplib";
export const receiveEventFromQueue = async (
  queue: string,
  exchange: string,
  cb: (message: string) => void
) => {
  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const q = await channel.assertQueue(queue, { durable: true });

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.bindQueue(q.queue, exchange, queue);

    await channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          cb(msg.content.toString());
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error("[Rabbit MQ receiver]:", error);
  }
};
