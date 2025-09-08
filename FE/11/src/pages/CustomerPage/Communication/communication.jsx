import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../contexts/SocketContext";
import useUser from "../../../contexts/UserContext";
import { getUserChatById } from "../../../services/userService";
import "./communication.css";

const { Search } = Input;

const Communication = () => {
  const { id: initialUserId } = useParams();
  const { user } = useUser();
  const socket = useSocket();

  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        console.log("📥 Fetching chats for user:", user._id);
        const res = await axios.get(`http://localhost:5000/api/chats/user/${user._id}`);
        console.log("✅ Chats fetched:", res.data);

        const chatsWithUser = await Promise.all(
          res.data.map(async (chat) => {
            const user1Id = chat.user1Id?.toString?.() || chat.user1Id;
            const user2Id = chat.user2Id?.toString?.() || chat.user2Id;
            const otherUserId = user1Id === user._id ? user2Id : user1Id;
            console.log("🔍 user1Id:", user1Id, "user2Id:", user2Id, "loggedInUser:", user._id);

            console.log("🔍 Fetching other user info:", otherUserId);

            const userInfo = await getUserChatById(otherUserId);
            console.log("👤 Other user info:", userInfo);

            return {
              ...chat,
              otherUser: userInfo,
              lastMessage: chat.lastMessage || "No messages yet",
            };
          })
        );

        setChatList(chatsWithUser);
      } catch (err) {
        console.error("❌ Error loading chats", err);
      }
    };

    if (user) fetchChats();
  }, [user]);


  const loadChat = async (otherUser) => {
    try {
      console.log("🗨️ Loading chat with user:", otherUser);

      const res = await axios.post("http://localhost:5000/api/chats/get-or-create", {
        user1Id: user._id,
        user2Id: otherUser.userId,
      });

      const chat = res.data;
      console.log("💬 Chat room info:", chat);
      setChatId(chat._id);
      setSelectedUser(otherUser);

      if (socket) {
        console.log("🔌 Joining socket room:", chat._id);
        socket.emit("joinRoom", chat._id);
      }

      const msgRes = await axios.get(`http://localhost:5000/api/chats/${chat._id}/messages`);
      console.log("📨 Messages loaded:", msgRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error("❌ Error loading chat", err);
    }
  };


  useEffect(() => {
    if (initialUserId && chatList.length > 0) {
      const found = chatList.find(
        (c) => c.user1Id === initialUserId || c.user2Id === initialUserId
      );
      console.log("🔍 Auto-loading chat for route param userId:", initialUserId);
      if (found) {
        console.log("✅ Found chat to auto-load:", found);
        loadChat(found.otherUser);
      } else {
        console.warn("⚠️ No matching chat found for:", initialUserId);
      }
    }
  }, [chatList, initialUserId]);


  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (message) => {
      console.log("📥 Incoming socket message:", message);
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleIncoming);
    return () => socket.off("newMessage", handleIncoming);
  }, [socket, chatId]);


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      chatId,
      senderId: user._id,
      content: newMessage,
    };

    await axios.post("http://localhost:5000/api/chats/send", message);
    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, { ...message, senderId: user._id }]);
    setNewMessage("");
  };

  const filteredChats = chatList.filter((chat) =>
    chat.otherUser?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="comm-container">
      {/* Sidebar */}
      <div className="comm-sidebar">
        <div style={{ padding: "10px" }}>
          <Search
            placeholder="Search user..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${selectedUser?._id === chat.otherUser._id ? "selected" : ""}`}
              onClick={() => loadChat(chat.otherUser)}
            >
              <div className="chat-avatar">
                <img
                  src={chat.otherUser?.avatar || "/default-avatar.png"}
                  alt="avatar"
                />
              </div>
              <div className="chat-info">
                <div className="chat-top">
                  <div className="chat-name">{chat.otherUser.name}</div>
                </div>
                <div className="chat-preview">
                  {chat.lastMessage?.content || "No messages"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="comm-chat">
        {selectedUser ? (
          <>
            <div className="chat-header">Chat with {selectedUser.name}</div>
            <div className="chat-body">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${(msg.senderId._id || msg.senderId) === user._id ? "me" : "other"
                    }`}
                >
                  {msg.content}
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>📩</button>
            </div>
          </>
        ) : (
          <div className="chat-header">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Communication;
