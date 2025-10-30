// src/components/AddFolderDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Box,
  useTheme,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CloudIcon from '@mui/icons-material/Cloud';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

const iconOptions = [
  { id: 'folder', icon: <FolderIcon />, label: 'Folder' },
  { id: 'cloud', icon: <CloudIcon />, label: 'Cloud' },
  { id: 'work', icon: <WorkIcon />, label: 'Work' },
  { id: 'favorite', icon: <FavoriteIcon />, label: 'Favorite' },
];

const AddFolderDialog = ({ open, onClose, onAdd }) => {
  const theme = useTheme();
  const [folderName, setFolderName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  const handleSubmit = () => {
    if (!folderName.trim()) return;

    const newFolder = {
      id: folderName.toLowerCase().replace(/\s+/g, '-'),
      name: folderName,
      icon: selectedIcon.icon,
    };

    onAdd(newFolder);
    setFolderName('');
    setSelectedIcon(iconOptions[0]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
        }}
      >
        Create New Folder
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Folder name"
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          sx={{
            mt: 1,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: theme.palette.secondary.main + '50' },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            },
          }}
        />

        <Box sx={{ mb: 1, color: theme.palette.secondary.main, fontSize: 14 }}>
          Choose an icon:
        </Box>

        <Grid container spacing={1}>
          {iconOptions.map((option) => (
            <Grid item key={option.id}>
              <Tooltip title={option.label}>
                <IconButton
                  onClick={() => setSelectedIcon(option)}
                  sx={{
                    border:
                      selectedIcon.id === option.id
                        ? `2px solid ${theme.palette.primary.main}`
                        : `2px solid transparent`,
                    color:
                      selectedIcon.id === option.id
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    bgcolor:
                      selectedIcon.id === option.id
                        ? `${theme.palette.primary.main}10`
                        : 'transparent',
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}15`,
                    },
                  }}
                >
                  {option.icon}
                </IconButton>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!folderName.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFolderDialog;
