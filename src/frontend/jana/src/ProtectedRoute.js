import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const isTokenValid = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) return false;

  // Frontend Check
  try {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    if (Date.now() > expirationTime) {
      console.error("Token expired");
      return false;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }

  // Backend Check
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/protected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.error("Backend validation failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Oops something went wrong.");
    return false;
  }
};

const ProtectedRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const valid = await isTokenValid();
      setLoading(false);
      setIsAuthorized(valid);  // Set authorization status based on token validity
    };

    checkTokenValidity();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Optional loading state while checking the token
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // If the token is valid, render the protected element
  return element;
};

export default ProtectedRoute;
