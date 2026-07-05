import axiosInstance from './axiosInstance';

/**
 * Get payroll summary for a given month and year.
 * @param {number} month - 1–12
 * @param {number} year
 */
export function getPayrollSummary(month, year) {
  return axiosInstance.get('/payroll/summary', { params: { month, year } });
}

/**
 * Get the current user's payslip history.
 * @param {{ page?: number, limit?: number }} params
 */
export function getMyPayslips(params = {}) {
  return axiosInstance.get('/payroll/payslips/me', { params });
}

/**
 * Get a specific payslip by ID.
 * @param {string} id
 */
export function getPayslipById(id) {
  return axiosInstance.get(`/payroll/payslips/${id}`);
}

/**
 * Download a payslip PDF by ID.
 * @param {string} id
 */
export function downloadPayslip(id) {
  return axiosInstance.get(`/payroll/payslips/${id}/download`, {
    responseType: 'blob',
  });
}
