import { useEffect, useState, useRef } from "react";
import {
  List,
  Avatar,
  Typography,
  Input,
  Button,
  Spin,
  notification,
  Badge,
  Card,
} from "antd";
import axios from "axios";
import { UserOutlined, SendOutlined, MessageOutlined } from "@ant-design/icons";
import { useSocket } from "../../../contexts/SocketContext";
import useUser from "../../../contexts/UserContext";

const { Text } = Typography;
const { TextArea } = Input;

const OwnerInbox = () => {
  const { user } = useUser();
  const { socket, isConnected } = useSocket() || {};

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const selectedConversationRef = useRef(selectedConversation);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // total unread messages across all conversations
  const unreadTotal = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  // fetch all conversations for owner
  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/conversations`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  // fetch messages when a conversation is selected
  const fetchMessages = async (conversationKey) => {
    try {
      setLoading(true);
      setChatModalOpen(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/conversation/${conversationKey}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessages(res.data);
      // Mark as read after fetching
      await markConversationAsRead(conversationKey);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark conversation as read
  const markConversationAsRead = async (conversationKey) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === conversationKey ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  // send reply message
  const sendReply = async () => {
    if (!reply.trim()) return;

    const payload = {
      receiverId: selectedConversation.customer._id,
      accommodationId: selectedConversation.accommodation._id,
      text: reply,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/messages/send`,
        payload,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // append sent message to the current message list
      setMessages((prev) => [...prev, res.data]);

      // real-time push
      socket?.emit("send-message", {
        senderId: user._id,
        receiverId: selectedConversation.customer._id,
        payload: res.data,
      });

      // reset reply input
      setReply("");

      // update conversations to reflect the new message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selectedConversation._id
            ? {
                ...conv,
                lastMessage: reply,
                lastUpdated: new Date().toISOString(),
              }
            : conv
        )
      );
    } catch (err) {
      console.error("Failed to send reply", err);
    }
  };

  const openModal = async (conversation) => {
    setSelectedConversation(conversation);
    setChatModalOpen(true);
    await fetchMessages(conversation._id);
  };

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // listen for incoming messages via socket
  useEffect(() => {
    if (!socket || !socket.id || !isConnected) return;

    const handleIncoming = (data) => {
      const msg = data.payload || data;
      console.log("[HANDLE-INCOMING] Received:", msg);

      console.log("[OWNER-INBOX] Received message:", {
        messageId: msg._id,
        senderId: msg.senderId,
        accommodationId: msg.accommodationId,
        text: msg.text,
        currentConversation: selectedConversation?._id,
      });

      // Check if this message is for the currently selected conversation
      const currentConv = selectedConversationRef.current;

      const isCurrentConv =
        currentConv &&
        currentConv.accommodation._id === msg.accommodationId &&
        currentConv.customer._id === msg.senderId;

      if (isCurrentConv) {
        // add message to current conversation only if not duplicate
        console.log(" >>>[HANDLE-INCOMING] New message received:", msg);
        setMessages((prevMessages) => {
          const exists = prevMessages.some(
            (existing) =>
              existing._id === msg._id ||
              (existing.text === msg.text &&
                Math.abs(
                  new Date(existing.createdAt) - new Date(msg.createdAt)
                ) < 1000)
          );
          console.log(" >>>[INFO] Message exists already?", exists);

          if (!exists) {
            console.log(
              " >>>[OWNER-INBOX] Adding message to current conversation"
            );
            console.log(" >>>[INFO] Updating messages");
            return [...prevMessages, msg];
          }
          return prevMessages;
        });
      } else {
        // show browser notification for other conversations
        notification.open({
          message: "New Message Received",
          description: `${msg.text}`,
          icon: <MessageOutlined style={{ color: "#108ee9" }} />,
        });

        // Play notification sound
        try {
          new Audio("/assets/noti1.wav")
            .play()
            .catch((e) => console.log("Could not play notification sound:", e));
        } catch (e) {
          console.log("Audio file not found");
        }
      }

      // Always update conversations list for new messages
      setConversations((prevConversations) => {
        const updated = prevConversations.map((conv) => {
          const isThisConv =
            conv.accommodation._id === msg.accommodationId &&
            conv.customer._id === msg.senderId;

          if (isThisConv) {
            return {
              ...conv,
              lastMessage: msg.text,
              lastUpdated: msg.createdAt || new Date().toISOString(),
              unreadCount: isCurrentConv ? 0 : (conv.unreadCount || 0) + 1,
            };
          }
          return conv;
        });

        // Sort by last updated
        return updated.sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
      });
    };

    socket.on("message-receive", handleIncoming);
    return () => {
      socket.off("message-receive", handleIncoming);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    if (user && user.role === "owner") {
      fetchConversations();
    }
  }, [user]);

  if (loading && conversations.length === 0)
    return <Spin tip="Loading inbox..." />;

  return (
    <>
      <Typography.Title level={3}>
        Inbox {unreadTotal > 0 && <Badge count={unreadTotal} />}
      </Typography.Title>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Left - Conversations list */}
        <Card title="Conversations" style={{ width: 300 }}>
          {conversations.length === 0 ? (
            <Text type="secondary">No conversations yet.</Text>
          ) : (
            <List
              dataSource={conversations}
              renderItem={(conv) => (
                <List.Item
                  onClick={() => openModal(conv)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedConversation?._id === conv._id
                        ? "#f0f0f0"
                        : "white",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={conv.unreadCount || 0}
                        size="small"
                        offset={[5, 0]}
                      >
                        <Avatar icon={<MessageOutlined />} />
                      </Badge>
                    }
                    title={<Text strong>{conv.customer.name}</Text>}
                    description={
                      <>
                        <Text>Accommodation: {conv.accommodation.title}</Text>
                        <br />
                        <Text type="secondary">{conv.lastMessage}</Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        {/* Right - Chat box */}
        <Card
          title={
            selectedConversation
              ? `Chat with ${selectedConversation.customer.name}`
              : "Select a conversation"
          }
          style={{ flex: 1 }}
        >
          {selectedConversation ? (
            <>
              <div
                style={{
                  height: 300,
                  overflowY: "auto",
                  marginBottom: 16,
                  border: "1px solid #ccc",
                  padding: 12,
                  borderRadius: 4,
                }}
              >
                {loading ? (
                  <Spin />
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={msg._id || `msg-${i}-${msg.createdAt}`}
                      style={{
                        textAlign:
                          msg.senderId === user._id ||
                          msg.senderId?._id === user._id
                            ? "right"
                            : "left",
                        margin: "4px 0",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          background:
                            msg.senderId === user._id ||
                            msg.senderId?._id === user._id
                              ? "#d1e7dd"
                              : "#f8d7da",
                          padding: "6px 12px",
                          borderRadius: 8,
                          maxWidth: "70%",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <TextArea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply..."
                onPressEnter={(e) => {
                  e.preventDefault();
                  sendReply();
                }}
              />
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={sendReply}
                  disabled={!reply.trim()}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <Text type="secondary">
              Select a conversation to view messages.
            </Text>
          )}
        </Card>
      </div>
    </>
  );
};

export default OwnerInbox;
