import React from 'react';
import { Button } from '@mui/material';

const LoginButton = ({ text, onClick }) => {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: '#FF5A5F',
        color: '#fff',
        '&:hover': { backgroundColor: '#f14d54' },
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default LoginButton;
