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
  const user = await prisma.matchRecord.findFirst({
    where: { userId, isArchived: false },
  });
  if (user) {
    console.log("User already present in match record");
    const pastSocketId = user.socketId;
    if (pastSocketId !== socketId) {
      console.log("Duplicate socket detected");
      io.to(pastSocketId).emit('duplicate socket', 'New connection detected for the same user. Please close the current page');

      // update socket id upon potential reconnection
      await prisma.matchRecord.update({
        where: { recordId: user.recordId },
        data: { socketId },
      })
    }
    console.log(user);
    return;
  }

  // check if there is a match
  const existingMatch = await prisma.matchRecord.findFirst({
    where: {
      topic,
      difficulty,
      matched: false,
      isArchived: false,
      NOT: { userId },
    },
  });

  if (existingMatch) {
    // Match found, update both records to mark as matched
    await prisma.$transaction([
      prisma.matchRecord.update({
        where: { recordId: existingMatch.recordId },
        data: { matched: true, matchedUserId: userId, isArchived: true },
      }),
      prisma.matchRecord.create({
        data: {
          userId,
          topic,
          difficulty,
          socketId,
          matched: true,
          matchedUserId: existingMatch.userId,
          isArchived: true,
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

export async function handleTimeout(userRequest: any) {
  const { userId, socketId } = userRequest;
  const result = await prisma.matchRecord.findFirst({
    where: { userId, isArchived: false },
  });

  if (!(result?.matched)) {
    console.log(`Timeout: No match found for user ${userId}`);
    io.to(socketId).emit('timeout', 'No match found. Please try again.'); 
  }
  // clean up the database regardless of match status
  if (result) {
    await prisma.matchRecord.update({
      where: { recordId: result.recordId },
      data: { isArchived: true },
    })
  }
}

export async function handleDisconnected(socketId: string) {
  const result = await prisma.matchRecord.findMany({
    where: { socketId }
  })
  if (result) {
    await prisma.matchRecord.updateMany({
      where: { socketId },
      data: { isArchived: true },
    })
  }
}
