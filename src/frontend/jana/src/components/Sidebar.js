// src/components/Sidebar.js
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  IconButton,
  Box,
  useTheme,
  Typography,
  Tooltip,
} from '@mui/material';

// Icons
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LogoutIcon from '@mui/icons-material/Logout';
import AddFolderDialog from './AddFolderDialog';

const Sidebar = ({ folders, selectedFolder, onFolderSelect, onAddFolder }) => {
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

        <List
          subheader={
            <ListSubheader
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: theme.palette.secondary.main,
                lineHeight: 2,
                bgcolor: 'transparent',
              }}
            >
              FOLDERS
            </ListSubheader>
          }
        >
          {folders.map((folder) => (
            <ListItemButton
              key={folder.id}
              selected={selectedFolder === folder.id}
              onClick={() => onFolderSelect(folder.id)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.primary.main}1A`,
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                {folder.icon}
              </ListItemIcon>
              <ListItemText
                primary={folder.name}
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
          ))}
        </List>
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
