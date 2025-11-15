import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import LoginPage from './Login';
import NotesApp from './NotesApp';
import ProtectedRoute from './ProtectedRoute';

import DebugNotesApp from './DebugNotesApp'
import NoteEditor from './components/notes/NoteEditor.tsx';

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
          <Route path="/editor" element={<NoteEditor />} />
          {process.env.REACT_APP_JANA_DEBUG === "true" && (
            <Route
              path="/debug"
              element={<ProtectedRoute element={<DebugNotesApp />} />}
            />
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
