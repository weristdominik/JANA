import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import InputField from './components/InputField';
import LoginButton from './components/LoginButton';
import { jwtDecode } from "jwt-decode";

const isTokenValid = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) return false;

  // Frontend Check
  try {
    // Decode the token and check expiration (Frontend validation)
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

  // Backend Validation
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/protected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;  // Token is valid
    } else {
      console.error("Backend token validation failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error contacting the backend:", error);
    return false;
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await isTokenValid();
      if (isValid) {
        navigate('/'); // Redirect if token is valid
      }
    };

    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError('Invalid username or password.');
        return;
      }

      // Save token in localStorage (or use Context, Redux, etc.)
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setError('');

      navigate('/');
    } catch (err) {
      setError("Oops something went wrong.");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ backgroundColor: '#F5F5F7', padding: 4, borderRadius: 1, boxShadow: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2, color: '#FF5A5F' }}>
          JANA Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <LoginButton text="Login" onClick={handleSubmit} />
        </form>
        {error && <Typography color="error" variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>{error}</Typography>}
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Typography variant="body2">Don't have an account? Sign Up</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
