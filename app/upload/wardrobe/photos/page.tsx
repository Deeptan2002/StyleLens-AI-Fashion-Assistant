"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, Plus, Trash2, Home } from "lucide-react";
import Link from "next/link";

import ProgressSteps from "@/components/upload/ProgressSteps";
import PageHeader from "@/components/ui/PageHeader";
import StyleDNAProgress from "@/components/StyleDNAProgress";
import { useOnboarding } from "@/context/OnboardingContext";
import type { WardrobeItem } from "@/types/wardrobe";

export default function WardrobePhotosPage() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [items, setItems] = useState<WardrobeItem[]>(
    data.wardrobeItems || []
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File size limit: 5MB per image
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  useEffect(() => {
    setItems(data.wardrobeItems || []);
  }, [data.wardrobeItems]);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as data URL."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file."));
      };

      reader.readAsDataURL(file);
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      // Validate file sizes
      const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE);
      
      if (oversizedFiles.length > 0) {
        const fileList = oversizedFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(1)}MB)`).join(', ');
        setUploadError(`File(s) too large: ${fileList}. Maximum size is 5MB per image. Please compress or use smaller images.`);
        
        // Only process files that are under the limit
        acceptedFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        
        if (acceptedFiles.length === 0) {
          return; // All files were too large
        }
      } else {
        setUploadError(null); // Clear any previous errors
      }

      const newItems: WardrobeItem[] = await Promise.all(
        acceptedFiles.map(async (file) => ({
          id: crypto.randomUUID(),
          file,
          preview: await fileToDataUrl(file),
        }))
      );

      const updated = [...items, ...newItems];
      setItems(updated);

      updateData({
        wardrobeMode: "photos",
        wardrobeItems: updated,
        wardrobeDescription: "",
      });
    } catch (error) {
      console.error("Unable to read wardrobe images:", error);
      setUploadError("Failed to read images. Please try again.");
    }
  };

  const removeItem = (id: string) => {
    const updated = items.filter((entry) => entry.id !== id);
    setItems(updated);

    updateData({
      wardrobeMode: "photos",
      wardrobeItems: updated,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": ['.jpg', '.jpeg', '.png', '.webp'],
    },
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (fileRejections) => {
      const errors = fileRejections.map(rejection => {
        const errorMessages = rejection.errors.map(e => {
          if (e.code === 'file-too-large') {
            return `${rejection.file.name}: File too large (${(rejection.file.size / (1024 * 1024)).toFixed(1)}MB). Max 5MB.`;
          }
          if (e.code === 'file-invalid-type') {
            return `${rejection.file.name}: Invalid file type. Only JPG, PNG, and WebP images are allowed.`;
          }
          return e.message;
        });
        return errorMessages.join(' ');
      });
      setUploadError(errors.join(' '));
    },
  });

  const handleContinue = async () => {
    // Upload up to 3 wardrobe items for Smart Wardrobe Advisor feature
    if (items.length > 0) {
      try {
        // Limit to 3 items for comparison
        const itemsToUpload = items.slice(0, 3);
        const uploadedFileIds: string[] = [];

        // Upload each item to Perfect Corp
        for (const item of itemsToUpload) {
          if (item.file) {
            const formData = new FormData();
            formData.append("file", item.file);

            const response = await fetch("/api/youcam/upload", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const { fileId } = await response.json();
              uploadedFileIds.push(fileId);
            }
          }
        }

        // Update context with all uploaded file IDs
        updateData({
          wardrobeMode: "photos",
          wardrobeItems: itemsToUpload,
          wardrobeDescription: "",
          wardrobeFileId: uploadedFileIds[0], // Keep for legacy compatibility
          wardrobeFileIds: uploadedFileIds, // New: multiple file IDs
        });
      } catch (error) {
        console.error("Failed to upload wardrobe items:", error);
      }
    }

    router.push("/occasion");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 transition hover:text-indigo-600"
          >
            <Home size={18} />
            Home
          </Link>
        </div>

        <ProgressSteps currentStep={2} />

        <div className="mb-10">
          <PageHeader
            title="Upload your clothes"
            description="Add the items you already own so we can recommend outfits that fit your wardrobe."
          />
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              ✨ <strong>Smart Wardrobe Advisor:</strong> Upload 2-3 items to see them all tried on, ranked by AI, 
              and get styling tips for the best match!
            </p>
          </div>
        </div>

        <div className="mx-auto mb-8 max-w-3xl">
          <StyleDNAProgress />
        </div>

        {/* Error Message Display */}
        {uploadError && (
          <div className="mx-auto mb-6 max-w-3xl rounded-2xl border-2 border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Upload Error</h3>
                <p className="mt-1 text-sm text-red-700">{uploadError}</p>
                <button
                  onClick={() => setUploadError(null)}
                  className="mt-2 text-sm font-medium text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Size Info Banner */}
        <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            📌 <strong>File Requirements:</strong> Maximum 5MB per image. Accepted formats: JPG, PNG, WebP.
            {items.length > 0 && (
              <span className="ml-1 text-indigo-600 font-semibold">
                • {items.length} item{items.length !== 1 ? 's' : ''} uploaded
              </span>
            )}
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`mt-10 cursor-pointer rounded-3xl border-2 border-dashed bg-white p-10 text-center shadow-sm transition hover:border-indigo-500 ${
            isDragActive
              ? "border-indigo-600 bg-indigo-50"
              : "border-indigo-200"
          }`}
        >
          <input {...getInputProps()} />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Plus size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            {isDragActive ? "Drop the images here" : "Drag & drop clothes"}
          </h2>

          <p className="mt-3 text-slate-500">
            Upload shirts, trousers, shoes, jackets or accessories. You can add
            multiple items.
          </p>

          <button
            type="button"
            className="mt-8 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Browse Files
          </button>
        </div>

        {items.length > 0 && (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <img
                    src={item.preview}
                    alt="Wardrobe item preview"
                    className="h-56 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition hover:scale-105"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}