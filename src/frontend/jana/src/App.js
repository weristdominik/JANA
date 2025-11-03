import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import LoginPage from './Login';
import NotesApp from './NotesApp';
import ProtectedRoute from './ProtectedRoute';

import Notes from './Notes';

function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute element={<NotesApp />} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notes" element={<Notes />} /> 
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
