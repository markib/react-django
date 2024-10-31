import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import axiosInstance from '../config/axios';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

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
            setLoading(true);

        try {
            const csrfToken = getCsrfToken();
            const response = await axiosInstance.post('/auth/login/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            dispatch(loginSuccess(response.data));
            localStorage.setItem('token', response.data.access);
            console.log("Token stored:", response.data.access);
            navigate('/dashboard');
        } catch (error) {
            // Capture detailed error messages from Django backend
            const errorMessage = error.response?.data?.message || 'Login failed';
            console.log("Error:", errorMessage);
            // Reset errors first
            setErrors({ username: '', password: '' });

            // Check and set specific field error messages
            if (errorMessage.includes('Username is required')) {
                setErrors((prev) => ({ ...prev, username: 'Username is required' }));
            } else if (errorMessage.includes('Password is required')) {
                setErrors((prev) => ({ ...prev, password: 'Password is required' }));
            } else if (errorMessage.includes('Username is incorrect.')) {
                setErrors((prev) => ({ ...prev, username: 'Username is incorrect.' }));
            } else if (errorMessage.includes('Password is incorrect.')) {
                setErrors((prev) => ({ ...prev, password: 'Password is incorrect.' }));
            }
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
                        onChange={(e) => {
                            setFormData({ ...formData, username: e.target.value });
                            setErrors((prev) => ({ ...prev, username: '' })); // Clear error on change
                        }}
                        error={!!errors.username}  // Show error style if there's an error
                        helperText={errors.username}  // Display error message below the field
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            setErrors((prev) => ({ ...prev, password: '' })); // Clear error on change
                        }}
                        error={!!errors.password}  // Show error style if there's an error
                        helperText={errors.password}  // Display error message below the field
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;