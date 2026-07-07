import axiosInstance from './axiosInstance';

export const getAnnouncements = () =>
  axiosInstance.get('/announcements');

export const createAnnouncement = (data) =>
  axiosInstance.post('/announcements', data);

export const deleteAnnouncement = (id) =>
  axiosInstance.delete(`/announcements/${id}`);
