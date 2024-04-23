/** @format */

import amqp from "amqplib";

export const fireEvent = async (
  queue: string,
  exchange: string,
  data: string
) => {
  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const q = await channel.assertQueue(queue, { durable: true });
    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.bindQueue(q.queue, exchange, queue);
    channel.publish(exchange, queue, Buffer.from(data));

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("[RabitMQ Error]: ", error);
  }
};
