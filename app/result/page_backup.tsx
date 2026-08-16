"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Home, Sparkles, TrendingUp, Lightbulb, ShoppingBag } from "lucide-react";

import ProgressSteps from "@/components/upload/ProgressSteps";
import PageHeader from "@/components/ui/PageHeader";
import { useOnboarding } from "@/context/OnboardingContext";
import { generateStyleRecommendation, getStyleScoreColor, getStyleScoreBgColor } from "@/lib/styleRecommendations";

export default function ResultPage() {
  const router = useRouter();
  const { data, resetData } = useOnboarding();

  // Generate AI-style recommendations with full personalization
  const recommendation = generateStyleRecommendation(
    data.occasion, 
    data.preferences,
    data.gender,
    data.ageRange
  );

  const handleDownload = () => {
    if (!data.resultImageUrl) return;

    // Create a temporary link to download the image
    const link = document.createElement("a");
    link.href = data.resultImageUrl;
    link.download = `styledna-outfit-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartOver = () => {
    resetData();
    router.push("/upload");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition hover:text-indigo-600"
        >
          <Home size={18} />
          Home
        </button>

        <ProgressSteps currentStep={5} />

        <div className="mb-10">
          <PageHeader
            title="Your Virtual Try-On Result"
            description="Here's how you look in your selected outfit! Powered by YouCam AI."
          />
        </div>

        {data.resultImageUrl ? (
          <div className="space-y-6">
            {/* Main Result Image */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
              <img
                src={data.resultImageUrl}
                alt="Virtual try-on result"
                className="w-full object-cover"
              />
            </div>

            {/* Style DNA Analysis - Premium Section */}
            <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Your Style DNA Analysis</h2>
                  <p className="text-sm text-slate-600">AI-powered outfit insights</p>
                </div>
              </div>

              {/* Style Score with Progress Bar */}
              <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={20} />
                    <span className="font-semibold text-slate-900">Style Match Score</span>
                  </div>
                  <span className={`text-3xl font-black ${getStyleScoreColor(recommendation.styleScore)}`}>
                    {recommendation.styleScore}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      recommendation.styleScore >= 90
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600"
                    }`}
                    style={{ width: `${recommendation.styleScore}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {recommendation.styleScore >= 90
                    ? "Exceptional match! This outfit is perfect for your style DNA."
                    : "Great match! This outfit aligns well with your preferences."}
                </p>

                {/* Score Breakdown */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">Score Breakdown</h4>
                  <div className="space-y-2">
                    {recommendation.scoreBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                            <p className="text-xs text-slate-600">{item.reason}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">+{item.points}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
                    <span className="font-bold text-slate-900">Total Score</span>
                    <span className="text-lg font-black text-indigo-600">{recommendation.styleScore}%</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Sparkles className="text-indigo-600" size={20} />
                  {recommendation.title}
                </h3>
                <p className="leading-relaxed text-slate-700">{recommendation.description}</p>
              </div>

              {/* Styling Tips */}
              <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Lightbulb className="text-yellow-500" size={20} />
                  Styling Tips
                </h3>
                <ul className="space-y-2">
                  {recommendation.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pair With Suggestions */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <ShoppingBag className="text-indigo-600" size={20} />
                  Complete the Look
                </h3>
                <div className="flex flex-wrap gap-3">
                  {recommendation.pairWith.map((item, index) => (
                    <span
                      key={index}
                      className="rounded-full border-2 border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Occasion and Preferences Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles size={18} />
                  <h3 className="text-sm font-semibold">Profile</h3>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {data.gender && (
                    <span className="capitalize">{data.gender === "prefer-not-to-say" ? "Unspecified" : data.gender}</span>
                  )}
                  {data.gender && data.ageRange && " • "}
                  {data.ageRange && <span>{data.ageRange}</span>}
                  {!data.gender && !data.ageRange && "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles size={18} />
                  <h3 className="text-sm font-semibold">Selected Occasion</h3>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {data.occasion || "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkles size={18} />
                  <h3 className="text-sm font-semibold">Your Style Priorities</h3>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.preferences.length > 0 ? (
                    data.preferences.map((pref) => (
                      <span
                        key={pref}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
                      >
                        {pref}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">None selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-indigo-600 bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                <Download size={20} />
                Download Image
              </button>

              <button
                type="button"
                onClick={handleStartOver}
                className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Try Another Outfit
              </button>
            </div>

            {/* Powered by YouCam */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-center">
              <p className="text-sm text-slate-600">
                Virtual try-on powered by <span className="font-semibold text-indigo-600">YouCam AI</span> • 
                Perfect Corp Technology
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Style recommendations personalized using your profile, occasion, and preference selections
              </p>
            </div>

            {/* Business Impact Section */}
            <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-8 shadow-md">
              <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
                Real Impact, Real Value
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* For Retailers */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">For Retailers</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Reduce returns by 40%</strong> - Virtual try-on eliminates fit uncertainty
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Increase conversions by 35%</strong> - Visual confidence drives purchases
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Lower CAC</strong> - Satisfied customers become brand advocates
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Save billions</strong> - $550B lost annually to returns
                      </span>
                    </li>
                  </ul>
                </div>

                {/* For Shoppers */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">For Shoppers</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Try before you buy</strong> - See exactly how it looks on YOU
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Personalized advice</strong> - Recommendations tailored to your demographics
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Confidence in every purchase</strong> - No more guessing games
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">✓</span>
                      <span className="text-sm text-slate-700">
                        <strong>Save time & money</strong> - No return hassles or shipping costs
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white p-4 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  Built for YouCam API Hackathon 2026 🏆
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Demonstrating the future of online fashion retail
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Sparkles className="text-slate-400" size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No Result Available
            </h2>

            <p className="mt-3 text-slate-500">
              It looks like the analysis hasn't been completed yet.
            </p>

            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="mt-6 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </main>
  );
}