import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { PeerServer } from "peer";
import { PrismaClient } from "@prisma/client";
import { configDotenv } from "dotenv";

configDotenv();

const prisma = new PrismaClient();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3004;

app.use(cors());

async function main() {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("rejoin-room", async (userId: string) => {
      const userRecord = await prisma.userRoomMapping.findFirst({
        where: {
          userId,
        },
      });
      console.log("Reconnecting user:", userId);
      if (userRecord) {
        const roomId = userRecord.roomId;
        socket.join(roomId);
        console.log(`${userId} re-joined room: ${roomId}`);
        socket.broadcast.to(roomId).emit("user-connected", userId);
      }
    });

    socket.on("join-room", async (userId: string, roomId: string) => {
      socket.join(roomId);
      await prisma.userRoomMapping.create({
        data: {
          userId,
          roomId,
        },
      });
      console.log(`${userId} joined room: ${roomId}`);

      socket.broadcast.to(roomId).emit("user-connected", userId);

      socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.id}`);
        // await prisma.userRoomMapping.deleteMany({
        //   where: {
        //     userId,
        //     roomId,
        //   },
        // });
        socket.broadcast.to(roomId).emit("user-disconnected", userId);
      });
    });

    socket.on("send-message", (message: string, roomId: string) => {
      io.to(roomId).emit("receive-message", message);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const peerServer = PeerServer({ port: 9000, path: "/peerjs" });

  peerServer.on("connection", (client) => {
    console.log(`Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`Peer disconnected: ${client.getId()}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
