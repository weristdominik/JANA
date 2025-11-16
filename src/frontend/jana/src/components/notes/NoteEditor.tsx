// NoteEditor.tsx
import './styles.scss'

import React from 'react'
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

/* -----------------------------------------------
   Styled Round Button (same as your original)
------------------------------------------------- */
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
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}))

/* -----------------------------------------------
   DROPDOWN TOOLBAR
------------------------------------------------- */
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
        
        {/* ---------- FORMAT DROPDOWN ---------- */}
        <RoundButton onClick={openFormatMenu} endIcon={<ArrowDropDownIcon />}>
          Format
        </RoundButton>

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

        {/* ---------- HEADINGS DROPDOWN ---------- */}
        <RoundButton onClick={openHeadingMenu} endIcon={<ArrowDropDownIcon />}>
          Headings
        </RoundButton>

        <Menu open={Boolean(headingMenu)} anchorEl={headingMenu} onClose={closeAll}>
          {[1, 2, 3, 4, 5, 6].map(level => (
            <MenuItem
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            >
              <TitleIcon sx={{ mr: 1 }} /> Heading {level}
            </MenuItem>
          ))}
        </Menu>

        {/* ---------- BLOCK ELEMENTS DROPDOWN ---------- */}
        <RoundButton onClick={openBlockMenu} endIcon={<ArrowDropDownIcon />}>
          Blocks
        </RoundButton>

        <Menu open={Boolean(blockMenu)} anchorEl={blockMenu} onClose={closeAll}>
          <MenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
            Bullet List
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            Ordered List
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            Code Block
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            Blockquote
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            Horizontal Rule
          </MenuItem>
          <MenuItem onClick={() => editor.chain().focus().setHardBreak().run()}>
            Hard Break
          </MenuItem>
        </Menu>

        {/* ALWAYS VISIBLE BUTTONS */}
        <RoundButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear Marks
        </RoundButton>

        <RoundButton onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear Nodes
        </RoundButton>

        <RoundButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </RoundButton>

        <RoundButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </RoundButton>

      </div>
    </div>
  )
}

/* -----------------------------------------------
   FULL NOTE EDITOR WITH YOUR ORIGINAL CONTENT
------------------------------------------------- */
export default function NoteEditor() {
  const editor = useEditor({
    extensions: [TextStyleKit, StarterKit],
    content: `
      <h2>Hi there,</h2>
      <p>
        this is a <em>basic</em> example of <strong>Tiptap</strong>.
        Sure, there are all kinds of text styles you’d expect from a text editor.
      </p>
      <ul>
        <li>That's a bullet list with one …</li>
        <li>… or two list items.</li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable.
      </p>
      <pre><code class="language-css">body {
        display: none;
      }</code></pre>
      <blockquote>
        Wow, that’s amazing. Good work! 👏<br/>— Mom
      </blockquote>
    `,
  })

  return (
    <div>
      <MenuBar editor={editor} />

      <div style={{ marginTop: 20 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
