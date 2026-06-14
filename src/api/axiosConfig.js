import axios from 'axios';

// 1. Buat instance konfigurasi dasar Axios
const API = axios.create({
  // Kita langsung arahkan ke server Laravel kamu yang berjalan di port 8000
  baseURL: 'http://127.0.0.1:8000/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Interceptor (Otomatis menempelkan Token JWT di setiap request)
API.interceptors.request.use(
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

export default API; // Pastikan ada export default agar bisa dipakai di file lain