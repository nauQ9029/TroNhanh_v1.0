import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useUser from "./UserContext";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        transports: ["websocket"],
      });

      console.log(" >>>[INFO] Connecting socket for user:", user._id);

      newSocket.emit("add-user", user._id);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        newSocket.emit("add-user", user._id);
      });

      return () => {
        newSocket.disconnect();
        console.log(" >>>[INFO] Socket disconnected");
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
