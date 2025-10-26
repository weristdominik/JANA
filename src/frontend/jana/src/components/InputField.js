import React from 'react';
import { TextField } from '@mui/material';

const InputField = ({ label, type = 'text', value, onChange }) => {
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      sx={{ marginBottom: 2 }}
    />
  );
};

export default InputField;
