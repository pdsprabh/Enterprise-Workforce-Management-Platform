import axiosInstance from './axiosInstance';

/**
 * Apply for a leave.
 * @param {{ type, startDate, endDate, reason }} leaveData
 */
export function applyLeave(leaveData) {
  return axiosInstance.post('/leave/request', leaveData);
}

/**
 * Get the current user's leave requests.
 * @param {{ status?: string, page?: number, limit?: number }} params
 */
export function getMyLeaves(params = {}) {
  return axiosInstance.get('/leave/me', { params });
}

/**
 * Get the current user's leave balance.
 */
export function getLeaveBalance() {
  return axiosInstance.get('/leave/balance');
}

/**
 * Get all leave requests (HR/Manager only).
 * @param {{ status?: string, department?: string, page?: number, limit?: number }} params
 */
export function getAllLeaveRequests(params = {}) {
  return axiosInstance.get('/leave', { params });
}

/**
 * Approve a leave request.
 * @param {string} id
 */
export function approveLeave(id) {
  return axiosInstance.put(`/leave/${id}/approve`);
}

/**
 * Reject a leave request.
 * @param {string} id
 * @param {string} reason
 */
export function rejectLeave(id, reason) {
  return axiosInstance.put(`/leave/${id}/reject`, { reason });
}

/**
 * Cancel a leave request.
 * @param {string} id
 */
export function cancelLeave(id) {
  return axiosInstance.put(`/leave/${id}/cancel`);
}
