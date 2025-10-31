// src/components/NoteEditor.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const NoteEditor = ({ note }) => {
  if (!note) return null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {note.label}
      </Typography>
      <Paper sx={{ p: 2, mt: 1 }}>
        <Typography variant="body1">
          {note.content || 'This is a placeholder file content.'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default NoteEditor;
