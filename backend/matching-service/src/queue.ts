import amqplib from 'amqplib';
import { startMatching } from './matchingService';

let channel: amqplib.Channel;

export async function initQueue() {
    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('matchingQueue', { durable: true });

    channel.consume('matchingQueue', async (msg) => {
        if (msg !== null) {
            const { userId, topic, difficulty } = JSON.parse(msg.content.toString());

            // Attempt to match the user
            const result = await startMatching(userId, topic, difficulty);

            console.log(`User ${userId}: ${result.message}`);

            // Send feedback back to the user (in a real system, you'd send the result back to the frontend)
            channel.ack(msg);
        }
    });
}

export function sendToQueue(data: { userId: string; topic: string; difficulty: string }) {
    channel.sendToQueue('matchingQueue', Buffer.from(JSON.stringify(data)), { persistent: true });
}
