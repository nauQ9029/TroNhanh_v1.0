import { useEffect, useState, useRef } from "react";
import { Input, Button, List, Typography, Alert } from "antd";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";

const { TextArea } = Input;

const ChatBox = ({
  accommodationId,
  ownerId,
  user,
  accommodation,
  onNewMessage,
}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const messagesEndRef = useRef();
  const [socket, isConnected] = useSocket();

  const addDebugInfo = (info) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => `${timestamp}: ${info}\n${prev}`.slice(0, 1000));
  };

  const fetchMessages = async () => {
    try {
      addDebugInfo(`Fetching messages for accommodation: ${accommodationId}`);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/${accommodationId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessages(res.data);
      addDebugInfo(`Loaded ${res.data.length} messages`);
    } catch (err) {
      console.error("Fetch messages failed", err);
      addDebugInfo(`Error fetching messages: ${err.message}`);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    // FIX 1: Ensure receiverId is always a string, not an object
    const receiverId = typeof ownerId === "object" ? ownerId._id : ownerId;

    const messageData = {
      receiverId: receiverId, // Always send as string
      accommodationId: accommodationId,
      text: text.trim(),
    };

    try {
      addDebugInfo(`Sending message: "${text.trim()}" to ${receiverId}`);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/messages/send`,
        messageData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      addDebugInfo(`Message sent successfully with ID: ${res.data._id}`);

      // FIX 2: Normalize the message object before adding to state
      const normalizedMessage = {
        ...res.data,
        senderId: res.data.senderId || user._id,
        receiverId: receiverId,
        accommodationId: accommodationId,
        createdAt: res.data.createdAt || new Date().toISOString(),
      };

      // Add message to local state immediately
      setMessages((prev) => {
        const newMessages = [...prev, normalizedMessage];
        addDebugInfo(
          `Added message to local state. Total: ${newMessages.length}`
        );
        return newMessages;
      });

      // FIX 3: Emit socket event with correct structure
      if (socket) {
        const socketData = {
          senderId: user._id,
          receiverId: receiverId, // Use normalized receiverId
          payload: normalizedMessage, // Use normalized message
        };

        socket.emit("send-message", socketData);
        addDebugInfo(`Emitted socket event with receiverId: ${receiverId}`);
      } else {
        addDebugInfo(`Socket not available for real-time messaging`);
      }

      setText("");

      // Call onNewMessage callback if provided
      if (onNewMessage) {
        onNewMessage();
        addDebugInfo(`Called onNewMessage callback`);
      }
    } catch (err) {
      console.error("Send message failed", err);
      addDebugInfo(`Error sending message: ${err.message}`);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (accommodationId) {
      fetchMessages();
    }
  }, [accommodationId]);

  // Socket message listener
  useEffect(() => {
    if (!socket || !isConnected) {
      addDebugInfo("Socket not available for listening");
      return;
    }

    addDebugInfo("Setting up socket listener for message-receive");

    const handleNewMessage = (data) => {
      addDebugInfo(`Received socket message: ${JSON.stringify(data)}`);

      // Extract message from the data structure
      const msg = data.payload || data;

      console.log(`[CHATBOX] Received message:`, {
        messageId: msg._id,
        accommodationId: msg.accommodationId,
        currentAccommodation: accommodationId,
        sender: msg.senderId,
        text: msg.text,
      });

      // FIX 4: More robust accommodation matching
      const msgAccommodationId =
        typeof msg.accommodationId === "object"
          ? msg.accommodationId._id || msg.accommodationId.toString()
          : msg.accommodationId?.toString();

      const currentAccommodationId = accommodationId?.toString();

      // Check if message belongs to this accommodation
      if (msgAccommodationId === currentAccommodationId) {
        addDebugInfo(`Message matches current accommodation, adding to state`);

        setMessages((prevMessages) => {
          // FIX 5: Enhanced duplicate check with better ID handling
          const isDuplicate = prevMessages.some((existingMsg) => {
            // Check by ID first
            if (
              existingMsg._id &&
              msg._id &&
              existingMsg._id.toString() === msg._id.toString()
            ) {
              return true;
            }

            // Check by content and timestamp if no ID match
            if (existingMsg.text === msg.text) {
              const timeDiff = Math.abs(
                new Date(existingMsg.createdAt) -
                  new Date(msg.createdAt || new Date())
              );
              return timeDiff < 2000; // Allow 2 seconds difference
            }

            return false;
          });

          if (isDuplicate) {
            console.log(`[CHATBOX] Duplicate message detected, skipping`);
            addDebugInfo(`Duplicate message skipped`);
            return prevMessages;
          }

          console.log(`[CHATBOX] Adding new message to state`);
          addDebugInfo(`Adding new message from socket`);

          // FIX 6: Ensure message has all required fields
          const normalizedSocketMessage = {
            ...msg,
            _id: msg._id || `temp-${Date.now()}`,
            createdAt: msg.createdAt || new Date().toISOString(),
            accommodationId: msgAccommodationId,
          };

          return [...prevMessages, normalizedSocketMessage];
        });

        if (onNewMessage) {
          onNewMessage();
        }
      } else {
        addDebugInfo(
          `Message accommodation mismatch: ${msgAccommodationId} vs ${currentAccommodationId}`
        );
      }
    };

    socket.on("message-receive", handleNewMessage);

    return () => {
      addDebugInfo("Cleaning up socket listener");
      socket.off("message-receive", handleNewMessage);
    };
  }, [socket, isConnected]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // FIX 7: Helper function to get sender display name
  const getSenderName = (msg) => {
    if (msg.senderId === user._id || msg.senderId?._id === user._id) {
      return "You";
    }
    return msg.senderName || "Owner";
  };

  // FIX 8: Helper function to check if message is from current user
  const isOwnMessage = (msg) => {
    const senderId =
      typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
    return senderId === user._id;
  };

  return (
    <>
      {/* Debug panel - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <Alert
          message="Debug Info"
          description={
            <pre
              style={{ fontSize: "10px", maxHeight: "100px", overflow: "auto" }}
            >
              Socket: {socket ? "Connected" : "Not Connected"} | Messages:{" "}
              {messages.length} | Accommodation: {accommodationId} | Owner:{" "}
              {typeof ownerId === "object" ? ownerId._id : ownerId}
              {"\n" + debugInfo}
            </pre>
          }
          type="info"
          closable
          style={{ marginBottom: 10, fontSize: "12px" }}
        />
      )}

      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 10 }}>
        <List
          size="small"
          dataSource={messages}
          renderItem={(msg, index) => (
            <List.Item key={msg._id || `msg-${index}-${msg.createdAt}`}>
              <div
                style={{
                  width: "100%",
                  textAlign: isOwnMessage(msg) ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: isOwnMessage(msg) ? "#d1e7dd" : "#f8d7da",
                    padding: "6px 12px",
                    borderRadius: 8,
                    maxWidth: "70%",
                  }}
                >
                  <Typography.Text strong>
                    {getSenderName(msg)}:
                  </Typography.Text>{" "}
                  {msg.text}
                </div>
              </div>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>

      <TextArea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        onPressEnter={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      />
      <Button
        type="primary"
        block
        onClick={sendMessage}
        style={{ marginTop: 8 }}
        disabled={!text.trim() || !socket}
      >
        Send {!socket && "(Socket Disconnected)"}
      </Button>
    </>
  );
};

export default ChatBox;
