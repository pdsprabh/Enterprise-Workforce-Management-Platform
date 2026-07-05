import axiosInstance from './axiosInstance';

/**
 * Get all job postings.
 * @param {{ department?: string, status?: string, page?: number, limit?: number }} params
 */
export function getJobPostings(params = {}) {
  return axiosInstance.get('/recruitment/jobs', { params });
}

/**
 * Get a single job posting by ID.
 * @param {string} id
 */
export function getJobById(id) {
  return axiosInstance.get(`/recruitment/jobs/${id}`);
}

/**
 * Get candidates for a specific job posting.
 * @param {string} jobId
 */
export function getCandidates(jobId) {
  return axiosInstance.get(`/recruitment/jobs/${jobId}/candidates`);
}

/**
 * Update a candidate's pipeline stage/status.
 * @param {string} candidateId
 * @param {string} status - e.g., 'screening', 'interview', 'offer', 'hired', 'rejected'
 */
export function updateCandidateStatus(candidateId, status) {
  return axiosInstance.put(`/recruitment/candidates/${candidateId}`, { status });
}
