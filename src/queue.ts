// import amqp from 'amqplib';

// let channel: amqp.Channel;

// export async function connectQueue(): Promise<void> {
//   const connection = await amqp.connect(process.env.RABBITMQ_URL!);
//   channel = await connection.createChannel();
//   await channel.assertQueue('fileScanQueue');
// }

// export async function enqueueFile(fileId: string): Promise<void> {
//   channel.sendToQueue('fileScanQueue', Buffer.from(fileId));
// }

// export async function consumeQueue(callback: (id: string) => Promise<void>) {
//   await channel.consume('fileScanQueue', async msg => {
//     if (msg) {
//       const fileId = msg.content.toString();
//       await callback(fileId);
//       channel.ack(msg);
//     }
//   });
// }

import amqp, { Channel } from 'amqplib';

let channel: Channel | null = null;
const QUEUE_NAME = 'fileScanQueue';

export async function connectQueue(): Promise<Channel> {
  if (channel) return channel;

  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
  return channel;
}

export async function enqueueFile(fileId: string): Promise<void> {
  const ch = await connectQueue();
  ch.sendToQueue(QUEUE_NAME, Buffer.from(fileId));
}

export async function consumeQueue(callback: (id: string) => Promise<void>): Promise<void> {
  const ch = await connectQueue();
  await ch.consume(QUEUE_NAME, async (msg) => {
    if (msg) {
      const fileId = msg.content.toString();
      try {
        await callback(fileId);
      } catch (err) {
        console.error('Error processing job:', err);
      }
      ch.ack(msg);
    }
  });
}
