module.exports = function socketHandlers(io, socket, onlineUsers, userSockets) {
  console.log(`[SOCKET] New connection: ${socket.id}`);

  socket.on("add-user", (userId) => {
    console.log(`[SOCKET] Adding user ${userId} with socket ${socket.id}`);

    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    onlineUsers.set(userId, socket.id);
    socket.emit("user-added", { userId, socketId: socket.id });
    socket.join(`user_${userId}`);

    console.log(
      `[SOCKET] User ${userId} added. Online users: [${Array.from(
        onlineUsers.keys()
      ).join(", ")}]`
    );
  });

  socket.on("send-message", (data) => {
    console.log(`[SOCKET] Processing message:`, {
      from: data.senderId,
      to: data.receiverId,
      accommodation: data.payload?.accommodationId,
      messageId: data.payload?._id,
    });

    const receiverId = data.receiverId;

    // Method 1: Emit to user room
    const userRoom = `user_${receiverId}`;
    socket.to(userRoom).emit("message-receive", data);

    // Method 2: Emit directly using onlineUsers
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket && io.sockets.sockets.get(receiverSocket)) {
      io.to(receiverSocket).emit("message-receive", data);
    }

    // Method 3: Emit to all sockets in userSockets map
    if (userSockets.has(receiverId)) {
      userSockets.get(receiverId).forEach((socketId) => {
        if (io.sockets.sockets.get(socketId)) {
          io.to(socketId).emit("message-receive", data);
        }
      });
    }

    console.log("[EMIT] receiverId:", receiverId);
    console.log("[EMIT] userSockets keys:", [...userSockets.keys()]);

    console.log(`[SOCKET] Message dispatched to user ${receiverId}`);
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", (reason) => {
    console.log(
      `[SOCKET] Socket disconnected: ${socket.id}, reason: ${reason}`
    );

    let disconnectedUserId = null;

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }

    if (disconnectedUserId) {
      if (userSockets.has(disconnectedUserId)) {
        userSockets.get(disconnectedUserId).delete(socket.id);

        if (userSockets.get(disconnectedUserId).size === 0) {
          userSockets.delete(disconnectedUserId);
          onlineUsers.delete(disconnectedUserId);
        } else {
          const remainingSockets = userSockets.get(disconnectedUserId);
          const newPrimarySocket = remainingSockets.values().next().value;
          onlineUsers.set(disconnectedUserId, newPrimarySocket);
        }
      }

      console.log(`[SOCKET] User ${disconnectedUserId} cleanup completed`);
    }

    console.log(
      `[SOCKET] Online users after disconnect: [${Array.from(
        onlineUsers.keys()
      ).join(", ")}]`
    );
  });

  socket.on("error", (error) => {
    console.error(`[SOCKET] Socket error for ${socket.id}:`, error);
  });

  socket.on("connect_error", (error) => {
    console.error(`[SOCKET] Connection error for ${socket.id}:`, error);
  });
};
