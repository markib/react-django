import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
import useAuth from '../hooks/useAuth';

const Header = () => {
   
    const navigate = useNavigate();
    const { user ,logoutUser} = useAuth

    const handleLogout = () => {
        logoutUser();
        // navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My App Name
                </Typography>
                <Box>
                   
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;