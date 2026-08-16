"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import ProgressBar from "@/components/ui/ProgressBar";

export default function StyleDNAProgress() {
  const { data } = useOnboarding();

  let progress = 0;

  if (data.selfieFile) progress += 20;

  if (
    data.wardrobeMode === "skip" ||
    data.wardrobeDescription.trim().length > 0 ||
    data.wardrobeItems.length > 0
  ) {
    progress += 20;
  }

  if (data.occasion) progress += 20;
  if (data.preferences.length > 0) progress += 20;

  // Reserve the final 20% for AI analysis completion
  progress += 20;

  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Style DNA Profile
          </h3>
          <p className="text-sm text-slate-500">
            Complete your profile for better recommendations.
          </p>
        </div>

        <span className="text-2xl font-black text-indigo-600">
          {progress}%
        </span>
      </div>

      <ProgressBar value={progress} />
    </div>
  );
}