const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();

//Share tai nguyen giua cac cong khac nhau
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);

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

// ______________________________ TEMP ROUTE FOR TESTING SOCKET ______________________________
// app.get("/test-socket", (req, res) => {
//   const socketCount = io.sockets.sockets.size;
//   const onlineCount = onlineUsers.size;

//   res.json({
//     message: "Socket.IO server status",
//     connectedSockets: socketCount,
//     onlineUsers: onlineCount,
//     onlineUserIds: Array.from(onlineUsers.keys()),
//   });
// });

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

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

module.exports = app;
