import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const AddItemDialog = ({ open, onClose, onAdd }) => {
  const [itemName, setItemName] = useState('');

  const isValidName = itemName.trim().length > 0;

  const handleAdd = () => {
    if (!isValidName) return;

    const newItem = {
      id: itemName.toLowerCase().replace(/\s+/g, '-'),
      label: itemName.trim(),
      fileType: 'doc',
      content: 'NEW',
    };

    onAdd(newItem);
    setItemName('');
    onClose();
  };

  const handleClose = () => {
    setItemName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Doc</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Doc name"
          type="text"
          fullWidth
          variant="outlined"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!isValidName} // disables button if folderName empty or whitespace
        >
          Add Doc
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
