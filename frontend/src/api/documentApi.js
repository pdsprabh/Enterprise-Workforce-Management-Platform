import axiosInstance from './axiosInstance';

export const getDocuments = (params) =>
  axiosInstance.get('/documents', { params });

export const uploadDocument = (formData) =>
  axiosInstance.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const downloadDocument = (id) =>
  axiosInstance.get(`/documents/${id}/download`, { responseType: 'blob' });

export const deleteDocument = (id) =>
  axiosInstance.delete(`/documents/${id}`);
