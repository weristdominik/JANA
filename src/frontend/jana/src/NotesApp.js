// src/NotesApp.js
import React, { useState } from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import { ITEMS } from './data/itemsData';

const NotesApp = () => {
  const theme = useTheme();

  const [items, setItems] = useState(ITEMS);
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

  // handle adding a new folder under the selected folder
  const handleAddFolder = (newFolder) => {
    if (!selectedItem) return;

    const addToFolder = (tree) => {
      return tree.map(node => {
        if (node.id === selectedItem && node.fileType === 'folder') {
          // generate unique id
          const existingIds = node.children.map(c => c.id);
          let baseId = newFolder.id;
          let counter = 1;
          while (existingIds.includes(baseId)) {
            baseId = `${newFolder.id}-${counter}`;
            counter++;
          }

          return {
            ...node,
            children: [...node.children, { ...newFolder, id: baseId }]
          };
        } else if (node.children) {
          return { ...node, children: addToFolder(node.children) };
        }
        return node;
      });
    };

    setItems(prev => addToFolder(prev));
  };

  const selectedData = selectedItem ? findItemById(items, selectedItem) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Sidebar with RichTreeView */}
      <Sidebar 
        items={items} 
        onSelectItem={setSelectedItem} 
        onAddFolder={handleAddFolder} 
      />

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
