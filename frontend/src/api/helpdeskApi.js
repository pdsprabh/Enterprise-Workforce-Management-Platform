import axiosInstance from './axiosInstance';

export const getMyTickets = (params) =>
  axiosInstance.get('/helpdesk/me', { params });

export const getAllTickets = (params) =>
  axiosInstance.get('/helpdesk', { params });

export const getTicketById = (id) =>
  axiosInstance.get(`/helpdesk/${id}`);

export const createTicket = (data) =>
  axiosInstance.post('/helpdesk', data);

export const updateTicket = (id, data) =>
  axiosInstance.put(`/helpdesk/${id}`, data);

export const closeTicket = (id) =>
  axiosInstance.put(`/helpdesk/${id}/close`);
