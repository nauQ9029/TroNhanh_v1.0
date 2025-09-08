const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const socketHandlers = require("./src/socket/socket");
const onlineUsers = new Map();
const userSockets = new Map(); // track multiple sockets per user

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// attach shared instances for access in controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);
app.set("userSockets", userSockets);

io.on("connection", (socket) => {
  socketHandlers(io, socket, onlineUsers, userSockets);
});

// heartbeat monitoring
setInterval(() => {
  const onlineCount = onlineUsers.size;
  const totalSockets = io.sockets.sockets.size;
  console.log(
    `[SOCKET] Heartbeat - Online users: ${onlineCount}, Total sockets: ${totalSockets}`
  );

  // emit heartbeat to all connected clients
  io.emit("heartbeat", { timestamp: Date.now() });
}, 15000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` >>>[INFO]🚀 Server running on http://localhost:${PORT}`);
});
