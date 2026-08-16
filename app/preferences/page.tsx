"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  DollarSign,
  Flower2,
  HeartHandshake,
  Leaf,
  Sparkles,
  ThermometerSun,
  Footprints,
  Home,
} from "lucide-react";
import Link from "next/link";

import ProgressSteps from "@/components/upload/ProgressSteps";
import PageHeader from "@/components/ui/PageHeader";
import Chip from "@/components/ui/Chip";
import StyleDNAProgress from "@/components/StyleDNAProgress";
import { useOnboarding } from "@/context/OnboardingContext";

const preferenceOptions = [
  { label: "Comfort", icon: Footprints },
  { label: "Professional", icon: BriefcaseBusiness },
  { label: "Budget-Friendly", icon: DollarSign },
  { label: "Trendy", icon: Sparkles },
  { label: "Weather-Appropriate", icon: ThermometerSun },
  { label: "Sustainable", icon: Leaf },
  { label: "Minimalist", icon: Flower2 },
  { label: "Luxury", icon: HeartHandshake },
];

export default function PreferencesPage() {
  const router = useRouter();
  const { updateData } = useOnboarding();

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const togglePreference = (label: string) => {
    setSelectedPreferences((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const handleContinue = () => {
    updateData({
      preferences: selectedPreferences,
    });

    router.push("/analysis");
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

        <ProgressSteps currentStep={4} />

        <div className="mb-10">
          <PageHeader
            title="What matters most today?"
            description="Choose the style priorities that should shape your outfit recommendations."
          />
        </div>

        <div className="mx-auto mb-10 max-w-3xl">
          <StyleDNAProgress />
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {preferenceOptions.map(({ label, icon: Icon }) => {
              const selected = selectedPreferences.includes(label);

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => togglePreference(label)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                    selected
                      ? "border-indigo-600 bg-indigo-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-indigo-400"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">{label}</p>
                    <p className="text-sm text-slate-500">
                      {selected ? "Selected" : "Tap to add"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Selected preferences:{" "}
            <span className="font-semibold text-slate-900">
              {selectedPreferences.length > 0
                ? selectedPreferences.join(", ")
                : "None yet"}
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleContinue}
              disabled={selectedPreferences.length === 0}
              className={`rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-all duration-200 ${
                selectedPreferences.length > 0
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}