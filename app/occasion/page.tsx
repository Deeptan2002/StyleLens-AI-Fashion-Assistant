"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Heart,
  Plane,
  Coffee,
  PartyPopper,
  GraduationCap,
  ArrowLeft,
  Home,
} from "lucide-react";
import Link from "next/link";

import ProgressSteps from "@/components/upload/ProgressSteps";
import OccasionCard from "@/components/occasion/OccasionCard";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OccasionPage() {
  const router = useRouter();

  const { updateData } = useOnboarding();

  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedOccasion) return;

    // Save selected occasion globally
    updateData({
      occasion: selectedOccasion,
    });

    // Navigate to next step
    router.push("/preferences");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
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

        {/* Progress */}
        <ProgressSteps currentStep={3} />

        {/* Heading */}
        <h1 className="text-center text-4xl font-black text-slate-900">
          What's your plan today?
        </h1>

        <p className="mt-4 text-center text-lg text-slate-600">
          Your selection shapes our AI styling recommendations.
        </p>

        {/* Occasion Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <OccasionCard
            title="Office"
            description="Professional and polished"
            icon={<Briefcase size={28} />}
            selected={selectedOccasion === "Office"}
            onClick={() => setSelectedOccasion("Office")}
          />

          <OccasionCard
            title="Date Night"
            description="Look your best"
            icon={<Heart size={28} />}
            selected={selectedOccasion === "Date Night"}
            onClick={() => setSelectedOccasion("Date Night")}
          />

          <OccasionCard
            title="Travel"
            description="Comfort meets style"
            icon={<Plane size={28} />}
            selected={selectedOccasion === "Travel"}
            onClick={() => setSelectedOccasion("Travel")}
          />

          <OccasionCard
            title="Casual"
            description="Everyday wear"
            icon={<Coffee size={28} />}
            selected={selectedOccasion === "Casual"}
            onClick={() => setSelectedOccasion("Casual")}
          />

          <OccasionCard
            title="Party"
            description="Stand out confidently"
            icon={<PartyPopper size={28} />}
            selected={selectedOccasion === "Party"}
            onClick={() => setSelectedOccasion("Party")}
          />

          <OccasionCard
            title="College"
            description="Relaxed and trendy"
            icon={<GraduationCap size={28} />}
            selected={selectedOccasion === "College"}
            onClick={() => setSelectedOccasion("College")}
          />
        </div>

        {/* Continue Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedOccasion}
            className={`rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-all duration-200 ${
              selectedOccasion
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}