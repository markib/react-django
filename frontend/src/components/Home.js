// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the Django API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/items/'); // Update this URL based on your Django API
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Welcome to Our Application</h1>
            <p>Here is the data fetched from the Django backend:</p>
            <ul>
                {data.map(item => (
                    <li key={item.id}>{item.name}</li> // Adjust based on your data structure
                ))}
            </ul>
        </div>
    );
};

export default Home;
