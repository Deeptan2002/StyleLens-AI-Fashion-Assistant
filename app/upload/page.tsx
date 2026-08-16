"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import ProgressSteps from "@/components/upload/ProgressSteps";
import UploadCard from "@/components/upload/UploadCard";
import ImageDropzone from "@/components/upload/ImageDropzone";
import UploadPreview from "@/components/upload/UploadPreview";
import Button from "@/components/ui/Button";
import { useOnboarding } from "@/context/OnboardingContext";
import { Home } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [image, setImage] = useState<string | null>(
    data.selfiePreview
  );
  const [gender, setGender] = useState<string>(data.gender || "");
  const [ageRange, setAgeRange] = useState<string>(data.ageRange || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File size limit: 5MB (recommended for web uploads)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size (redundant check, but keeping for safety)
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size too large! Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Please compress or use a smaller image.`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);

      setImage(dataUrl);
      setError(null);

      updateData({
        selfieFile: file,
        selfiePreview: dataUrl,
      });
    } catch (error) {
      console.error("Unable to read image:", error);
      setError("Failed to read image");
    }
  };

  const handleDropRejected = (errorMessage: string) => {
    setError(errorMessage);
  };

  const removeImage = () => {
    setImage(null);
    setError(null);

    updateData({
      selfieFile: null,
      selfiePreview: null,
      selfieFileId: undefined,
    });
  };

  const handleContinue = async () => {
    if (!data.selfieFile) return;
    
    // Validate profile selections
    if (!gender || !ageRange) {
      setError("Please select your gender and age range to continue.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload to Perfect Corp via our API
      const formData = new FormData();
      formData.append("file", data.selfieFile);

      const response = await axios.post("/api/youcam/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { fileId } = response.data;

      // Store the fileId AND profile data in context
      updateData({
        selfieFileId: fileId,
        gender: gender as any,
        ageRange: ageRange as any,
      });

      // Navigate to wardrobe
      router.push("/upload/wardrobe");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload selfie. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition hover:text-indigo-600"
        >
          <Home size={18} />
          Home
        </Link>

        <ProgressSteps currentStep={1} />

        <UploadCard
          title="Upload Your Selfie"
          description="Upload a clear photo of yourself. We'll analyse your style to create personalised outfit recommendations. Your image is only used to generate your style profile."
        >
          {/* File Size Info */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-slate-600">
              📌 <strong>File Requirements:</strong> Maximum 5MB. Accepted formats: JPG, PNG, WebP.
            </p>
          </div>

          {/* Error Display - Always visible */}
          {error && (
            <div className="mb-4 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">Upload Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm font-medium text-red-600 underline hover:text-red-800"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {image ? (
            <div className="space-y-6">
              <UploadPreview image={image} onRemove={removeImage} />

              {/* Profile Questions */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-900">Help us personalize your style</h3>
                
                {/* Gender Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Age Range Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Age Range
                  </label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select age range</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>

                <p className="text-xs text-slate-500">
                  This helps us provide style recommendations tailored to your demographic and preferences.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={uploading || !gender || !ageRange}
                  className="rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Continue"}
                </button>
              </div>
            </div>
          ) : (
            <ImageDropzone 
              onDrop={handleDrop}
              onDropRejected={handleDropRejected}
            />
          )}
        </UploadCard>
      </div>
    </main>
  );
}