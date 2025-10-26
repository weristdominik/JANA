import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const NotesApp = () => {
  const handleLogout = () => {
    // Clear JWT from localStorage and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login'; // Or use react-router to redirect
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to JANA Notes App!
      </Typography>
      <Typography variant="body1" paragraph>
        Here, you can create, edit, and manage your notes.
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default NotesApp;
