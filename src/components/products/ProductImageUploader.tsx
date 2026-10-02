'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { useUploadProductImage } from '@/lib/hooks/useProducts';
import { toast } from 'sonner';
import { normalizeApiError } from '@/lib/api/client';

export function ProductImageUploader({ productId, currentImageUrl }: { productId: string; currentImageUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadProductImage();
  const [preview, setPreview] = useState<string | null>(currentImageUrl);

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    try {
      const updated = await uploadImage.mutateAsync({ id: productId, file });
      setPreview(updated.imageUrl);
      toast.success('Image updated');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
      setPreview(currentImageUrl);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">Product image</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-50 hover:border-brand"
      >
        {preview ? (
          <Image src={preview} alt="" fill className="object-cover" />
        ) : (
          <Upload className="h-5 w-5 text-ink-faint" />
        )}
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


