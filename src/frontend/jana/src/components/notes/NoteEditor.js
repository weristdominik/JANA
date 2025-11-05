import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NoteEditor({ content, onChange, lastSelectedItem }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          keepMarks: false, // ensures new paragraphs don't inherit bold/italic
        },
      }),
    ],
    content: content || { type: "doc", content: [] }, // use prop content
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Re-set editor content if the parent fileContent changes
  useEffect(() => {
    if (!editor) return;
    if (!content) {
      editor.commands.clearContent();
      return;
    }

    // Avoid resetting content if it's the same
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return <div>Loading editor...</div>;

  // Toolbar button component
  const Button = ({ onClick, isActive, label }) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        margin: "0 4px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        background: isActive ? "#1976d2" : "#f5f5f5",
        color: isActive ? "#fff" : "#333",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  // Save function
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
      onChange(jsonContent); // update parent state
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
        marginTop: "20px",
        minHeight: "400px",
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
          flexWrap: "wrap",
          background: "#fafafa",
        }}
      >
        {/* Formatting buttons */}
        <Button
          label="B"
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Button
          label="I"
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Button
          label="• List"
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Button
          label="1. List"
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Button label="Save" onClick={handleSave} />
        <Button
          label="Cancel"
          onClick={() => editor.commands.setContent(content)}
        />
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <EditorContent
          editor={editor}
          style={{
            minHeight: "300px", // editor height
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "8px",
            overflowY: "auto",
          }}
        />
      </div>
    </div>
  );
}
