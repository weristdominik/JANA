import React, { useEffect, useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";

// Editor

const Notes = () => {
  const [treeData, setTreeData] = useState([]);
  const [transformedJson, setTransformedJson] = useState("");
  const [lastSelectedItem, setLastSelectedItem] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    fetchTree();
  }, []);

  // 🌳 Fetch tree structure
  const fetchTree = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tree`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTreeData(data);
      setTransformedJson(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error fetching tree data:", err);
    }
  };

  // 🪵 Handle selection
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
      } else {
        setFileContent(null);
      }
    }
  };

  // 📄 Fetch file content
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

      // ✅ FIX: Try parsing JSON content before setting
      try {
        const parsed = JSON.parse(data.content);
        setFileContent(parsed);
      } catch {
        // If not JSON, set raw text
        setFileContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      alert(`Error fetching file content: ${error.message}`);
      setFileContent(null);
    }
  };

  // 📁 Add Folder
  const handleAddFolder = async () => {
    if (!lastSelectedItem) return alert("No Item selected!");
    if (lastSelectedItem.type !== "folder")
      return alert("You can only add a folder under a folder!");

    const folderName = prompt("Enter new folder name:", "Folder1");
    if (!folderName?.trim()) return alert("Folder name cannot be empty!");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/add-folder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parent_id: lastSelectedItem.id,
            folder_name: folderName.trim(),
          }),
        }
      );

      if (res.status === 201) {
        const newFolder = await res.json();

        const addFolderToTree = (nodes, parentId, folder) =>
          nodes.map((node) => {
            if (node.id === parentId) {
              return { ...node, children: [...(node.children || []), folder] };
            } else if (node.children) {
              return {
                ...node,
                children: addFolderToTree(node.children, parentId, folder),
              };
            }
            return node;
          });

        setTreeData((prev) =>
          addFolderToTree(prev, lastSelectedItem.id, newFolder)
        );
        setTransformedJson(JSON.stringify(treeData, null, 2));
      } else {
        const err = await res.json();
        alert(`Error ${res.status}: ${err.detail}`);
      }
    } catch (error) {
      console.error("Failed to add folder:", error);
      alert("Failed to add folder. See console for details.");
    }
  };

  // 📄 Add Document
  const handleAddDoc = async () => {
    if (!lastSelectedItem) return alert("No Item selected!");
    if (lastSelectedItem.type !== "folder")
      return alert("You can only add a doc under a folder!");

    const fileName = prompt("Enter new doc name:", "TEST.txt");
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
        alert(`File '${newFile.label}' created successfully!`);

        const addFileToTree = (nodes, parentId, fileNode) =>
          nodes.map((node) => {
            if (node.id === parentId) {
              const children = node.children
                ? [...node.children, fileNode]
                : [fileNode];
              return { ...node, children };
            }
            if (node.children) {
              return {
                ...node,
                children: addFileToTree(node.children, parentId, fileNode),
              };
            }
            return node;
          });

        setTreeData((prev) =>
          addFileToTree(prev, lastSelectedItem.id, newFile)
        );
      } else {
        const err = await res.json();
        alert(`Error ${res.status}: ${err.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to add doc:", error);
      alert("Failed to add doc. See console for details.");
    }
  };

  // ❌ Delete Folder or File
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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete item");
      }

      const data = await res.json();
      alert(`${data.message}: ${data.moved_path}`);

      fetchTree();
      setLastSelectedItem(null);
      setFileContent(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(`Error deleting item: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Tree View</h3>
      {treeData.length > 0 ? (
        <RichTreeView
          items={treeData}
          onItemSelectionToggle={handleItemSelectionToggle}
        />
      ) : (
        <p>Loading tree data...</p>
      )}

      <h3>Transformed JSON (Debug)</h3>
      <pre
        style={{
          background: "#f6f8fa",
          padding: "12px",
          borderRadius: "6px",
          fontSize: "13px",
          overflowX: "auto",
          maxHeight: "300px",
        }}
      >
        {transformedJson || "Waiting for data..."}
      </pre>

      <h3>Last Selected Item</h3>
      <pre
        style={{
          background: "#f0f0f0",
          padding: "12px",
          borderRadius: "6px",
          fontSize: "13px",
          overflowX: "auto",
          maxHeight: "200px",
        }}
      >
        {lastSelectedItem
          ? JSON.stringify(lastSelectedItem, null, 2)
          : "Click a node to see details..."}
      </pre>

      <h3>File Content (if a file is selected)</h3>
      <pre
        style={{
          background: "#e8f5e9",
          padding: "12px",
          borderRadius: "6px",
          fontSize: "13px",
          overflowX: "auto",
          maxHeight: "300px",
        }}
      >
        {fileContent
          ? typeof fileContent === "object"
            ? JSON.stringify(fileContent, null, 2)
            : fileContent
          : "Select a file to view its content..."}
      </pre>

      <button onClick={handleAddFolder}>Add Folder</button>
      <button onClick={handleAddDoc}>Add Doc</button>
      <button onClick={handleDeleteItem}>Delete Item</button>
    </div>
  );
};

export default Notes;
