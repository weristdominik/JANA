// src/components/NoteEditor.js
import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const NoteEditor = ({ note, onSave }) => {
  if (!note) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Select a file to view or edit.
        </Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    onSave({
      ...note,
      content: e.target.value ?? '', // prevent controlled → uncontrolled warning
    });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <TextField
        label="Content"
        fullWidth
        multiline
        rows={16}
        variant="outlined"
        value={note.content ?? ''}
        onChange={handleChange}
      />
    </Box>
  );
};

export default NoteEditor;
