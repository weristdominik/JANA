// src/components/AddFolderDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const AddFolderDialog = ({ open, onClose, onAdd }) => {
  const [folderName, setFolderName] = useState('');

  const isValidName = folderName.trim().length > 0;

  const handleAdd = () => {
    if (!isValidName) return;

    const newFolder = {
      id: folderName.toLowerCase().replace(/\s+/g, '-'),
      label: folderName.trim(),
      fileType: 'folder',
      children: [],
    };

    onAdd(newFolder);
    setFolderName('');
    onClose();
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Folder name"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!isValidName} // disables button if folderName empty or whitespace
        >
          Add Folder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFolderDialog;
