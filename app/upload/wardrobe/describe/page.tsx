"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Home } from "lucide-react";
import Link from "next/link";

import ProgressSteps from "@/components/upload/ProgressSteps";
import PageHeader from "@/components/ui/PageHeader";
import StyleDNAProgress from "@/components/StyleDNAProgress";
import { useOnboarding } from "@/context/OnboardingContext";

export default function WardrobeDescribePage() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [description, setDescription] = useState(
    data.wardrobeDescription || ""
  );

  useEffect(() => {
    setDescription(data.wardrobeDescription || "");
  }, [data.wardrobeDescription]);

  const handleContinue = () => {
    updateData({
      wardrobeMode: "description",
      wardrobeDescription: description.trim(),
      wardrobeItems: [],
    });

    router.push("/occasion");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
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
            title="Describe your wardrobe"
            description="Tell us what clothes you own in plain language. It is quick, private, and still helps us make better recommendations."
          />
        </div>

        <div className="mx-auto mb-8 max-w-3xl">
          <StyleDNAProgress />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Pencil size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                What do you own?
              </h2>
              <p className="text-sm text-slate-500">
                Examples: navy blazer, white shirt, black jeans, brown loafers.
              </p>
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: I own two navy shirts, one white Oxford shirt, black trousers, blue jeans, a beige overshirt, and white sneakers."
            className="mt-6 min-h-56 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            maxLength={500}
          />

          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
            <span>Maximum 500 characters</span>
            <span>{description.length}/500</span>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Tip: include colours, types of clothing, shoes, and anything you
            wear often.
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleContinue}
              disabled={description.trim().length === 0}
              className={`rounded-2xl px-8 py-4 text-lg font-semibold text-white transition-all duration-200 ${
                description.trim().length > 0
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