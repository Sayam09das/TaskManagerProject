import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PublicRouteWithRedirect = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:3000/schedulo', {
                    withCredentials: true,
                });

                if (res.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, []);

    if (isChecking) return <div className="text-center mt-10">Loading...</div>;

    return isAuthenticated ? <Navigate to="/schedulo" /> : children;
};

export default PublicRouteWithRedirect;
