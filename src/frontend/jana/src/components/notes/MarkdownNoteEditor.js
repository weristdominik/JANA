import React, { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function MarkdownNoteEditor({ content, onChange, lastSelectedItem }) {
  const [markdown, setMarkdown] = useState(content || "");

  // Update local state if parent content changes
  useEffect(() => {
    if (content !== markdown) setMarkdown(content || "");
  }, [content]);

  const handleSave = async () => {
    if (!lastSelectedItem) return alert("No file selected to save!");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/save-file-content`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_path: lastSelectedItem.id,
            content: markdown,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to save file");
      }

      alert("File saved successfully!");
      onChange(markdown);
    } catch (err) {
      console.error(err);
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px", borderBottom: "1px solid #ddd" }}>
        <button onClick={handleSave} style={{ marginRight: "8px" }}>💾 Save</button>
        <button onClick={() => setMarkdown(content || "")}>❌ Cancel</button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <SimpleMDE
          value={markdown}
          onChange={setMarkdown}
          options={{
            spellChecker: false,
            status: false,
            toolbar: ["bold", "italic", "heading", "quote", "unordered-list", "ordered-list", "link", "image", "preview"],
          }}
        />
      </div>
    </div>
  );
}
