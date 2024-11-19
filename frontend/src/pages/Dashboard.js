import { React, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate();
    const { user, accessToken } = useContext(AuthContext);
    // console.log("Dashboard user", user);
    useEffect(() => {
        // console.log('User:', user);
        // console.log('accessToken:', accessToken);
        // If no authTokens, redirect to login page
        if (!accessToken) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

   
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500">
                    {user ? `Welcome back, ${user.username}` : 'Welcome back, Guest'}
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               
            </div>

        </div>
    );
};

export default Dashboard;