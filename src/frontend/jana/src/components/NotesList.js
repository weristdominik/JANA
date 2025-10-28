// src/components/NotesList.js
import React from 'react';
import {
  Box,
  TextField,
  List,
  ListItemButton,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const NotesList = ({
  notes,
  selectedNote,
  onSelectNote,
  searchTerm,
  onSearchChange,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 340,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: theme.palette.background.default,
            },
          }}
        />
        <List sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
          {notes.map((note) => (
            <ListItemButton
              key={note.id}
              onClick={() => onSelectNote(note)}
              selected={selectedNote?.id === note.id}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 1.5,
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.primary.main}10`,
                },
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}08`,
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
              >
                {note.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {note.snippet}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.noteBackground.main,
        }}
      >
        <Tooltip title="Add Note">
          <IconButton
            sx={{
              color: theme.palette.primary.main,
              bgcolor: `${theme.palette.primary.main}10`,
              '&:hover': { bgcolor: `${theme.palette.primary.main}20` },
            }}
          >
            <NoteAddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default NotesList;
