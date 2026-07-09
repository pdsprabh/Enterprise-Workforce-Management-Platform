import axiosInstance from './axiosInstance';

export const getHeadcountTrend = (year) =>
  axiosInstance.get('/analytics/headcount', { params: { year } });

export const getAttritionRate = (year) =>
  axiosInstance.get('/analytics/attrition', { params: { year } });

export const getDepartmentBreakdown = () =>
  axiosInstance.get('/analytics/departments');

export const getLeaveStats = (year) =>
  axiosInstance.get('/analytics/leave', { params: { year } });

export const getPayrollTrend = (year) =>
  axiosInstance.get('/analytics/payroll', { params: { year } });
