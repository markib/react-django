import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard'; // Your main dashboard component
import Profile from '../pages/Profile';     // Your profile component

const DashboardTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Map each tab index to a path
    const paths = ['/dashboard', '/dashboard/profile'];

    // Determine active tab based on current path
    const activeTab = paths.indexOf(location.pathname);

    const handleTabChange = (event, newValue) => {
        navigate(paths[newValue]); // Change route on tab change
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Dashboard" />
                <Tab label="Profile" />
            </Tabs>

            <Box sx={{ p: 3 }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default DashboardTabs;