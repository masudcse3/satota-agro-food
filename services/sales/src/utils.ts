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
export const generatePagination = ({ totalItems, page, limit }) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage: page,
    nextPage: page < totalPages ? Number(page) + 1 : NaN,
    prevPage: page > 1 && page <= totalPages ? page - 1 : NaN,
    limit: Number(limit),
  };
};
