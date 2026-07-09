import axiosInstance from './axiosInstance';

/**
 * Log in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export async function login(email, password, recaptchaToken) {
  const { data } = await axiosInstance.post('/auth/login', { email, password, recaptchaToken });
  return data;
}

export async function loginWithGoogle(token) {
  const { data } = await axiosInstance.post('/auth/google', { token });
  return data;
}

export async function loginWithMicrosoft(token) {
  const { data } = await axiosInstance.post('/auth/microsoft', { token });
  return data;
}

export async function loginWithLinkedIn(code) {
  const { data } = await axiosInstance.post('/auth/linkedin', { 
    code,
    redirectUri: window.location.origin + '/linkedin'
  });
  return data;
}

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, role?: string }} userData
 * @returns {Promise<{token: string, user: object}>}
 */
export async function register(userData) {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data;
}

/**
 * Log out the current user.
 * @returns {Promise<void>}
 */
export async function logout() {
  await axiosInstance.post('/auth/logout');
}

/**
 * Get the currently authenticated user's profile.
 * @returns {Promise<object>}
 */
export async function getCurrentUser() {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
}

/**
 * Request a password reset email.
 * @param {string} email
 * @returns {Promise<{message: string}>}
 */
export async function forgotPassword(email) {
  const { data } = await axiosInstance.post('/auth/forgot-password', { email });
  return data;
}
