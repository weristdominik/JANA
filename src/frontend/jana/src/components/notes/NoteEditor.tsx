// NoteEditor.tsx
import './styles.scss'

import React from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'

import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import theme from '../../theme/theme'

const extensions = [TextStyleKit, StarterKit]

// Styled RoundButton using theme.custom.roundButton colors
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

function MenuBar({ editor }: { editor: any }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold') ?? false,
      canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor.isActive('italic') ?? false,
      canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
      isStrike: ctx.editor.isActive('strike') ?? false,
      canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
      isCode: ctx.editor.isActive('code') ?? false,
      canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
      canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
      isParagraph: ctx.editor.isActive('paragraph') ?? false,
      isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
      isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
      isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
      isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
      isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
      isBulletList: ctx.editor.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor.isActive('orderedList') ?? false,
      isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
      isBlockquote: ctx.editor.isActive('blockquote') ?? false,
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,
    }),
  })

  return (
    <div className="control-group">
      <div className="button-group">
        <RoundButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? 'is-active' : ''}
        >
          Bold
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? 'is-active' : ''}
        >
          Italic
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? 'is-active' : ''}
        >
          Strike
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? 'is-active' : ''}
        >
          Code
        </RoundButton>
        <RoundButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </RoundButton>
        <RoundButton onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? 'is-active' : ''}
        >
          Paragraph
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.isHeading1 ? 'is-active' : ''}
        >
          H1
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.isHeading2 ? 'is-active' : ''}
        >
          H2
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState.isHeading3 ? 'is-active' : ''}
        >
          H3
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editorState.isHeading4 ? 'is-active' : ''}
        >
          H4
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editorState.isHeading5 ? 'is-active' : ''}
        >
          H5
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editorState.isHeading6 ? 'is-active' : ''}
        >
          H6
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}
        >
          Bullet list
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}
        >
          Ordered list
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? 'is-active' : ''}
        >
          Code block
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? 'is-active' : ''}
        >
          Blockquote
        </RoundButton>
        <RoundButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </RoundButton>
        <RoundButton onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </RoundButton>
        <RoundButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </RoundButton>
      </div>
    </div>
  )
}

export default function NoteEditor() {
  const editor = useEditor({
    extensions,
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre><code class="language-css">body {
        display: none;
      }</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
    `,
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
