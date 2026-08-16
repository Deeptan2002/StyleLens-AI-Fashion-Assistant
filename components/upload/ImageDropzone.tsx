"use client";

import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { ImagePlus } from "lucide-react";

interface ImageDropzoneProps {
  onDrop: (files: File[]) => void;
  onDropRejected?: (message: string) => void;
  multiple?: boolean;
}

export default function ImageDropzone({
  onDrop,
  onDropRejected,
  multiple = false,
}: ImageDropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const handleDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (!onDropRejected) return;

      const rejection = fileRejections[0];
      if (!rejection) return;

      const file = rejection.file;
      const errors = rejection.errors;

      // Check for file size error
      const sizeError = errors.find((e) => e.code === "file-too-large");
      if (sizeError) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        onDropRejected(
          `File size too large! Maximum size is 5MB. Your file is ${fileSizeMB}MB. Please compress or use a smaller image.`
        );
        return;
      }

      // Check for file type error
      const typeError = errors.find((e) => e.code === "file-invalid-type");
      if (typeError) {
        onDropRejected(
          `Invalid file type. Please upload a PNG, JPG, or JPEG image.`
        );
        return;
      }

      // Generic error
      onDropRejected(`Unable to upload file. Please try a different image.`);
    },
    [onDropRejected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-3xl border-2 border-dashed p-12 transition-all duration-300 ${
        isDragActive
          ? "border-indigo-600 bg-indigo-50"
          : "border-slate-300 bg-slate-50 hover:border-indigo-500 hover:bg-white"
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center">

        <ImagePlus
          size={64}
          className="text-indigo-600"
        />

        <h3 className="mt-6 text-2xl font-bold">
          {isDragActive
            ? "Drop your image here"
            : "Drag & Drop your image"}
        </h3>

        <p className="mt-3 text-center text-slate-500">
          PNG, JPG or JPEG
          <br />
          Maximum size 5 MB
        </p>

        <button
          type="button"
          className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white"
        >
          Browse Files
        </button>

      </div>
    </div>
  );
}