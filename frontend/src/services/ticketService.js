import api from './api';

// Get list of tickets
export const getTickets = async (params) => {
  const res = await api.get('/tickets', { params });
  return res.data;
};

// Get single ticket by ID
export const getTicketById = async (id) => {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
};

// Create new ticket (idempotent)
export const createTicket = async (data) => {
  const res = await api.post('/tickets', data, { headers: { 'Idempotency-Key': Date.now() } });
  return res.data;
};

// Update ticket (PATCH)
export const updateTicket = async (id, data) => {
  const res = await api.patch(`/tickets/${id}`, data, { headers: { 'If-Match': data.version || 1 } });
  return res.data;
};

// **Add missing postComment export**
export const postComment = async (ticketId, data) => {
  const res = await api.post(`/tickets/${ticketId}/comments`, data);
  return res.data;
};
