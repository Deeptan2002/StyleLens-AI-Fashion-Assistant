"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Pencil,
  SkipForward,
  Home,
} from "lucide-react";
import Link from "next/link";

import ProgressSteps from "@/components/upload/ProgressSteps";
import WardrobeOptionCard from "@/components/upload/WardrobeOptionCard";

import { useOnboarding } from "@/context/OnboardingContext";

export default function WardrobePage() {
  const router = useRouter();

  const { updateData } = useOnboarding();

  const choosePhotos = () => {
    updateData({
      wardrobeMode: "photos",
    });

    router.push("/upload/wardrobe/photos");
  };

  const chooseDescription = () => {
    updateData({
      wardrobeMode: "description",
    });

    router.push("/upload/wardrobe/describe");
  };

  const skipWardrobe = () => {
    updateData({
      wardrobeMode: "skip",
    });

    router.push("/occasion");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600"
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

        <h1 className="mt-8 text-center text-4xl font-black text-slate-900">
          Tell us about your wardrobe
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-500">
          Choose whichever option is easiest for you. Every option works with
          our AI recommendations.
        </p>

        <div className="mt-12 space-y-6">
          {/* Primary Option - Upload Photos (Fully Functional) */}
          <WardrobeOptionCard
            title="Upload Clothes"
            description="Upload photos of your favourite clothing items. AI will recognise colours, styles and categories automatically."
            icon={<Camera size={30} />}
            onClick={choosePhotos}
          />

          {/* Coming Soon Options - Disabled for Hackathon Demo */}
          <div className="relative">
            <div className="pointer-events-none opacity-50">
              <WardrobeOptionCard
                title="Describe My Wardrobe"
                description="Simply tell us what clothes you own. We'll understand your wardrobe using AI."
                icon={<Pencil size={30} />}
                onClick={() => {}}
              />
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Coming Soon
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none opacity-50">
              <WardrobeOptionCard
                title="Skip For Now"
                description="Don't worry—you'll still receive personalised outfit recommendations."
                icon={<SkipForward size={30} />}
                onClick={() => {}}
              />
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}