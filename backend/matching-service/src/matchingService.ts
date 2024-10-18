import { sendToQueue, sendDelayedMessage } from './rabbitmq';
import { io } from './server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DELAY_TIME = 30000;

export async function handleMatchingRequest(userRequest: any, socketId: string) {
  userRequest.socketId = socketId;

  addUserToQueue(userRequest);
  sendDelayedTimeoutMessage(userRequest);
}

function addUserToQueue(userRequest: any) {
  sendToQueue(userRequest);
  console.log('Sent user request to queue:', userRequest);
}

function sendDelayedTimeoutMessage(userRequest: any) {
  sendDelayedMessage(userRequest, DELAY_TIME);
  console.log('Sent delayed message for user request:', userRequest);
}

export async function handleUserRequest(userRequest: any) {
  const { userId, topic, difficulty, socketId } = userRequest;

  // check userId present in prisma
  const user = await prisma.matchRecord.findUnique({
    where: { userId },
  });
  if (user) {
    console.log("User already present in match record");
    console.log(user);
    return;
  }

  // check if there is a match
  const existingMatch = await prisma.matchRecord.findFirst({
    where: {
      topic,
      difficulty,
      matched: false,
      NOT: { userId },
    },
  });

  if (existingMatch) {
    // Match found, update both records to mark as matched
    await prisma.$transaction([
      prisma.matchRecord.update({
        where: { userId: existingMatch.userId },
        data: { matched: true, matchedUserId: userId },
      }),
      prisma.matchRecord.create({
        data: {
          userId,
          topic,
          difficulty,
          socketId,
          matched: true,
          matchedUserId: existingMatch.userId,
        },
      }),      
    ]);

    console.log(`Matched ${userId} with ${existingMatch.userId} on topic ${topic}, difficulty ${difficulty}`);

    // update both clients about the successful match
    io.to(socketId).emit("matched", { matchedWith: existingMatch.userId });
    io.to(existingMatch.socketId).emit("matched", { matchedWith: userId });    
  } else {
    await prisma.matchRecord.create({
      data: {
        userId,
        topic,
        difficulty,
        socketId,
        matched: false,
      },
    });

    console.log(`No match found for ${userId}, added to record`);
  }
}

async function deleteMatchRecord(userId: string) {
  await prisma.matchRecord.delete({
    where: { userId },
  });
}

export async function handleTimeout(userRequest: any) {
  const { userId, socketId } = userRequest;
  const result = await prisma.matchRecord.findUnique({
    where: { userId },
  });

  if (!(result?.matched)) {
    console.log(`Timeout: No match found for user ${userId}`);
    io.to(socketId).emit('timeout', 'No match found. Please try again.'); 
  }
  // clean up the database regardless of match status
  await deleteMatchRecord(userId);
}
