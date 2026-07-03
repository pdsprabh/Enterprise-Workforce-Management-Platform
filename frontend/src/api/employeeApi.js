import axiosInstance from './axiosInstance';

export async function getEmployees(params = {}) {
  const { data } = await axiosInstance.get('/employees', { params });
  return data;
}

export async function getEmployeeById(id) {
  const { data } = await axiosInstance.get(`/employees/${id}`);
  return data;
}

export async function createEmployee(employeeData) {
  const { data } = await axiosInstance.post('/employees', employeeData);
  return data;
}

export async function updateEmployee(id, employeeData) {
  const { data } = await axiosInstance.put(`/employees/${id}`, employeeData);
  return data;
}

export async function deleteEmployee(id) {
  const { data } = await axiosInstance.delete(`/employees/${id}`);
  return data;
}
