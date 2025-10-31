// src/components/Sidebar.js
import React, { useState } from 'react';
import { Drawer, Box, Typography, useTheme, IconButton, Tooltip } from '@mui/material';
import FileExplorer from './FileExplorer';

// Icons
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LogoutIcon from '@mui/icons-material/Logout';

import AddFolderDialog from './AddFolderDialog';

const Sidebar = ({ items, onSelectItem, onAddFolder }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 1,
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              mt: 0.5,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            JANA
          </Typography>

          <Tooltip title="Add folder">
            <IconButton
              onClick={() => setOpenDialog(true)}
              sx={{
                color: theme.palette.primary.main,
                bgcolor: `${theme.palette.primary.main}10`,
                '&:hover': { bgcolor: `${theme.palette.primary.main}20` },
              }}
            >
              <CreateNewFolderIcon />
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

        {/* File Explorer */}
        <FileExplorer items={items} onSelectItem={onSelectItem} />
      </Drawer>
      
      <AddFolderDialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onAdd={onAddFolder}
      />
    </>
  );
};

export default Sidebar
