// Profile.js
import { useContext, useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, TextField, CircularProgress } from '@mui/material';
import AuthContext from '../context/AuthContext'; // Assuming the context is in the specified path
import axiosInstance from '../config/axios';

const Profile = () => {
    const { user, setUser, refreshUser } = useContext(AuthContext);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    // Step 1: Load user data from context (and localStorage as fallback) when component mounts
    useEffect(() => {
        if (user) {
            // console.log("User updated:", user);
            // console.log("User email from context:", user.email);
            setFormData({
                username: user.username,
                email: user.email
            });
        } else {
            const storedUser = localStorage.getItem('user');
            // console.log("User in localStorage:", storedUser ? JSON.parse(storedUser) : 'No user in localStorage');
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Set user from localStorage to context
            }
        }
    }, [user, setUser]);

    const refreshUserData = async () => {
        try {
            const response = await axiosInstance.get('/auth/profile/');
            const freshUserData = response.data;
            setUser(freshUserData);
            localStorage.setItem('user', JSON.stringify(freshUserData));
            setFormData({
                username: freshUserData.username,
                email: freshUserData.email
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
  
    useEffect(() => {
        refreshUserData();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            await refreshUser();
            setIsLoading(false);
        };
        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(
                '/auth/profile/update/',
                formData
            );
            const updatedUser = response.data;
            console.log("Updated response data:", updatedUser);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log("After update, User in context:", updatedUser);
            console.log("User in localStorage:", localStorage.getItem('user'));
            setIsEditing(false);
            refreshUserData(); // Refresh data after update
        } catch (error) {
            // alert(error)
            console.error('Error updating profile:', error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

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
                
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            // onChange={handleChange}
                            fullWidth
                            // required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                 
                        <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                            Save
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleEditToggle}
                        >
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Username:</strong> {user.username}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Email:</strong> {user.email}
                        </Typography>
                       
                        <Button
                            variant="outlined"
                            onClick={handleEditToggle}
                        >
                            Edit Profile
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Profile;

