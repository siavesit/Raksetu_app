const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}

connectDB();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
const server = http.createServer(app);

// WebSocket server (Socket.IO) attached to the same HTTP server
const io = new Server(server, { cors: { origin: CLIENT_URL } });
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // When a browser sends a chat message, send it to EVERY connected browser
  socket.on("chatMessage", (data) => {
    const username = String(data?.username ?? "").trim().slice(0, 30);
    const message = String(data?.message ?? "").trim().slice(0, 300);
    if (!username || !message) return;
    io.emit("chatMessage", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(helmet());
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: "10kb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later" },
  })
);

app.use(
  "/api/users/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many login attempts, please try again after 15 minutes" },
  })
);

app.get("/", (req, res) => {
  res.send("RaktSetu API is Running");
});

app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});