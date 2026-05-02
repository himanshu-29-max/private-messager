import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      // Notify others in room
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("send-message", (data: { roomId: string; message: string; sender: string }) => {
      // Broadcast to everyone in the room EXCEPT the sender
      socket.to(data.roomId).emit("receive-message", data);
    });

    // WebRTC Signaling Events
    socket.on("webrtc-offer", (data: { target: string; offer: any; caller: string }) => {
      io.to(data.target).emit("webrtc-offer", { offer: data.offer, caller: data.caller });
    });

    socket.on("webrtc-answer", (data: { target: string; answer: any }) => {
      io.to(data.target).emit("webrtc-answer", data.answer);
    });

    socket.on("webrtc-ice-candidate", (data: { target: string; candidate: any }) => {
      io.to(data.target).emit("webrtc-ice-candidate", data.candidate);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
