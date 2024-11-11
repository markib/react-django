import { createContext, useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

const AuthContext = createContext();
// const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });
    const [user, setUser] = useState(null);
    // const [user, setUser] = useState(() => {
    //     const tokens = localStorage.getItem('authTokens');
    //     return tokens ? jwtDecode(JSON.parse(tokens).access) : null;
    // });
    // Load user from localStorage after authTokens are retrieved
    useEffect(() => {
        const tokens = localStorage.getItem('authTokens');
        if (tokens) {
            const decodedUser = jwtDecode(JSON.parse(tokens).access);
           // console.log("decodedUser",decodedUser);
            setUser(decodedUser);
        }
        setLoading(false);
    }, []);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const loginUser = async (username, password) => {
        const csrfToken = getCsrfToken();
        const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // const decodedAccessToken = jwtDecode(data.access);
            // console.log("decodedAccessToken",decodedAccessToken);
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            navigate('/dashboard', { replace: true });
        } else {
            throw new Error(data.message || 'Login failed.');
        }
    };

    const logoutUser = useCallback(async () => {
        if (authTokens?.refresh) {
            await fetch('http://127.0.0.1:8000/api/auth/logout/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: authTokens.refresh }),
            });
        }
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
        setUser(null);
        navigate('/login', { replace: true });
    }, [navigate, authTokens]);

    const updateToken = useCallback(async () => {
        // console.log('updateToken called');
        // const csrfToken = getCsrfToken();
        const storedTokens = JSON.parse(localStorage.getItem('authTokens'));
        if (!storedTokens?.refresh) {
            logoutUser();
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/token/refresh/', 
                // headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
                 JSON.stringify({ refresh: storedTokens.refresh }),
            );
           
            const data =  response.data;
            // console.log("response", response.status);
            if (response.status === 200) {
                setAuthTokens(data);
              //  console.log("UpdateToken", JSON.stringify(data));
                const decodedUser = jwtDecode(data.access);
               // console.log("UpdateTokendecodedUser", JSON.stringify(decodedUser));
                setUser(decodedUser);
                localStorage.setItem('authTokens', JSON.stringify(data));
                localStorage.setItem('user', JSON.stringify(decodedUser));
                // Fetch fresh user data after token refresh
                await refreshUser();
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Failed to update token:", error);
            logoutUser();
        }
    }, [logoutUser]);



    // Token refresh every 4 minutes
    useEffect(() => {
        if (!authTokens?.refresh) return;

        const updateTokenAndUser = async () => {
            await updateToken();
            setLoading(false);
        };

        updateTokenAndUser();

        const REFRESH_INTERVAL = 1000 * 60 * 4;
        const interval = setInterval(updateToken, REFRESH_INTERVAL);

        return () => clearInterval(interval);

    }, []);

    // Clear user state if token expires
    useEffect(() => {
        if (authTokens) {
            const decodedToken = jwtDecode(authTokens.access);
            const expiryTime = decodedToken.exp * 1000;
            const currentTime = Date.now();

            if (expiryTime < currentTime) {
                logoutUser();
            } else {
                const timeout = setTimeout(logoutUser, expiryTime - currentTime);
                return () => clearTimeout(timeout);
            }
        }
    }, [logoutUser]);

 

    // Store user in localStorage whenever the user changes
    // useEffect(() => {
    //     if (user) {
    //         localStorage.setItem('user', JSON.stringify(user));
    //     } else {
    //         localStorage.removeItem('user');
    //     }
    // }, [user]);

    const refreshUser = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/auth/profile/');
            const freshUserData = response.data;
            setUser(freshUserData);
            localStorage.setItem('user', JSON.stringify(freshUserData));
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    }, []);

    const contextData = {
        user,
        authTokens,
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
