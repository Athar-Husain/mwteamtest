import axios from 'axios';
import { TokenManager } from '../Team/TeamService';
// import { TokenManager } from '../Customers/CustomerService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const LEAD_URL = `${BASE_API_URL}/api/leads`;

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
  // ✅ CREATE LEAD (POST)
  createLead: async (data) => {
    const res = await axiosInstance.post('/createLead', data);
    return res.data;
  },

  // ✅ GET MY REFERRALS
  getMyReferrals: async () => {
    const res = await axiosInstance.get('/getMyReferrals');
    return res.data;
  }
};

export default LeadService;
