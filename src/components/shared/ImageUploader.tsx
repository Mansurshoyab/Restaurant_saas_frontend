'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';

export function ImageUploader({
  currentUrl,
  onUpload,
  isUploading,
}: {
  currentUrl?: string | null;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  const handleFile = (file: File) => {
    setPreview(URL.createObjectURL(file));
    onUpload(file);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-50 hover:border-brand disabled:opacity-60"
      >
        {preview ? <Image src={preview} alt="" fill className="object-cover" /> : <Upload className="h-5 w-5 text-ink-faint" />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}


