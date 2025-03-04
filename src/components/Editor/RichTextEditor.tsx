/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
"use client"

import { useCallback, useEffect, useState } from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import { extensions } from "@/lib/tiptap/extensions"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/lib/ImageUpload"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Link,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Table,
  Youtube,
  Superscript,
  Subscript,
  Highlighter,
  CheckSquare,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (value: string) => void
  dir?: "ltr" | "rtl"
  placeholder?: string
}

export function RichTextEditor({ content, onChange, dir = "ltr" }: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] p-4",
        dir,
        spellcheck: "false",
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    onUpdate: useCallback(
      debounce(({ editor }) => {
        if (editor) {
          onChange(editor.getHTML())
        }
      }, 500),
      [onChange]
    ),
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6) => {
      editor?.chain().focus().toggleHeading({ level }).run()
    },
    [editor],
  )

  if (!editor || !isMounted) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="border-b p-2 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBold().run()
          }}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("underline") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleUnderline().run()
          }}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("strike") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleStrike().run()
          }}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            toggleHeading(1)
          }}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            toggleHeading(2)
          }}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            toggleHeading(3)
          }}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 4 }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            toggleHeading(4)
          }}
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 5 }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            toggleHeading(5)
          }}
        >
          <Heading5 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 6 }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            toggleHeading(6)
          }}
        >
          <Heading6 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBulletList().run()
          }}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleOrderedList().run()
          }}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("taskList") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleTaskList().run()
          }}
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("code") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleCode().run()
          }}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("link") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            setLink()
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" variant="outline">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <ImageUpload
              onUpload={(url) => {
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                }
                setShowImageDialog(false)
              }}
            />
          </DialogContent>
        </Dialog>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.preventDefault()
            const url = prompt("Enter YouTube URL")
            if (url) {
              editor.chain().focus().setYoutubeVideo({ src: url }).run()
            }
          }}
        >
          <Youtube className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().setTextAlign("left").run()
          }}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().setTextAlign("center").run()
          }}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().setTextAlign("right").run()
          }}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("superscript") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleSuperscript().run()
          }}
        >
          <Superscript className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("subscript") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleSubscript().run()
          }}
        >
          <Subscript className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("highlight") ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHighlight().run()
          }}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }}
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={editor} className="p-4" />

      {editor && isMounted && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor }) => {
            // Only show bubble menu when text is selected
            return !editor.state.selection.empty
          }}
        >
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("bold") ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleBold().run()
            }}
            className="rounded-none"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("italic") ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleItalic().run()
            }}
            className="rounded-none"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("strike") ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleStrike().run()
            }}
            className="rounded-none"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("link") ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault()
              setLink()
            }}
            className="rounded-none"
          >
            <Link className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}
    </div>
  )
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

