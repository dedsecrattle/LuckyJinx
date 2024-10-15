import express, { Application, Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { ExpressPeerServer } from "peer";

// Create Express app
const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
const peerServer = ExpressPeerServer(server);
app.use("/peerjs", peerServer);

const users: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", (userId: string, roomId: string) => {
    users[socket.id] = roomId;
    socket.join(roomId);
    console.log(`${userId} joined room: ${roomId}`);

    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      delete users[socket.id];
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("send-message", (message: string, roomId: string) => {
    io.to(roomId).emit("receive-message", message);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
