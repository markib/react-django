import { useState, useContext, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
// import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
// import axiosInstance from '../config/axios';
import AuthContext from '../context/AuthContext'

const Login = () => {
   
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });
    const { loginUser, loading, user } = useContext(AuthContext); // Access loginUser and getCsrfToken from AuthContext
    // const [buttonLoading, setButtonLoading] = useState(false);
    // Redirect to the dashboard if the user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true }); // Redirect to dashboard
        }
    }, [user, navigate]);
 
    

    const handleSubmit =  async(e) => {
        e.preventDefault();
        // console.log("Form submitted",loading);
        // setButtonLoading(true);
        // Capture `formData` immediately
        const currentFormData = { ...formData };
        // console.log("Form data right before async call:", currentFormData);

        try {
            // console.log("formdata", currentFormData.password);
        
            const response = await loginUser(currentFormData.username, currentFormData.password); // Pass username, password, and csrfToken
            console.log("Response from loginUser:", response);
        
            localStorage.getItem('authTokens');
            // localStorage.setItem('user', response.data.username);
            // console.log("Token stored:", response.data.access);
            // Redirect to dashboard and prevent back navigation
            navigate('/dashboard', { replace: true });
        } catch (error) {
            // console.log("Error in handleSubmit:", error);
           
            if (error.message.includes('Username is required')) {
                setErrors({ username: 'Username is required' });
            } else if (error.message.includes('Password is required')) {
                setErrors({ password: 'Password is required' });
            } else if (error.message.includes('Username is incorrect')) {
                setErrors({ username: 'Username is incorrect' });
            } else if (error.message.includes('Password is incorrect')) {
                setErrors({ password: 'Password is incorrect' });
            } else {
                setErrors({ general: 'Login failed. Please try again later.' });
            }

        
        } 
        // finally {
        //     setButtonLoading(false);
        // }
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
                        name="username"
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
                        name="password"
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