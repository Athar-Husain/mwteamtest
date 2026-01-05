// src/api/notificationService.js
import axios from 'axios';
import { TokenManager } from '../Team/TeamService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const NOTIFICATION_URL = `${BASE_API_URL}/api/notifications`;

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: NOTIFICATION_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Add Authorization header interceptor
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

// =============================
// 🔹 Notification API Functions
// =============================

// Send notification to one customer
export const sendNotificationToCustomer = async (data) => {
  const res = await axiosInstance.post('/send-to-customer', data);
  return res.data;
};

// Send notification to all customers
export const sendNotificationToAllCustomers = async (data) => {
  const res = await axiosInstance.post('/send-to-all', data);
  return res.data;
};

// Register customer FCM token
export const registerCustomerFCMToken = async (data) => {
  const res = await axiosInstance.post('/register-token', data);
  return res.data;
};

// Unregister FCM token (logout)
export const unregisterCustomerFCMToken = async (data) => {
  const res = await axiosInstance.post('/unregister-token', data);
  return res.data;
};

// Get all notifications for user
export const getNotificationsForUser = async () => {
  const res = await axiosInstance.get('/getTeamNotifications');
  return res.data;
};

// Mark single notification as read
export const markNotificationAsRead = async (notificationId) => {
  const res = await axiosInstance.patch(`/team/${notificationId}/read`);
  return res.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  const res = await axiosInstance.delete(`/${notificationId}`);
  return res.data;
};

// ✅ Export as service object
const notificationService = {
  sendNotificationToCustomer,
  sendNotificationToAllCustomers,
  registerCustomerFCMToken,
  unregisterCustomerFCMToken,
  getNotificationsForUser,
  markNotificationAsRead,
  deleteNotification
};

export default notificationService;
