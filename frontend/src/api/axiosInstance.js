import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
    
    // Check if unauthorized and token exists (session expired)
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please log in again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } else {
      // For general API errors, show a toast notification
      // (Except validation or minor 404 queries that are handled at component level)
      if (error.response?.status !== 404 && error.response?.status !== 400 && error.response?.status !== 409) {
        toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
