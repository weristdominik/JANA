import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Divider, Button, useTheme } from '@mui/material';

const NoteEditor = ({ note, onSave }) => {
  const theme = useTheme();

  // Local state for editing
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // When a new note is selected, reset local state
  useEffect(() => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
    }
  }, [note]);

  if (!note) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mt: 20 }}
      >
        Select a note to view or start a new one.
      </Typography>
    );
  }

  const handleSave = () => {
    // Call parent callback with updated data
    onSave({ ...note, title: editedTitle, content: editedContent });
  };

  const handleCancel = () => {
    // Revert local edits
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.noteBackground?.main || '#f9f9f9',
      }}
    >
      <TextField
        variant="standard"
        fullWidth
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Title"
        InputProps={{ disableUnderline: true }}
        sx={{
          fontSize: 28,
          fontWeight: 600,
          mb: 2,
          color: theme.palette.secondary.main,
        }}
      />
      <Divider sx={{ mb: 2 }} />
      <TextField
        variant="standard"
        fullWidth
        multiline
        minRows={20}
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder="Start typing..."
        InputProps={{ disableUnderline: true }}
        sx={{
          fontSize: 16,
          lineHeight: 1.6,
          flexGrow: 1,
          color: theme.palette.secondary.main,
        }}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default NoteEditor;
