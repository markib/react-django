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

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    console.log("Cookie value",value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCsrfToken(); // Get the latest CSRF token dynamically
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
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to an expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using stored refresh token from cookies
                const refreshToken = getCookie('refresh_token');
                if (!refreshToken) {
                    console.error("Refresh token not found in cookies");
                    window.location.href = '/login'; // Redirect to login on failure
                    return Promise.reject(error);
                }
                const response = await axiosInstance.post('/auth/token/refresh/', { refresh: refreshToken });

                const newAccessToken = response.data.access;
                console.log("newAccessToken", newAccessToken);
                if(newAccessToken){
                // Update the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }  
                else {
                    console.log("No access","No access token found. Authorization header not set.");
                }        
                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Failed to update token:", refreshError);
                window.location.href = '/login'; // Redirect to login on failure
                return Promise.reject(refreshError);
            }
        }

        console.error("Axios error:", error.response || error.message); // Log other errors
        return Promise.reject(error);
    }
);

export default axiosInstance;