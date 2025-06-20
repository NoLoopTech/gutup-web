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
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean; 
  initialContent?: string;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ value, onChange, disabled = false, initialContent = '' }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    const container = editorRef.current;
    if (
      container &&
      !quillRef.current &&
      container.querySelector('.ql-toolbar') === null
    ) {
      quillRef.current = new Quill(container, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
        placeholder: !disabled ? 'Write something...' : '',
          readOnly: disabled,
      });

        quillRef.current.on('text-change', () => {
          if (onChange && quillRef.current) {
            onChange(quillRef.current.root.innerHTML);
          }
        });
      }
    }, [onChange, disabled]);

    // Set the initial content if provided
    useEffect(() => {
      if (quillRef.current && initialContent !== quillRef.current.root.innerHTML) {
        quillRef.current.root.innerHTML = initialContent;
      }
    }, [initialContent]);

        // Add an event listener for content changes in the Quill editor
        quillRef.current.on("text-change", () => {
          if (quillRef.current) {
            const content = quillRef.current.root.innerHTML
            if (onChange) {
              onChange(content) // Notify the parent with the updated content
            }
          }
        })
      }

      return () => {}
    }, [onChange, initialContent, disabled]) // Only re-run the effect if onChange, initialContent, or disabled changes

    // Expose the getContent function to the parent component
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML // Return the HTML content
        }
        return ""
      }
    }))

    useEffect(() => {
      // When 'disabled' is set, ensure to hide toolbar and make the editor read-only
      const container = editorRef.current
      if (container && quillRef.current) {
        const toolbar = container.querySelector(".ql-toolbar")
        if (toolbar) {
          if (disabled) {
            toolbar.style.display = "none" // Hide the toolbar
          } else {
            toolbar.style.display = "" // Show the toolbar if not disabled
          }
        }
        quillRef.current.enable(!disabled) // Enable or disable the editor based on 'disabled'
      }
    }, [disabled]) // Re-run when 'disabled' changes

    return (
      <>
        <div
          className={`${disabled ? "cursor-not-allowed" : ""}`}
          ref={editorRef}
          style={{
            height: "300px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px"
          }}
        />
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
