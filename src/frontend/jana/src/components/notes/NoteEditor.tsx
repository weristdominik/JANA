import './styles.scss'
import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Menu, MenuItem, Button, Divider } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import CodeIcon from '@mui/icons-material/Code'
import TitleIcon from '@mui/icons-material/Title'
import { styled } from '@mui/material/styles'
import theme from '../../theme/theme'

const RoundButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.custom?.roundButton.bgcolor,
  color: theme.custom?.roundButton.color,
  borderRadius: 20,
  textTransform: 'none',
  marginRight: 8,
  minWidth: 72,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.custom?.roundButton['&:hover']?.bgcolor,
    color: theme.custom?.roundButton['&:hover']?.color,
  },
  '&.is-active': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  '&.Mui-disabled': { opacity: 0.5 },
}))

// ------------------------ MENU BAR ------------------------
function MenuBar({ editor }: { editor: any }) {
  const [formatMenu, setFormatMenu] = React.useState<null | HTMLElement>(null)
  const [headingMenu, setHeadingMenu] = React.useState<null | HTMLElement>(null)
  const [blockMenu, setBlockMenu] = React.useState<null | HTMLElement>(null)

  if (!editor) return null
  const openFormatMenu = (e: any) => setFormatMenu(e.currentTarget)
  const openHeadingMenu = (e: any) => setHeadingMenu(e.currentTarget)
  const openBlockMenu = (e: any) => setBlockMenu(e.currentTarget)
  const closeAll = () => {
    setFormatMenu(null)
    setHeadingMenu(null)
    setBlockMenu(null)
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <RoundButton onClick={openFormatMenu} endIcon={<ArrowDropDownIcon />}>Format</RoundButton>
        <Menu open={Boolean(formatMenu)} anchorEl={formatMenu} onClose={closeAll}>
          <MenuItem onClick={() => editor.chain().focus().toggleBold().run()}>
            <FormatBoldIcon sx={{ mr: 1 }} /> Bold
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleItalic().run()}>
            <FormatItalicIcon sx={{ mr: 1 }} /> Italic
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleStrike().run()}>
            <StrikethroughSIcon sx={{ mr: 1 }} /> Strike
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleCode().run()}>
            <CodeIcon sx={{ mr: 1 }} /> Inline Code
          </MenuItem>
        </Menu>

        <RoundButton onClick={openHeadingMenu} endIcon={<ArrowDropDownIcon />}>Headings</RoundButton>
        <Menu open={Boolean(headingMenu)} anchorEl={headingMenu} onClose={closeAll}>
          {[1,2,3,4,5,6].map(level => (
            <MenuItem key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
              <TitleIcon sx={{ mr: 1 }} /> Heading {level}
            </MenuItem>
          ))}
        </Menu>

        <RoundButton onClick={openBlockMenu} endIcon={<ArrowDropDownIcon />}>Blocks</RoundButton>
        <Menu open={Boolean(blockMenu)} anchorEl={blockMenu} onClose={closeAll}>
          <MenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered List</MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code Block</MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>Blockquote</MenuItem>
          <Divider />
          <MenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal Rule</MenuItem>
          <MenuItem onClick={() => editor.chain().focus().setHardBreak().run()}>Hard Break</MenuItem>
        </Menu>

        <RoundButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear Marks</RoundButton>
        <RoundButton onClick={() => editor.chain().focus().clearNodes().run()}>Clear Nodes</RoundButton>
        <RoundButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>Undo</RoundButton>
        <RoundButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>Redo</RoundButton>
      </div>
    </div>
  )
}

// ------------------------ NOTE EDITOR ------------------------
export default function NoteEditor({ fileContent, fileId }: { fileContent: any; fileId: string }) {
  const editor = useEditor({
    extensions: [TextStyleKit, StarterKit],
    content: fileContent || { type: 'doc', content: [] }, // fallback empty JSON
  })

  // Load new content when fileContent changes
  useEffect(() => {
    if (editor && fileContent) {
      editor.commands.setContent(fileContent)
    }
  }, [fileContent, editor])

  // Save JSON to backend whenever content changes
  const handleSave = async () => {
    if (!editor) return
    const jsonContent = editor.getJSON()
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/save-file-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: fileId, content: jsonContent }),
      })
      alert('Saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save content')
    }
  }

  return (
    <div>
      <MenuBar editor={editor} />
      <div style={{ marginTop: 20 }}>
        <EditorContent editor={editor} />
      </div>
      <div style={{ marginTop: 10 }}>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}
