"use client"

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css" // Import Quill styles

// Define the ref type for the RichTextEditor component
export interface RichTextEditorHandle {
  getContent: () => string
}
interface RichTextEditorProps {
  onChange: (value: string) => void
  disabled?: boolean
  initialContent?: string
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ onChange, disabled = false, initialContent = "" }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    useEffect(() => {
      const container = editorRef.current
      if (
        container &&
        !quillRef.current &&
        container.querySelector(".ql-toolbar") === null
      ) {
        quillRef.current = new Quill(container, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"]
            ]
          },
          placeholder: !disabled ? "Write something..." : "",
          readOnly: disabled
        })

        quillRef.current.on("text-change", () => {
          if (onChange && quillRef.current) {
            onChange(quillRef.current.root.innerHTML)
          }
        })
      }
    }, [onChange, disabled])

    // Set the initial content if provided
    useEffect(() => {
      if (
        quillRef.current &&
        initialContent !== quillRef.current.root.innerHTML
      ) {
        quillRef.current.root.innerHTML = initialContent
      }
    }, [initialContent])

    // Expose the getContent function to the parent component
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML // Return the HTML content
        }
        return ""
      }
    }))

    return (
      <>
        <div
          ref={editorRef}
          style={{
            height: "300px",
            // If you’d like the editor container itself to also have a bottom radius:
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px"
          }}
        />
        {/* Global CSS override: add 10px top-left & top-right radius to the toolbar */}
        <style jsx global>{`
          .ql-toolbar {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
        `}</style>
      </>
    )
  }
)

RichTextEditor.displayName = "RichTextEditor"
export default RichTextEditor
