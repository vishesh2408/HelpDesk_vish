import api from './api';

export const addComment = async (ticketId, comment_text) => {
  const res = await api.post(`/tickets/${ticketId}/comments`, { comment_text });
  return res.data;
};

// List all comments for a ticket
export const listCommentsByTicket = async (ticketId) => {
  const res = await api.get(`/tickets/${ticketId}/comments`);
  return res.data;
};