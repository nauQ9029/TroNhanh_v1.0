import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// get all conversations for owner
export const getOwnerConversations = (ownerId) =>
  API.get(`/chats/owner/${ownerId}`);

// get all messages of a conversation
export const getMessagesByConversationId = (conversationId) =>
  API.get(`/messages/${conversationId}`);

// send a message
export const sendMessage = (data) => API.post(`/messages`, data);
