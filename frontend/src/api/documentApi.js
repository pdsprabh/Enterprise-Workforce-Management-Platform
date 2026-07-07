import axiosInstance from './axiosInstance';

// Super Admin: all documents (with optional filters)
export const getAllDocuments = (params) =>
  axiosInstance.get('/documents', { params });

// Regular user: own documents
export const getMyDocuments = () =>
  axiosInstance.get('/documents/me');

// Super Admin: document stats
export const getDocumentStats = () =>
  axiosInstance.get('/documents/stats');

// Upload a new document (multipart/form-data)
export const uploadDocument = (formData) =>
  axiosInstance.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Super Admin: update document metadata (and optionally replace file)
export const updateDocument = (id, formData) =>
  axiosInstance.put(`/documents/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Super Admin: delete a document
export const deleteDocument = (id) =>
  axiosInstance.delete(`/documents/${id}`);
