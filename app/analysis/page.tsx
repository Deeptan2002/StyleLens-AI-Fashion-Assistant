"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Shirt, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";

import ProgressSteps from "@/components/upload/ProgressSteps";
import PageHeader from "@/components/ui/PageHeader";
import StyleDNAProgress from "@/components/StyleDNAProgress";
import ProcessingAnimation from "@/components/analysis/ProcessingAnimation";
import OutfitProgress from "@/components/analysis/OutfitProgress";
import { useOnboarding } from "@/context/OnboardingContext";

export default function AnalysisPage() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState(0);
  const [totalOutfits, setTotalOutfits] = useState(0);

  const wardrobeSummary = () => {
    if (data.wardrobeMode === "photos") {
      const count = data.wardrobeFileIds?.length || data.wardrobeItems.length;
      return `${count} wardrobe item${count !== 1 ? 's' : ''} uploaded for comparison`;
    }

    if (data.wardrobeMode === "description") {
      return data.wardrobeDescription || "Description not provided";
    }

    if (data.wardrobeMode === "skip") {
      return "Wardrobe step skipped";
    }

    return "Not selected";
  };

  const handleStartAnalysis = async () => {
    // Validation
    if (!data.selfieFileId) {
      setError("Selfie is required. Please go back and upload a selfie.");
      return;
    }

    // Check for multiple wardrobe items (Smart Wardrobe Advisor)
    const fileIds = data.wardrobeFileIds && data.wardrobeFileIds.length > 0 
      ? data.wardrobeFileIds 
      : data.wardrobeFileId 
        ? [data.wardrobeFileId] 
        : [];

    if (fileIds.length === 0) {
      setError("Wardrobe item is required. Please upload at least one clothing item.");
      return;
    }

    setProcessing(true);
    setError(null);
    setTotalOutfits(fileIds.length);
    setCurrentOutfit(0);

    try {
      // Smart Wardrobe Advisor: Create multiple try-on tasks
      console.log(`Creating ${fileIds.length} try-on task(s)...`);
      
      const taskIds: string[] = [];
      const imageUrls: string[] = [];

      // Create try-on task for each wardrobe item
      for (let i = 0; i < fileIds.length; i++) {
        setCurrentOutfit(i + 1);
        const clothFileId = fileIds[i];
        console.log(`Processing item ${i + 1}/${fileIds.length}...`);

        // Step 1: Create try-on task
        const tryonResponse = await axios.post("/api/youcam/tryon", {
          selfieFileId: data.selfieFileId,
          clothFileId: clothFileId,
        });

        console.log(`Try-on response ${i + 1}:`, tryonResponse.data);
        const { taskId } = tryonResponse.data;
        taskIds.push(taskId);

        // Step 2: Poll for results
        console.log(`Polling task ${i + 1}:`, taskId);
        const taskResponse = await axios.get(`/api/youcam/task/${taskId}`);
        console.log(`Task response ${i + 1}:`, taskResponse.data);

        // Get the image URL
        const imageUrl = taskResponse.data.imageUrl || taskResponse.data.results?.url;
        console.log(`Image URL ${i + 1}:`, imageUrl);
        
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      // Store all results
      updateData({
        taskId: taskIds[0], // Keep first for legacy compatibility
        taskIds: taskIds,
        resultImageUrl: imageUrls[0], // Keep first for legacy
        resultImageUrls: imageUrls,
        isProcessing: false,
      });

      if (imageUrls.length > 0) {
        console.log(`Navigating to result with ${imageUrls.length} image(s)`);
        router.push("/result");
      } else {
        console.error("No image URLs generated");
        setError("No result images generated. Please try again.");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
      }
      setError(
        axios.isAxiosError(err) && err.response?.data?.details
          ? err.response.data.details
          : "Failed to process your style. Please try again."
      );
      updateData({ isProcessing: false });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition hover:text-indigo-600"
          disabled={processing}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <ProgressSteps currentStep={5} />

        <div className="mb-10">
          <PageHeader
            title="Review your Style DNA setup"
            description="We have everything we need to generate your personalised outfit recommendations. Review the details below, then start the analysis."
          />
        </div>

        <div className="mx-auto mb-8 max-w-3xl">
          <StyleDNAProgress />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {processing ? (
          /* Show Processing Animation */
          <div className="mx-auto max-w-3xl space-y-6">
            <ProcessingAnimation />
            
            {/* Show outfit-by-outfit progress for multiple items */}
            {totalOutfits > 1 && (
              <OutfitProgress 
                totalOutfits={totalOutfits}
                currentOutfit={currentOutfit}
                status={currentOutfit < totalOutfits ? "processing" : "complete"}
              />
            )}
          </div>
        ) : (
          /* Show Review Section */
          <>
            <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Camera size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Selfie</h2>
                <p className="text-sm text-slate-500">Your style profile photo</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {data.selfiePreview ? (
                <img
                  src={data.selfiePreview}
                  alt="Selfie preview"
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center text-slate-400">
                  No selfie uploaded
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Shirt size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Wardrobe</h2>
                <p className="text-sm text-slate-500">
                  Your clothes and wardrobe context
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-700">
              <p className="font-semibold text-slate-900">
                {data.wardrobeMode || "Not selected"}
              </p>
              <p className="mt-2 text-sm text-slate-600">{wardrobeSummary()}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              We will use this context to recommend outfits that fit your existing wardrobe.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Occasion</h2>
                <p className="text-sm text-slate-500">Where are you going?</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-700">
              <p className="text-lg font-semibold text-slate-900">
                {data.occasion || "Not selected"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
                <p className="text-sm text-slate-500">What matters most today?</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-700">
              {data.preferences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.preferences.map((pref) => (
                    <span
                      key={pref}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No preferences selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing Style DNA...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Start Analysis
              </>
            )}
          </button>
        </div>
          </>
        )}
      </div>
    </main>
  );
}