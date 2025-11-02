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

  // Find an item by id
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

  // Recursive delete
  const deleteItemById = (tree, idToDelete) =>
    tree
      .filter((node) => node.id !== idToDelete)
      .map((node) =>
        node.children
          ? { ...node, children: deleteItemById(node.children, idToDelete) }
          : node
      );

  // Add folder
  const handleAddFolder = (newFolder) => {
    if (!selectedItem) return;
    const addToFolder = (tree) =>
      tree.map((node) => {
        if (node.id === selectedItem && node.fileType === 'folder') {
          const existingIds = node.children.map((c) => c.id);
          let baseId = newFolder.id;
          let counter = 1;
          while (existingIds.includes(baseId)) {
            baseId = `${newFolder.id}-${counter}`;
            counter++;
          }
          return {
            ...node,
            children: [...node.children, { ...newFolder, id: baseId }],
          };
        } else if (node.children) {
          return { ...node, children: addToFolder(node.children) };
        }
        return node;
      });
    setItems((prev) => addToFolder(prev));
  };

  // Delete item
  const handleDeleteItem = (item) => {
    if (!item) return;
    setItems((prev) => deleteItemById(prev, item.id));
    if (selectedItem === item.id) setSelectedItem(null);
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
      <Sidebar
        items={items}
        onSelectItem={setSelectedItem}
        onAddFolder={handleAddFolder}
        onDeleteItem={handleDeleteItem}
        selectedItem={selectedData} // ✅ pass the selected item object
      />

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
          selectedData.children ? (
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
