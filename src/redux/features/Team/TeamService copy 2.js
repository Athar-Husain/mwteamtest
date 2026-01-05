// src/features/team/TeamService.js

import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const TEAM_URL = `${BASE_API_URL}/api/team`;

// ===============================
// Token Management Utility
// ===============================
export const TokenManager = {
  save: (token, expiresInSeconds) => {
    const expiryTime = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', expiryTime.toString());
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
  },
  getToken: () => localStorage.getItem('access_token'),
  isValid: () => {
    const expiry = localStorage.getItem('token_expiry');
    return expiry && Date.now() < parseInt(expiry, 10);
  }
};

// ===============================
// Axios Interceptor
// ===============================
const axiosInstance = axios.create({
  baseURL: TEAM_URL // Ensure axios is using your team's base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token && TokenManager.isValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Service to handle all API interactions for Team management.
 * This object centralizes the logic for making requests,
 * keeping the Redux thunks clean and focused on state management.
 */
const TeamService = {
  /**
   * Registers a new team member.
   * @param {Object} data - The user data to register.
   * @returns {Promise<Object>} The registered team member object.
   */
  register: (data) => axiosInstance.post('/register', data).then((res) => res.data),

  /**
   * Logs in a team member and stores the token.
   * @param {Object} data - The login credentials (e.g., email, password).
   * @returns {Promise<Object>} The response data containing the login result.
   */
  TeamLogin: async (data) => {
    try {
      const response = await axiosInstance.post('/login', data); // Ensure you're using the right URL endpoint
      const { token, expiresIn } = response.data;

      if (token && expiresIn) {
        TokenManager.save(token, expiresIn); // Save the token and expiration time
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  getTeamLoginStatus: () => axiosInstance.get('/getTeamLoginStatus').then((res) => res.data),

  getTeam: () => axiosInstance.get('/getprofile').then((res) => res.data.admin),

  /**
   * Fetches all team members.
   * @returns {Promise<Object>} An object containing the list of team members.
   */
  getAll: () => axiosInstance.get('/getAll').then((res) => res.data),

  /**
   * Fetches a single team member by their ID.
   * @param {string} id - The ID of the team member.
   * @returns {Promise<Object>} The team member object.
   */
  getById: (id) => axiosInstance.get(`/${id}`).then((res) => res.data),

  /**
   * Updates an existing team member's details.
   * @param {string} id - The ID of the team member to update.
   * @param {Object} data - The updated data.
   * @returns {Promise<Object>} The updated team member object.
   */
  update: (id, data) => axiosInstance.patch(`/${id}`, data).then((res) => res.data),

  /**
   * Updates a team member's password (admin-level).
   * @param {string} id - The ID of the team member.
   * @param {Object} data - The new password object.
   * @returns {Promise<string>} A success message.
   */
  updatePassword: (id, data) => axiosInstance.patch(`/${id}/password`, data).then((res) => res.data),

  /**
   * Deletes a team member.
   * @param {string} id - The ID of the team member to delete.
   * @returns {Promise<string>} A success message.
   */
  delete: (id) => axiosInstance.delete(`/${id}`).then((res) => res.data),

  /**
   * Initiates the forgot password process by sending an OTP.
   * @param {string} email - The email address of the team member.
   * @returns {Promise<Object>} The response containing OTP sent success message.
   */
  forgotPassword: (email) => axiosInstance.post('/forgotPassword', { email }).then((res) => res.data),

  /**
   * Verifies the OTP for password reset.
   * @param {string} email - The email address of the team member.
   * @param {string} otp - The OTP to verify.
   * @returns {Promise<Object>} The response containing OTP verification success message.
   */
  verifyOtp: (email, otp) => axiosInstance.post('/verifyOtp', { email, otp }).then((res) => res.data)
};

export default TeamService;
