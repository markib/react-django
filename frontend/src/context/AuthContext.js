import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

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
        const value = `; ${document.cookie}`; // Prepend a semicolon for easier parsing
        const parts = value.split(`; ${name}=`); // Split by the cookie name
        if (parts.length === 2) {
            return parts.pop().split(';').shift(); // Return the cookie value
        }
        return null; // Return null if cookie is not found
    };

    const refreshUser = useCallback(async () => {
        if (isRefreshing) return; // Prevent multiple calls

        setIsRefreshing(true);
        try {
            const response = await axiosInstance.get('/auth/profile/', {
                withCredentials: true,
            });
            const freshUserData = response.data;
            setUser(freshUserData);
        } catch (error) {
            console.error('Error refreshing user data:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [isRefreshing]);

    const loginUser = async (username, password) => {
        // const csrfToken = getCsrfToken();
        try {
            // const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ username, password }),
            //     credentials: 'include', // This is important for including cookies
            // });
            
            const response = await axiosInstance.post('/auth/login/', 
                JSON.stringify({ username, password }),{
                withCredentials: true, // Send cookies with request
                }
            );
            // const data = await response.json();
            const data = response.data;
            // console.log("data",data);
            if (response.status === 200) {
                console.log("data",data.access);
                setAccessToken(data.access);
                
                setUser(jwtDecode(data.access));
                // setUser(data);

                navigate('/dashboard', { replace: true });
            } else {
                throw new Error(data.message || 'Login failed.');
            }
        } catch (error) {

            console.error('Login error:', error);
            throw error;
        }
    };

    const logoutUser = useCallback(async () => {
        try {
            await axiosInstance.post('/auth/logout/', {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        setAccessToken(null);
        setUser(null);
        navigate('/login', { replace: true });
        // setTimeout(() => {
        //     navigate('/login', { replace: true });
        // }, 0);
    }, []);

    const updateToken = useCallback(async () => {
        // console.log("updateToken");
        try {
            // console.log(document.cookie)
            const response = await axiosInstance.post('/auth/token/refresh/', {}, {
                withCredentials: true,
            });
            // console.log("response",response);
            
            const data = response.data;
            if (response.status === 200) {
                // console.log("response", data.access);
                setAccessToken(data.access);
                setUser(jwtDecode(data.access));
                // const decodedUser = (data);
                // setUser(data);
                if (accessToken) {
                await refreshUser();
                }
            } 
            // else {
            //     await logoutUser();
            // }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error("Invalid refresh token. Logging out...");
                // await logoutUser();
            } else {
                console.error("Failed to update token:", error);
            }
            // await logoutUser();
        }
    }, [logoutUser]);



    // Token refresh every 4 minutes
    useEffect(() => {
        const updateTokenAndUser = async () => {
            await updateToken();
            setLoading(false);
        };

        updateTokenAndUser();

        const REFRESH_INTERVAL = 1000 * 60 * 4;
        const interval = setInterval(updateToken, REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [updateToken]);

    // Clear user state if token expires
    useEffect(() => {
        const checkTokenExpiration = async () => {
            const accessToken = getCookie('access_token');
            try{
            if (accessToken) {
                const decodedToken = jwtDecode(accessToken);
                const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds

                if (Date.now() >= expiryTime) {
                    console.log("Access token expired. Attempting to refresh...");
                    await updateToken(); // Attempt to refresh the token if expired
                }
            }
         } catch (error){
                console.error("Error decoding access token:", error);
                await logoutUser(); // Logout on decoding failure
            }
        };

        checkTokenExpiration();
    }, []);

 
    

    const contextData = {
        user,
        accessToken,
        loginUser,
        logoutUser,
        getCsrfToken,
        setUser,
        refreshUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;