import axiosInstance from './axiosInstance';

export const getNotifications = () =>
  axiosInstance.get('/notifications');

export const markAsRead = (id) =>
  axiosInstance.put(`/notifications/${id}/read`);

export const markAllRead = () =>
  axiosInstance.put('/notifications/read-all');

export const deleteNotification = (id) =>
  axiosInstance.delete(`/notifications/${id}`);
