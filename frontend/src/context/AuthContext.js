import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        return localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null;
    });
    const [user, setUser] = useState(() => {
        return localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getCsrfToken = () => {
        // console.log("getCsrfToken called");
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
        // e.preventDefault();
        // console.log("loginUser called", username+password);
        const csrfToken = getCsrfToken();
        // console.log("csrfToken: ", csrfToken);
    
        const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();
        
        if (response.ok) {
            if (data.access && data.refresh) {
                localStorage.setItem('authTokens', JSON.stringify(data));
                setAuthTokens(jwtDecode(data.access));
                setUser(data);
        //   console.log("Login successful");
            // Redirect to dashboard and prevent back navigation
            
                // navigate('/dashboard', { replace: true });
            } 
        }else {
            
            throw new Error(data.message || 'Login failed.');
        }
        
        // else {
        //     alert("Login failed: Tokens are missing.");
        // }
    };

    const logoutUser = useCallback(() => {
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
        setUser(null);
        navigate('/login', { replace: true });
    }, [navigate]);

    const updateToken = useCallback(async () => {
        const csrfToken = getCsrfToken();
        
        if (!authTokens?.refresh) {
            console.warn("No refresh token available.");
            logoutUser();
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify({ refresh: authTokens.refresh }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
        } else {
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
    }, [authTokens, loading, logoutUser]);

    useEffect(() => {
        
        if (loading && authTokens?.refresh) {
            updateToken();
        } else if (loading) {
            setLoading(false);
        }
        const REFRESH_INTERVAL = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (authTokens?.refresh) {
                updateToken();
            }
        }, REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [authTokens, loading, updateToken]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
