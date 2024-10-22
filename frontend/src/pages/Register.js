// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register/', formData);
            console.log('User registered:', response.data);
            setSuccess(true);
            setError(null);
        } catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: 'auto',
                padding: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                mt: 5,
            }}
        >
            <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    name="username"
                    fullWidth
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>
            </form>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {JSON.stringify(error)}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Registration successful!
                </Alert>
            )}
        </Box>
    );
};

export default Register;
