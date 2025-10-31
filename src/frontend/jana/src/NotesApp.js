// src/NotesApp.js
import React, { useState } from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import { ITEMS } from './data/itemsData';

const NotesApp = () => {
  const theme = useTheme();

  const [selectedItem, setSelectedItem] = useState(null);

  // helper to find an item by id in the tree
  const findItemById = (tree, id) => {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findItemById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedData = selectedItem ? findItemById(ITEMS, selectedItem) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Sidebar with RichTreeView */}
      <Sidebar items={ITEMS} onSelectItem={setSelectedItem} />

      {/* Note Editor Area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {selectedData ? (
          selectedData.children ? (  // if children exist, it's a folder
            <Typography variant="h6" color="text.secondary">
              This is a folder: {selectedData.label}
            </Typography>
          ) : (
            <NoteEditor note={selectedData} />
          )
        ) : (
          <Typography variant="h6" color="text.secondary">
            Select a file from the sidebar.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NotesApp;
