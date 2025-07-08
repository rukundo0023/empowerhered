import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';

interface TiptapEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Youtube.configure({ controls: true, width: 480, height: 280 }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor in sync with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  return (
    <div className="border rounded bg-white">
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'font-bold text-blue-700' : ''}>Bold</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'italic text-blue-700' : ''}>Italic</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" onClick={() => {
          const url = prompt('Enter URL');
          if (url) editor?.chain().focus().setLink({ href: url }).run();
        }}>Link</button>
        <button type="button" onClick={() => {
          const url = prompt('Image URL');
          if (url) editor?.chain().focus().setImage({ src: url }).run();
        }}>Image</button>
        <button type="button" onClick={() => {
          const url = prompt('YouTube URL');
          if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
        }}>YouTube</button>
        <button type="button" onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>
      </div>
      <EditorContent editor={editor} className="p-2 min-h-[120px]" />
    </div>
  );
};

export default TiptapEditor; 