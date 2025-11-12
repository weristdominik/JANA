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
  alpha,
  styled,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import theme from "../../theme/theme.js";

// Custom styled TreeItem
const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[800],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: "0.85rem",
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    color: theme.palette.primary.contrastText,
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const Sidebar = ({
  treeData,
  onItemSelect,
  onAddFolder,
  onAddFile,
  onDeleteItem,
}) => {
  // Separate the Trash folder and move it to the bottom
  const sortedTreeData = treeData
    ? [
        ...treeData.filter((item) => item.label !== "Trash"),
        ...treeData.filter((item) => item.label === "Trash"),
      ]
    : [];

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
          <IconButton onClick={onAddFolder} sx={theme.custom.roundButton}>
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add File">
          <IconButton onClick={onAddFile} sx={theme.custom.roundButton}>
            <NoteAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteItem} sx={theme.custom.roundButton}>
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Tree View */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {sortedTreeData?.length > 0 ? (
          <RichTreeView
            items={sortedTreeData} // <-- reordered data
            onItemSelectionToggle={onItemSelect}
            slots={{ item: CustomTreeItem }} // <-- custom styling applied
          />
        ) : (
          <Typography variant="body2">Loading tree...</Typography>
        )}
      </Box>

      {/* Footer section */}
      <Box
        sx={{
          mt: "auto",
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
            {"© weristdominik"}
          </Link>
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: "0.7rem", color: "text.disabled" }}
        >
          <Link href="#" underline="none">
            {"v0.0.0"}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
