// src/components/Sidebar.js
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';

import FileExplorer from './FileExplorer';

// Icons
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LogoutIcon from '@mui/icons-material/Logout';

import AddFolderDialog from './AddFolderDialog';
import AddItemDialog from './AddItem.Dialog';
import DeleteItemDialog from './DeleteItemDialog';
import ErrorDialog from './ErrorDialog';

const Sidebar = ({
  items,
  onSelectItem,
  onAddFolder,
  onAddItem,
  onDeleteItem,
  selectedItem,
}) => {
  const theme = useTheme();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [error, setError] = useState({
    open: false,
    title: '',
    message: '',
    type: 'error',
  });

  const handleRequestDelete = (item) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && onDeleteItem) onDeleteItem(itemToDelete);
    setItemToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleTopDeleteClick = () => {
    if (!selectedItem) {
      setError({
        open: true,
        title: 'No item selected',
        message: 'Please select an item before deleting.',
        type: 'warning',
      });
      return;
    }

    if (selectedItem.label === 'Trash' || selectedItem.fileType === 'trash') {
      setError({
        open: true,
        title: 'Cannot Delete Item',
        message: `"${selectedItem.label}" cannot be deleted.`,
        type: 'error',
      });
      return;
    }

    setItemToDelete(selectedItem);
    setOpenDeleteDialog(true);
  };

  const handleErrorClose = () =>
    setError((prev) => ({ ...prev, open: false }));

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            bgcolor: theme.palette.sidebar.main,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mb: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            JANA
          </Typography>

          {/* Buttons under title */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Tooltip title="Add folder">
              <IconButton
                onClick={() => setOpenAddDialog(true)}
                sx={{
                  color: theme.palette.primary.main,
                  bgcolor: `${theme.palette.primary.main}10`,
                  '&:hover': { bgcolor: `${theme.palette.primary.main}20` },
                }}
              >
                <CreateNewFolderIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add doc">
              <IconButton
                onClick={() => setOpenAddItemDialog(true)}
                sx={{
                  color: theme.palette.primary.main,
                  bgcolor: `${theme.palette.primary.main}10`,
                  '&:hover': { bgcolor: `${theme.palette.primary.main}20` },
                }}
              >
                <EditDocumentIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                onClick={handleTopDeleteClick} // ✅ now deletes selected
                sx={{
                  color: theme.palette.primary.main,
                  bgcolor: `${theme.palette.primary.main}10`,
                  '&:hover': { bgcolor: `${theme.palette.primary.main}20` },
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                sx={{
                  color: theme.palette.primary.main,
                  bgcolor: `${theme.palette.primary.main}10`,
                  '&:hover': { bgcolor: `${theme.palette.primary.main}20` },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        {/* File Explorer */}
        <FileExplorer
          items={items}
          onSelectItem={onSelectItem}
          onDeleteItem={handleRequestDelete}
        />
      </Drawer>

      <AddFolderDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={(newFolder) => {
          onAddFolder(newFolder);
          setOpenAddDialog(false);
        }}
      />

      <AddItemDialog
        open={openAddItemDialog}
        onClose={() => setOpenAddItemDialog(false)}
        onAdd={(newItem) => {
          onAddItem(newItem);
          setOpenAddItemDialog(false);
        }}
      />

      <DeleteItemDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.label}
      />

      <ErrorDialog
        open={error.open}
        onClose={handleErrorClose}
        title={error.title}
        message={error.message}
        type={error.type}
      />
    </>
  );
};

export default Sidebar;
