'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

// Define the ref type for the RichTextEditor component
export interface RichTextEditorHandle {
  getContent: () => string;
}
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({ value, onChange }, ref) => {
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
        placeholder: 'Write something...',
      });

        quillRef.current.on('text-change', () => {
          if (onChange && quillRef.current) {
            onChange(quillRef.current.root.innerHTML);
          }
        });
      }
    }, [onChange]);

    useEffect(() => {
      if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        quillRef.current.root.innerHTML = value;
      }
    }, [value]);

  // Expose the getContent function to the parent component
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML; // Return the HTML content
      }
      return '';
    },
  }));

  return (
    <>
      <div
        ref={editorRef}
        style={{
          height: '300px',
          // If you’d like the editor container itself to also have a bottom radius:
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
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
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
