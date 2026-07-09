import axiosInstance from './axiosInstance';

/**
 * Get the current user's performance reviews.
 */
export function getMyReviews() {
  return axiosInstance.get('/performance/reviews/me');
}

/**
 * Get the current user's goals.
 */
export function getMyGoals() {
  return axiosInstance.get('/performance/goals/me');
}

/**
 * Update a goal's progress percentage.
 * @param {string} goalId
 * @param {number} progress - 0–100
 */
export function updateGoalProgress(goalId, progress) {
  return axiosInstance.put(`/performance/goals/${goalId}`, { progress });
}

/**
 * Get all review cycles.
 */
export function getReviewCycles() {
  return axiosInstance.get('/performance/cycles');
}
