import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3000/schedulo', {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
