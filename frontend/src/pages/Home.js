// src/components/Home.js
import React, { useEffect, useState }  from 'react';
// import { useNavigate } from "react-router-dom"
// import useAuth from '../hooks/useAuth';
// import useAxiosPrivate from '../hooks/useAxiosPrivate';
// import useLogout from '../hooks/useLogout';

const Home = () => {
    
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Welcome to Our Application </h1>
            <p>Here is the data fetched from the Django backend:</p>
          
            {/* <ul>
                {data.map(item => (
                    <li key={item.id}>{item.name}</li> // Adjust based on your data structure
                ))}
            </ul> */}
        </div>
    );
};

export default Home;
