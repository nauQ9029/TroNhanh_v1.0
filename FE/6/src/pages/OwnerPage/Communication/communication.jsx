// File: src/pages/OwnerPage/Communication/communication.jsx
import React, { useState } from "react";
import "./communication.css";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { useRef, useEffect } from 'react'; 
import avatarImg from "../../../assets/images/room0.png";


const blacklistedWords = ["đm", "cc", "ngu", "địt","vcl", "lồn", "địt mẹ", "vãi lồn"]; 
const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES_PER_DAY = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const dummyConversations = [
  { id: 1, name: "Nguyễn Văn A", lastMessage: "Bạn ơi, phòng đó còn không?", time: "15 phút trước" },
  { id: 2, name: "Lê Thị B", lastMessage: "Cảm ơn bạn nhiều nha!", time: "12:36" },
  { id: 3, name: "Nguyễn Văn C", lastMessage: "Tôi đã chuyển tiền rồi nha bạn", time: "11:18" },
  { id: 4, name: "Pham Quang Duy", lastMessage: "Ok bạn, mai mình ghé xem phòng", time: "09:03" },
  { id: 5, name: "Zalo Pay", lastMessage: "Mã xác thực của bạn là 839274", time: "Hôm qua" },
  { id: 6, name: "Phòng Trọ Bình Dân", lastMessage: "Phòng A còn, bạn ghé giờ nào?", time: "2 ngày trước" },
  { id: 7, name: "CloudOTP", lastMessage: "783492 là mã xác thực của bạn", time: "3 ngày trước" },
  { id: 8, name: "Bùi Minh Tâm", lastMessage: "Mình không đi xem được hôm nay", time: "4 ngày trước" },
  { id: 9, name: "Nguyễn Hữu Nghĩa", lastMessage: "Có wifi free không bạn?", time: "Tuần trước" },
  { id: 10, name: "Messenger", lastMessage: "Tài khoản của bạn đã được xác minh", time: "2 tuần trước" },
  { id: 11, name: "Trần Thị Mai", lastMessage: "Phòng trọ có máy lạnh không?", time: "1 tháng trước" },
  { id: 12, name: "Nguyễn Văn H", lastMessage: "Cho tôi hỏi giá phòng trọ A", time: "1 tháng trước" },
];


const Communication = () => {
  const [selectedChat, setSelectedChat] = useState(dummyConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
  { from: "other", text: "Bạn ơi, mình xin hỏi giá phòng trọ", time: "09:01" },
  { from: "other", text: "Phòng trọ A mấy 1 tháng ?", time: "09:02" },
  { from: "me", text: "bạn đợi tí", time: "09:03" },
  { from: "me", text: "phòng trọ A 1 tháng 3 triệu a 🧃", time: "09:04" },
]);


  const [dailySentCount, setDailySentCount] = useState(0);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  
 // Autosave draft every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      if (messageInput) {
        setDraft(messageInput);
        console.log("Draft autosaved:", messageInput);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [messageInput]);

  // Restore draft on mount
  useEffect(() => {
    if (draft) {
      setMessageInput(draft);
    }
  }, [draft]);

  const containsBlacklistedWord = (text) =>
    blacklistedWords.some(word => text.toLowerCase().includes(word));

  const handleSend = () => {
    if (!messageInput.trim()) {
      alert("Message cannot be empty.");
      return;
    }
    if (messageInput.length > MAX_MESSAGE_LENGTH) {
      alert("Message cannot exceed 500 characters.");
      return;
    }
    if (containsBlacklistedWord(messageInput)) {
      alert("Không có chửi tục nha má! Block chừ!");
      return;
    }
    if (dailySentCount >= MAX_MESSAGES_PER_DAY) {
      alert("You've reached the daily message limit (10).");
      return;
    }

    const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMessage = {
    from: "me",
    text: messageInput,
    time: formattedTime,
  };

    // Nếu có file đính kèm
    if (attachment) {
      newMessage.attachment = attachment.name;
    }

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setAttachment(null);
    setDailySentCount(prev => prev + 1);

    alert("Message sent successfully!");
  };

  const handleAttach = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedFileTypes.includes(file.type)) {
      alert("Only PDF, JPG, PNG files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("File must be ≤ 5MB.");
      return;
    }

    setAttachment(file);
  };

  const handleCancel = () => {
    if (messageInput) {
      const confirmCancel = window.confirm("You have unsaved changes. Discard?");
      if (confirmCancel) {
        setMessageInput("");
        setAttachment(null);
      }
    }
  };

  return (
    <div className="comm-container">
      <div className="comm-sidebar">
        <div className="chat-list">
          {dummyConversations.map((conv) => (
            <div
              key={conv.id}
              className={`chat-item ${selectedChat?.id === conv.id ? "selected" : ""}`}
              onClick={() => setSelectedChat(conv)}
            >
              <div className="chat-avatar">
                <img src={avatarImg} alt="avatar" />
              </div>
              <div className="chat-info">
                <div className="chat-top">
                  <span className="chat-name">{conv.name}</span>
                  <span className="chat-time">{conv.time}</span>
                </div>
                <p className="chat-preview">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="comm-chat">
        <div className="chat-header">
          <strong>{selectedChat.name}</strong>
        </div>

        <div className="chat-body">
  {messages.map((msg, i) => (
    <div key={i} className={`message ${msg.from}`}>
      <div className="message-text">{msg.text}</div>
      {msg.attachment && (
        <div className="message-attachment">📎 {msg.attachment}</div>
      )}
      <div className="message-time">{msg.time}</div>
    </div>
  ))}
</div>


        <div className="chat-input">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="nhập text ở đây để chat"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAttach}
          />
          <button
            className="attach-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FiPaperclip />
          </button>
          <button onClick={handleSend}><FiSend /></button>
          <button onClick={handleCancel} style={{ color: "#999", marginLeft: 8 }}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default Communication;