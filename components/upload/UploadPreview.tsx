"use client";

import { X } from "lucide-react";

interface UploadPreviewProps {
  image: string;
  onRemove: () => void;
}

export default function UploadPreview({
  image,
  onRemove,
}: UploadPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <img
        src={image}
        alt="Selfie preview"
        className="h-80 w-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition hover:scale-105"
        aria-label="Remove image"
      >
        <X size={18} className="text-red-500" />
      </button>
    </div>
  );
}