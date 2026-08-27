'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

/**
 * CKEditor 5 (classic build) behind a dynamic import so its ~0.5MB bundle
 * loads only when a rich-text field is actually opened. Output is HTML,
 * which the public Markdown renderer detects and renders as prose.
 */
const Editor = dynamic(
  async () => {
    const [{ CKEditor }, { default: ClassicEditor }] = await Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('@ckeditor/ckeditor5-build-classic'),
    ]);
    function Wrapped({ value, onChange }: { value: string; onChange: (html: string) => void }) {
      return (
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={(_event, editor) => onChange(editor.getData())}
          config={{
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'blockQuote',
              'insertTable',
              'undo',
              'redo',
            ],
            placeholder: 'Write the post…',
          }}
        />
      );
    }
    return Wrapped;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-xl border border-line-strong bg-ink text-sm text-fg-soft">
        Loading editor…
      </div>
    ),
  },
);

export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  // Stable key so CKEditor doesn't remount on every keystroke.
  const key = useMemo(() => Math.random().toString(36).slice(2), []);
  return (
    <div className="admin-ck" key={key}>
      <Editor value={value} onChange={onChange} />
    </div>
  );
}
