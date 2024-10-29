import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import axiosInstance from '../config/axios';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // Function to get the CSRF token from cookies
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const csrfToken = getCsrfToken();
            const response = await axiosInstance.post('/auth/login/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            dispatch(loginSuccess(response.data));
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
        }
    };
    

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
            }}
        >
            <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;