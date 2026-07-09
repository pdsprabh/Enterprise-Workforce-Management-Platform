import axiosInstance from './axiosInstance';

export const getProjects = (params) =>
  axiosInstance.get('/projects', { params });

export const getProjectById = (id) =>
  axiosInstance.get(`/projects/${id}`);

export const createProject = (data) =>
  axiosInstance.post('/projects', data);

export const updateProject = (id, data) =>
  axiosInstance.put(`/projects/${id}`, data);

export const getMyTasks = (params) =>
  axiosInstance.get('/projects/tasks/me', { params });

export const updateTaskStatus = (taskId, status) =>
  axiosInstance.put(`/projects/tasks/${taskId}`, { status });
