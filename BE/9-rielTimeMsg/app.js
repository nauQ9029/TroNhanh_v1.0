const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// riel-time messaging
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"],
  },
});

app.use(cors()); //Share tai nguyen giua cac cong khac nhau
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Routes
//Accomodation, User,...

app.get("/", (req, res) => {
  res.send("Welcome to TRO-NHANH");
});

//  Auth routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

//  Profile routes
const profileRoutes = require("./src/routes/profileRoutes");
app.use("/api/customer", profileRoutes);

//  Accommodation routes
const accommodationRoutes = require("./src/routes/accommodationRoutes");
app.use("/api/accommodation", accommodationRoutes);

// Riel-time messaging route
const messagesRoutes = require("./src/routes/messagesRoutes");
app.use("/api/messages", messagesRoutes);

// Booking routes
const bookingRoutes = require("./src/routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

//  Favorite routes
const favoriteRoutes = require("./src/routes/favoritesRoutes");
app.use("/api/favorites", favoriteRoutes);

// // Chat Routes
// const chatRoutes = require("./src/routes/chatRoutes");
// app.use("/api/messages", chatRoutes);

//  Roommate routes
const roommateRoutes = require("./src/routes/roommateRoutes");
app.use("/api/roommates", roommateRoutes);

//  Report routes
const reportRoutes = require("./src/routes/reportRoutes");
app.use("/api/reports", reportRoutes);

//  Admin routes
const adminRoutes = require("./src/routes/adminRoutes");
app.use("/api/admin", adminRoutes);

//  Membership routes
const membershipRoutes = require("./src/routes/membershipRoutes");
app.use("/api/membership-packages", membershipRoutes);

//  Payment routes
const paymentRoutes = require("./src/routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// socket.IO
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ${socket.id}`);
    console.log("Online users:", Array.from(onlineUsers.keys()));
  });

  socket.on("send-message", (data) => {
    console.log(" >>>[INFO] Message sent:", data);

    const receiverSocket = onlineUsers.get(data.receiverId);

    if (receiverSocket) {
      console.log(
        ` >>>[INFO] Sending message to ${data.receiverId} via socket ${receiverSocket}`
      );
      // send the entire data object to the receiver
      io.to(receiverSocket).emit("message-receive", data);
    } else {
      console.log(` >>>[INFO] Receiver ${data.receiverId} is not online`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    // remove user from online users map
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        console.log(` >>>[INFO] User ${userId} removed from online users`);
        break;
      }
    }
    console.log(
      " >>>[DEBUG] Online users after disconnect:",
      Array.from(onlineUsers.keys())
    );
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
