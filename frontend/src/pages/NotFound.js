import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-6">
                {/* 404 Header */}
                <h1 className="text-9xl font-bold text-gray-900">404</h1>

                {/* Error Message */}
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-gray-800">Page Not Found</h2>
                    <p className="text-gray-600 max-w-sm">
                        Sorry, we couldn't find the page you're looking for. The page might have been removed or the link might be broken.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Go Home
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;