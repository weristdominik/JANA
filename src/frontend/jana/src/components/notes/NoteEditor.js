import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// 🧩 MUI Icons (outlined/rounded for lighter look)
import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function NoteEditor({ content, onChange, lastSelectedItem }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { keepMarks: false },
      }),
    ],
    content: content || { type: "doc", content: [] },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  // Re-set editor content when parent content changes
  useEffect(() => {
    if (!editor) return;
    if (!content) {
      editor.commands.clearContent();
      return;
    }

    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return <div>Loading editor...</div>;

  // 🧠 Toolbar button
  const Button = ({ onClick, isActive, children, title }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: "4px 6px",
        margin: "0 4px 6px 0",
        borderRadius: "6px",
        border: "1px solid #f9c423ff",
        background: "transparent", // 🔹 no gray background
        color: isActive ? "#f9c423ff" : "#333", // active uses gold
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#fff6d6")}
      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );

  // 💾 Save
  const handleSave = async () => {
    if (!lastSelectedItem) return alert("No file selected to save!");
    const jsonContent = editor.getJSON();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/save-file-content`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_path: lastSelectedItem.id,
            content: JSON.stringify(jsonContent),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to save file");
      }

      alert("File saved successfully!");
      onChange(jsonContent);
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Save failed: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
        marginTop: "0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          borderBottom: "1px solid #ddd",
          padding: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafafa",
          flexWrap: "wrap",
        }}
      >
        {/* Left side buttons */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Button
            title="Bold"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldOutlinedIcon />
          </Button>

          <Button
            title="Italic"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicOutlinedIcon />
          </Button>

          <Button
            title="Bullet List"
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedOutlinedIcon />
          </Button>

          <Button
            title="Numbered List"
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedOutlinedIcon />
          </Button>
        </div>

        {/* Right side buttons */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button title="Save" onClick={handleSave}>
            <SaveOutlinedIcon />
          </Button>
          <Button
            title="Cancel"
            onClick={() => editor.commands.setContent(content)}
          >
            <CloseOutlinedIcon />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <EditorContent
          editor={editor}
          style={{
            minHeight: "300px",
            border: "none",
            borderRadius: "0px",
            padding: "8px",
            overflowY: "auto",
          }}
        />
      </div>
    </div>
  );
}
