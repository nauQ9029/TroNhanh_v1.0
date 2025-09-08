import { useEffect, useState, useRef } from "react";
import { Input, Button, List, Typography } from "antd";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";

const { TextArea } = Input;

const ChatBox = ({ accommodationId, ownerId, user, accommodation, onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef();
  const socket = useSocket();

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${accommodationId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages failed", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    
    try {
      console.log(" >>>[SEND DEBUG]", {
        senderId: user._id,
        receiverId: ownerId,
        accommodationId: accommodationId,
        text: text,
      });

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/send`, {
        receiverId: ownerId,
        accommodationId: accommodationId,
        text,
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Add message to local state immediately
      setMessages((prev) => [...prev, res.data]);
      
      // Emit socket event with proper data structure
      socket?.emit("send-message", {
        senderId: user._id,
        receiverId: ownerId,
        payload: res.data, // the message object
      });
      
      setText("");
      
      // Call onNewMessage callback if provided
      if (onNewMessage) onNewMessage();
      
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  useEffect(() => {
    fetchMessages(); // initial fetch
  }, [accommodationId]); // Refetch when accommodationId changes

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      // Extract message from the data structure
      const msg = data.payload || data;
      
      console.log("ChatBox received message:", msg); // Debug log
      
      // Check if message belongs to this accommodation
      if (msg.accommodationId === accommodationId) {
        setMessages((prev) => {
          // Avoid duplicates - check if message already exists
          const messageExists = prev.some(existingMsg => 
            existingMsg._id === msg._id || 
            (existingMsg.text === msg.text && 
             existingMsg.senderId === msg.senderId && 
             Math.abs(new Date(existingMsg.createdAt) - new Date(msg.createdAt)) < 1000)
          );
          
          if (!messageExists) {
            return [...prev, msg];
          }
          return prev;
        });
        
        // Call onNewMessage callback
        if (onNewMessage) onNewMessage();
      }
    };

    socket.on("message-receive", handleNewMessage);

    return () => {
      socket.off("message-receive", handleNewMessage);
    };
  }, [socket, accommodationId, onNewMessage]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 10 }}>
        <List
          size="small"
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item key={msg._id || `${msg.text}-${msg.createdAt}`}>
              <div style={{
                width: '100%',
                textAlign: msg.senderId === user._id || msg.senderId?._id === user._id ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  background: msg.senderId === user._id || msg.senderId?._id === user._id 
                    ? '#d1e7dd' : '#f8d7da',
                  padding: '6px 12px',
                  borderRadius: 8,
                  maxWidth: '70%'
                }}>
                  <Typography.Text strong>
                    {msg.senderId === user._id || msg.senderId?._id === user._id ? "You" : "Owner"}:
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
        disabled={!text.trim()}
      >
        Send
      </Button>
    </>
  );
};

export default ChatBox;