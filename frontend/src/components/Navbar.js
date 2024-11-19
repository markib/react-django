import React, { useState,useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { useNavigate } from "react-router-dom"
import useRefreshToken from '../hooks/useRefreshToken';


function Navbar() {
    const [loading, setLoading] = useState(false)
   
    const navigate = useNavigate()
    const { user, accessToken } = useAuth()
    
    const logout = useLogout()

    useEffect(() => {
        const initializeAuth =  () => {
            setLoading(true);
            //  setUser(); // This function should update isAuthenticated in your auth context
            console.log("in nav", accessToken)
            setLoading(false);
        };

        initializeAuth();
    }, [accessToken]);


    async function onLogout() {
        setLoading(true);
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setLoading(false);
        }
    }
    const ProtectedLinks = () => (
    <>
        <Button color="inherit" component={RouterLink} to="/auth/profile">
            User Profile
        </Button>
            <Button color="inherit" disabled={loading} onClick={onLogout}>
            Logout
        </Button>
    </>
    );

    const UnprotectedLinks = () => (
        <>
            <Button color="inherit" component={RouterLink} to="/auth/login">
                Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/auth/register">
                Register
            </Button>
        </>
    );
    // console.log(user?.isAuthenticated)
    const isAuthenticated = user?.isAuthenticated ?? false;
        return (
            <AppBar position="fixed" sx={{ width: '100vw' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Your App Name
                    </Typography>
                    <Box>
                        {loading ? (
                            <CircularProgress color="inherit" size={24} />
                        ) : (
                            isAuthenticated ? <ProtectedLinks /> : <UnprotectedLinks />
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        );
    
    
}

export default Navbar;