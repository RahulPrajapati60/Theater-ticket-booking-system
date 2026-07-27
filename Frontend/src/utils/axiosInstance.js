import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-1-d3lc.onrender.com/api',  // ya jo bhi tumhara backend URL hai
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har request mein token automatically add ho jaye (auth ke liye)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    console.log("TOKEN:", token); //  DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;