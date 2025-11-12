// NotesApp.js
import React, { useEffect, useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NoteEditor from "./components/notes/NoteEditor";
import Sidebar from "./components/notes/Sidebar";
import theme from "./theme/theme.js";

const drawerWidth = 280;

const NotesApp = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch tree
  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tree`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTreeData(data);
    } catch (err) {
      console.error("Error fetching tree data:", err);
    }
  };

  // Selection logic
  const handleItemSelectionToggle = (event, itemId, isSelected) => {
    const findNodeById = (nodes, id) => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    if (isSelected) {
      const node = findNodeById(treeData, itemId);
      setLastSelectedItem(node);

      if (node.type === "file") {
        fetchFileContent(node.id);
        // Only close drawer when file is selected
        if (isMobile) setMobileOpen(false);
      } else {
        setFileContent(null);
      }
    }
  };

  // Fetch file content
  const fetchFileContent = async (filePath) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/get-file-content`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_path: filePath }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to fetch file content");
      }

      const data = await res.json();
      try {
        const parsed = JSON.parse(data.content);
        setFileContent(parsed);
      } catch {
        setFileContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      alert(`Error fetching file content: ${error.message}`);
      setFileContent(null);
    }
  };

  // Add Folder
  const handleAddFolder = async () => {
    const parentId = lastSelectedItem?.id || null; // null if nothing selected
    const folderName = prompt("Enter new folder name:", "Folder1");
    if (!folderName?.trim()) return alert("Folder name cannot be empty!");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/add-folder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parent_id: parentId, // backend should handle null as root
            folder_name: folderName.trim(),
          }),
        }
      );

      if (res.status === 201) {
        const newFolder = await res.json();
        if (parentId) {
          // Add folder under selected node
          const addFolderToTree = (nodes, pid, folder) =>
            nodes.map((node) =>
              node.id === pid
                ? { ...node, children: [...(node.children || []), folder] }
                : node.children
                ? { ...node, children: addFolderToTree(node.children, pid, folder) }
                : node
            );
          setTreeData((prev) => addFolderToTree(prev, parentId, newFolder));
        } else {
          // Add folder at root
          setTreeData((prev) => [...prev, newFolder]);
        }
      }
    } catch (error) {
      console.error("Failed to add folder:", error);
    }
  };

  // Add File
  const handleAddDoc = async () => {
    if (!lastSelectedItem) return alert("No Item selected!");
    if (lastSelectedItem.type !== "folder")
      return alert("You can only add a doc under a folder!");

    const fileName = prompt("Enter new doc name:", "NewDoc.txt");
    if (!fileName?.trim()) return alert("Doc name cannot be empty!");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/add-file`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parent_id: lastSelectedItem.id,
            file_name: fileName.trim(),
          }),
        }
      );

      if (res.status === 201) {
        const newFile = await res.json();
        const addFileToTree = (nodes, parentId, fileNode) =>
          nodes.map((node) =>
            node.id === parentId
              ? { ...node, children: [...(node.children || []), fileNode] }
              : node.children
              ? { ...node, children: addFileToTree(node.children, parentId, fileNode) }
              : node
          );
        setTreeData((prev) => addFileToTree(prev, lastSelectedItem.id, newFile));
      }
    } catch (error) {
      console.error("Failed to add file:", error);
    }
  };

  // Delete Item
  const handleDeleteItem = async () => {
    if (!lastSelectedItem) return alert("No Item selected!");
    const endpoint =
      lastSelectedItem.type === "folder"
        ? "/api/delete-folder"
        : "/api/delete-file";

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [lastSelectedItem.type === "folder"
              ? "folder_id"
              : "file_id"]: lastSelectedItem.id,
          }),
        }
      );

      if (res.ok) {
        await res.json();
        fetchTree();
        setLastSelectedItem(null);
        setFileContent(null);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Sidebar layout
  const sidebar = (
    <Sidebar
      treeData={treeData}
      onItemSelect={handleItemSelectionToggle}
      onAddFolder={handleAddFolder}
      onAddFile={handleAddDoc}
      onDeleteItem={handleDeleteItem}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar Drawer */}
        {isMobile ? (
          <>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
              <Toolbar>
                <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 2 }}>
                  JANA
                </Typography>
              </Toolbar>
            </AppBar>

            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  backgroundColor: "sidebar.main",
                },
              }}
            >
              {sidebar}
            </Drawer>
          </>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                backgroundColor: "sidebar.main",
              },
            }}
          >
            {sidebar}
          </Drawer>
        )}

        {/* Editor Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: { xs: 1.5, sm: 2 }, // less padding on mobile
            pt: { xs: 2, sm: 3 },  // small top space for breathing room
            mt: isMobile ? 6 : 0,  // smaller margin when app bar present
            overflow: "auto",
          }}
        >
          <NoteEditor
            content={fileContent}
            lastSelectedItem={lastSelectedItem}
            onChange={(json) => setFileContent(json)}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NotesApp;
