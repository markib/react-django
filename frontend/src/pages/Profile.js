// Profile.js
import {  useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom"
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useLogout from '../hooks/useLogout';

const Profile = () => {
    const { user, setUser } = useAuth()
    const axiosPrivateInstance = useAxiosPrivate()
    const navigate = useNavigate()
    const logout = useLogout()
    const [loading, setLoading] = useState(false)

    async function onLogout() {
        setLoading(true)

        await logout()
        // setLoading(false)
        navigate('/')
    }

    useEffect(() => {
        async function getUser() {
            const  response  = await axiosPrivateInstance.get('/auth/profile/')
            console.log("response",response?.data?.username)
            setUser({ username: response?.data?.username, isAuthenticated: true })
            // setUser(data)
        }

        getUser()
    }, [])

    // if (loading) {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // }

    // if (!user) {
    //     return (
    //         <Box sx={{ textAlign: 'center', mt: 5 }}>
    //             <Typography variant="h5" color="error">
    //                 You are not logged in. Please log in first.
    //             </Typography>
    //         </Box>
    //     );
    // }

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
                            <strong>Username:</strong> {user?.username}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {/* <strong>Email:</strong> {user?.email} */}
                        </Typography>
                            {/* <Button disabled={loading} type='button' onClick={onLogout}>Logout</Button> */}
                        
            </Paper>
        </Box>
    );
};

export default Profile;

