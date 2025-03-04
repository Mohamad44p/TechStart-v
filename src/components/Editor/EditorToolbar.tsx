/* eslint-disable jsx-a11y/alt-text */
import { type Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Image,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
} from 'lucide-react'
import { Button } from '../ui/button'

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="border-b p-2 flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant={editor!.isActive('italic') ? 'default' : 'outline'}
        onClick={() => editor!.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('underline') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor!.isActive('strike') ? 'default' : 'outline'}
        onClick={() => editor!.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor!.isActive('code') ? 'default' : 'outline'}
        onClick={() => editor!.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor!.isActive('link') ? 'default' : 'outline'}
        onClick={() => {
          const url = window.prompt('Enter URL')
          if (url) {
            editor!.chain().focus().setLink({ href: url }).run()
          }
        }}
      >
        <Link className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          const url = window.prompt('Enter image URL')
          if (url) {
            editor!.chain().focus().setImage({ src: url }).run()
          }
        }}
      >
        <Image className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          const url = window.prompt('Enter YouTube URL')
          if (url) {
            editor!.chain().focus().setYoutubeVideo({ src: url }).run()
          }
        }}
      >
        <Video className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor!.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
        onClick={() => editor!.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor!.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
        onClick={() => editor!.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor!.isActive('bulletList') ? 'default' : 'outline'}
        onClick={() => editor!.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => editor!.chain().focus().insertTable().run()}
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  )
}
