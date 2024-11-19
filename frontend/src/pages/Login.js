import { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { axiosInstance } from '../axios';


const Login = () => {
   
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [errors, setError] = useState()

    function onUserNameChange(event) {
        setUsername(event.target.value)
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
    }

    async function onSubmitForm(event) {
        event.preventDefault()

        setLoading(true)

        try {
            const response = await axiosInstance.post('/auth/login/', JSON.stringify({
                username,
                password
            }, {

                withCredentials: true // Send cookies with request

            }))

            // setAccessToken(response?.data?.access_token)
            // setCSRFToken(response.headers["x-csrftoken"])
            setUsername()
            setPassword()
            setUser({ username: response?.data?.username, isAuthenticated: true })
            // setLoading(false)

            navigate(fromLocation, { replace: true })
        } catch (error) {
            // setLoading(false)
            console.log(error)
            setError(error)
            // TODO: handle errors
        }
        finally {
            setLoading(false);
        }
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
            <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={onSubmitForm}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
        
                        onChange={onUserNameChange}
                        // error={!!errors.username}  // Show error style if there's an error
                        // helperText={errors.username}  // Display error message below the field
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                      
                        onChange={onPasswordChange}
                        // error={!!errors.password}  // Show error style if there's an error
                        // helperText={errors.password}  // Display error message below the field
                    />
                    {/* {errors.general && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {errors.general}
                        </Typography>
                    )} */}
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