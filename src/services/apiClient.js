import axios from 'axios';

const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  'https://backend-td7x.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout to accommodate Render free-tier cold starts
});

// Automatic Bearer Token Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Check for admin token first, then student token
    const token =
      localStorage.getItem('hit_admin_token') ||
      localStorage.getItem('hit_student_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized Error Handling Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please verify your connection.';

    // Auto remove tokens on 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('hit_admin_token');
      localStorage.removeItem('hit_student_token');
    }

    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
