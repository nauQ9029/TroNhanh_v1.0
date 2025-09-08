import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useUser from "./UserContext";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceive = (data) => {
      console.log(">>> [SOCKET] message-receive received:", data);
      // Update context or state
    };

    socket.on("message-receive", handleMessageReceive);

    return () => {
      socket.off("message-receive", handleMessageReceive);
    };
  }, [socket]);

  useEffect(() => {
    if (user) {
      console.log(
        " >>>[SOCKET] Attempting connection to:",
        process.env.SOCKET_API
      );
      console.log(" >>>[SOCKET] User object:", user);
      console.log(
        " >>>[SOCKET] Creating socket connection for user:",
        user._id
      );

      // Updated socket configuration
      const newSocket = io(process.env.SOCKET_API || "http://localhost:5000", {
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: false,
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        maxReconnectionAttempts: 5,
      });

      // Connection event handlers
      newSocket.on("connect", () => {
        // console.log(" >>>[SOCKET] Connected with ID:", newSocket.id);
        console.log(`[SOCKET] Connected: ${newSocket.id}`);

        setIsConnected(true);
        setConnectionAttempts(0);

        // Wait for connection to stabilize, then add user
        setTimeout(() => {
          newSocket.emit("add-user", user._id);
          console.log(" >>>[SOCKET] Emitted add-user event for:", user._id);
        }, 500);
      });

      newSocket.on("disconnect", (reason) => {
        console.log(" >>>[SOCKET] Disconnected:", reason);
        setIsConnected(false);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log(
          " >>>[SOCKET] Reconnected after",
          attemptNumber,
          "attempts"
        );
        setConnectionAttempts(0);
        // Re-add user after reconnection
        newSocket.emit("add-user", user._id);
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log(" >>>[SOCKET] Reconnection attempt:", attemptNumber);
        setConnectionAttempts(attemptNumber);
      });

      newSocket.on("connect_error", (error) => {
        console.error(" >>>[SOCKET] Connection error:", error);
        setIsConnected(false);
      });

      // Test event to verify socket is working
      newSocket.on("user-added", (data) => {
        console.log(" >>>[SOCKET] User added confirmation:", data);
      });

      // Add ping/pong for connection health check
      newSocket.on("pong", () => {
        console.log(" >>>[SOCKET] Pong received");
      });

      setSocket(newSocket);

      // Periodic ping to keep connection alive
      const pingInterval = setInterval(() => {
        if (newSocket.connected) {
          newSocket.emit("ping");
        }
      }, 25000);

      return () => {
        console.log(" >>>[SOCKET] Cleaning up socket connection");
        clearInterval(pingInterval);
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Clean up socket when user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  // Debug logging for socket state
  useEffect(() => {
    console.log(" >>>[SOCKET] Socket state changed:", {
      socket: !!socket,
      isConnected,
      userId: user?._id,
      connectionAttempts,
    });
  }, [socket, isConnected, user, connectionAttempts]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
      {/* Enhanced debug indicator */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            background: isConnected
              ? "green"
              : connectionAttempts > 0
              ? "orange"
              : "red",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 9999,
          }}
        >
          Socket:{" "}
          {isConnected
            ? "Connected"
            : connectionAttempts > 0
            ? `Reconnecting (${connectionAttempts})`
            : "Disconnected"}
        </div>
      )}
    </SocketContext.Provider>
  );
};
