// src/features/lead/LeadService.js

import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
// const CONNECTION_URL = `${BASE_API_URL}/api/connections`;
const LEAD_URL = `${BASE_API_URL}/api/leads`;

// import { TokenManager } from '../Admin/adminService';

// const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: LEAD_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

const LeadService = {
  getAll: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/?${queryParams}`);
    return res.data;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/createLead', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.patch(`/${id}`, data);
    return res.data;
  },

  addFollowUp: async (leadId, data) => {
    const res = await axiosInstance.post(`/${leadId}/followup`, data);
    return res.data;
  },

  getAllold: (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    return axiosInstance.get(`/?${queryParams}`).then((res) => res.data);
  },

  getById: (id) => axiosInstance.get(`/${id}`).then((res) => res.data),

  //   addFollowUp: (leadId, data) => axiosInstance.post(`/${leadId}/followup`, data).then((res) => res.data),

  convert: (leadId, customerId) => axiosInstance.post(`/${leadId}/convert`, { customerId }).then((res) => res.data)
};

export default LeadService;
