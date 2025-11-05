// components/layout/Sidebar.js
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Tooltip,
  Link,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import theme from "../../theme/theme.js";

const Sidebar = ({
  treeData,
  onItemSelect,
  onAddFolder,
  onAddFile,
  onDeleteItem,
}) => {
  const roundButtonSx = {
    bgcolor: "#ffe5e6",
    color: theme.palette.primary.main,
    transition: "all 0.25s ease",
    "&:hover": {
      bgcolor: theme.palette.primary.main,
      color: "#fff",
    },
  };

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            letterSpacing: 1.5,
          }}
        >
          JANA
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="center" spacing={1.5} sx={{ mb: 2 }}>
        <Tooltip title="Add Folder">
          <IconButton onClick={onAddFolder} sx={roundButtonSx}>
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add File">
          <IconButton onClick={onAddFile} sx={roundButtonSx}>
            <NoteAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteItem} sx={roundButtonSx}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Tree View */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {treeData?.length > 0 ? (
          <RichTreeView items={treeData} onItemSelectionToggle={onItemSelect} />
        ) : (
          <Typography variant="body2">Loading tree...</Typography>
        )}
      </Box>

      {/* Footer section */}
      <Box
        sx={{
          mt: "auto", // pushes it to the bottom
          textAlign: "center",
          pt: 2,
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8rem", color: "text.secondary" }}
        >
            <Link href="#" underline="none">
                {'© weristdominik'}
            </Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: "0.7rem", color: "text.disabled" }}
        >
            <Link href="#" underline="none">
                {'v0.0.0'}
            </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
