import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Input, Button, List, Typography } from "antd";
import { useSocket } from "../../../contexts/SocketContext";
import useUser from "../../../contexts/UserContext";

const { TextArea } = Input;

const Communication = () => {
  const { id: customerId } = useParams();
  const { user: owner } = useUser(); // ✅ Use logged-in owner from context
  const socket = useSocket();

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/chats/get-or-create",
          {
            userId: customerId,
            ownerId: owner._id,
          }
        );
        const chat = res.data;
        setChatId(chat._id);

        socket.emit("joinRoom", { chatId: chat._id });

        const msgRes = await axios.get(
          `http://localhost:5000/api/chats/${chat._id}/messages`
        );
        setMessages(msgRes.data);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    if (customerId && owner?._id && socket) {
      fetchChat();
    }
  }, [customerId, owner, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleIncoming);
    return () => socket.off("newMessage", handleIncoming);
  }, [socket]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      chatId,
      senderId: owner._id,
      content: newMessage,
    };

    await axios.post("http://localhost:5000/api/chats/send", message);
    socket.emit("sendMessage", message);
    setNewMessage("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>💬 Owner Chat</h2>

      <List
        bordered
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text strong>
              {item.senderId._id === owner._id
                ? "You"
                : item.senderId.name || "Customer"}
            </Typography.Text>
            : {item.content}
          </List.Item>
        )}
        style={{ marginBottom: 20, maxHeight: 300, overflowY: "auto" }}
      />

      <TextArea
        rows={2}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />

      <Button
        type="primary"
        onClick={sendMessage}
        style={{ marginTop: 10, width: "100%" }}
      >
        Send
      </Button>
    </div>
  );
};

export default Communication;