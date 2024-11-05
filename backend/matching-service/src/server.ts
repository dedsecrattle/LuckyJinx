import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupRabbitMQ } from "./rabbitmq";
import {
  handleMatchingRequest,
  handleMatchingConfirm,
  handleMatchingDecline,
  handleDisconnected,
} from "./matchingService";

import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const prisma = new PrismaClient();

app.post("/check", async (req, res) => {
  const { userId, roomId } = req.body.data;

  const record = await prisma.matchRecord.findFirst({
    where: {
      roomNumber: roomId,
      OR: [
        {
          userId: userId,
        },
        {
          matchedUserId: userId,
        },
      ],
      matched: true,
    },
  });

  if (!record) {
    res.status(200).json({ hasAccess: false });
  } else {
    res.status(200).json({ hasAccess: true });
  }
});

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3003;

function setupSocketIO(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("matching_request", async (userRequest) => {
      console.log("Matching request received:", userRequest);
      await handleMatchingRequest(userRequest, socket.id);
    });

    socket.on("matching_confirm", async (userRequest) => {
      console.log("Matching confirmed:", userRequest);
      await handleMatchingConfirm(userRequest);
    });

    socket.on("matching_decline", async (userRequest) => {
      console.log("Matching declined:", userRequest);
      await handleMatchingDecline(userRequest);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      await handleDisconnected(socket.id);
    });
  });
}

async function startServer() {
  try {
    await setupRabbitMQ();

    setupSocketIO(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
