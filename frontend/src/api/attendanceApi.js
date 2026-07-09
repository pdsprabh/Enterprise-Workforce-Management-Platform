import axiosInstance from './axiosInstance';

/**
 * Clock in for the current user.
 * @param {string} notes - Optional notes for clock-in
 */
export function clockIn(notes = '') {
  return axiosInstance.post('/attendance/clock-in', { notes });
}

/**
 * Clock out for the current user.
 * @param {string} notes - Optional notes for clock-out
 */
export function clockOut(notes = '') {
  return axiosInstance.post('/attendance/clock-out', { notes });
}

/**
 * Get the current user's attendance records.
 * @param {{ month?: number, year?: number, page?: number, limit?: number }} params
 */
export function getMyAttendance(params = {}) {
  return axiosInstance.get('/attendance/me', { params });
}

/**
 * Get attendance records for a specific employee (HR/Manager).
 * @param {string} employeeId
 * @param {{ month?: number, year?: number }} params
 */
export function getAttendanceByEmployee(employeeId, params = {}) {
  return axiosInstance.get(`/attendance/${employeeId}`, { params });
}

/**
 * Get monthly attendance summary for the current user.
 * @param {number} month - 1–12
 * @param {number} year
 */
export function getAttendanceSummary(month, year) {
  return axiosInstance.get('/attendance/summary', { params: { month, year } });
}
