import axios from 'axios';


const getCsrfToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === 'csrftoken') {
            return decodeURIComponent(value);
        }
    }
    return null;
};
const csrfToken = getCsrfToken();
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        // console.log("Token on load:", tokens.access);
        // console.log("Headers before request:", config.headers);

        if (tokens) {
            config.headers.Authorization = `JWT ${tokens.access}`;
        }
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authTokens');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;