// Profile.js
import { useContext } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext'; // Assuming the context is in the specified path
// import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    // const navigate = useNavigate();

    // const handleLogout = () => {
    //     logoutUser();  // Clear the user context and logout
    //     navigate('/login', { replace: true });  // Redirect to login page
    // };

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h5" color="error">
                    You are not logged in. Please log in first.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
            }}
        >
            <Paper sx={{ p: 4, maxWidth: 500, width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    User Profile
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Username:</strong> {user.username}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Full Name:</strong> {user.full_name || 'Not Provided'}
                </Typography>
            </Paper>
        </Box>
    );
};

export default Profile;

