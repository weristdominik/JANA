// src/NotesApp.js
import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import FolderIcon from '@mui/icons-material/Folder';

import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';

const NotesApp = () => {
  const theme = useTheme();

  const [folders, setFolders] = useState ([
    { id: 'icloud', name: 'iCloud', icon: <CloudIcon /> },
    { id: 'personal', name: 'Personal', icon: <FolderIcon /> },
    { id: 'work', name: 'Work', icon: <FolderIcon /> },
  ]);

  const notesData = {
    icloud: [
      { id: 1, title: 'Welcome to Notes', snippet: 'Start organizing your thoughts…', content: 'This is your first note.' },
      { id: 2, title: 'Shopping List', snippet: 'Milk, Eggs, Bread, Cheese', content: 'Groceries for the week' },
    ],
    personal: [
      { id: 3, title: 'Travel Plans', snippet: 'Flight on Friday...', content: 'Pack light!' },
    ],
    work: [
      { id: 4, title: 'Meeting Notes', snippet: 'Discussed Q4 roadmap…', content: 'Key action items:' },
    ],
  };

  const [selectedFolder, setSelectedFolder] = useState('icloud');
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const notes = notesData[selectedFolder].filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: theme.palette.background.default }}>

      <Sidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onAddFolder={(newFolder) => setFolders([...folders, newFolder])}
      />

      <NotesList
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <NoteEditor
        note={selectedNote}
        onSave={(updatedNote) => {
          const updatedNotes = notesData[selectedFolder].map((n) =>
            n.id === updatedNote.id ? updatedNote : n
          );
          notesData[selectedFolder] = updatedNotes;
          setSelectedNote(updatedNote);
        }}
      />

    </Box>
  );
};

export default NotesApp;
