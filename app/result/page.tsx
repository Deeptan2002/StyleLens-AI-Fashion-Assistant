"use client";

import { useRouter } from "next/navigation";
import { Download, Home, Sparkles, TrendingUp, Lightbulb, ShoppingBag, Trophy, Zap } from "lucide-react";

import ProgressSteps from "@/components/upload/ProgressSteps";
import PageHeader from "@/components/ui/PageHeader";
import SuccessCelebration from "@/components/result/SuccessCelebration";
import ShareButton from "@/components/result/ShareButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { generateStyleRecommendation, getStyleScoreColor } from "@/lib/styleRecommendations";
import { rankOutfits, generateStylingVariations, generateMixMatchSuggestions } from "@/lib/wardrobeAdvisor";

export default function ResultPage() {
  const router = useRouter();
  const { data, resetData } = useOnboarding();

  // Check if we have multiple results (Smart Wardrobe Advisor)
  const hasMultipleOutfits = data.resultImageUrls && data.resultImageUrls.length > 1;
  const imageUrls = hasMultipleOutfits && data.resultImageUrls 
    ? data.resultImageUrls 
    : data.resultImageUrl 
      ? [data.resultImageUrl] 
      : [];

  // Rank outfits if multiple
  const rankedOutfits = hasMultipleOutfits 
    ? rankOutfits(imageUrls, data.occasion, data.preferences, data.gender, data.ageRange)
    : [];

  // For single outfit, generate normal recommendation
  const singleRecommendation = !hasMultipleOutfits && imageUrls[0]
    ? generateStyleRecommendation(data.occasion, data.preferences, data.gender, data.ageRange)
    : null;

  // Get styling variations for winner (or single outfit)
  const stylingVariations = generateStylingVariations(data.occasion, data.gender);

  // Get mix-match suggestions
  const mixMatchSuggestions = generateMixMatchSuggestions(imageUrls.length, data.occasion);

  const handleDownload = (imageUrl: string, index?: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `styledna-outfit${index !== undefined ? `-${index + 1}` : ''}-${Date.now()}.jpg`;
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
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition hover:text-indigo-600"
        >
          <Home size={18} />
          Home
        </button>

        <ProgressSteps currentStep={5} />

        {/* Success Celebration */}
        {imageUrls.length > 0 && (
          <SuccessCelebration outfitCount={imageUrls.length} />
        )}

        <div className="mb-10">
          <PageHeader
            title={hasMultipleOutfits ? "Smart Wardrobe Advisor Results" : "Your Virtual Try-On Result"}
            description={hasMultipleOutfits 
              ? `We analyzed ${imageUrls.length} outfits and ranked them just for you!`
              : "Here's how you look in your selected outfit! Powered by YouCam AI."
            }
          />
        </div>

        {imageUrls.length > 0 ? (
          <div className="space-y-6">
            {/* Multiple Outfit Comparison */}
            {hasMultipleOutfits && rankedOutfits.length > 0 && (
              <>
                {/* AI Ranking Header */}
                <div className="rounded-3xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-md">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">AI Outfit Ranking</h2>
                      <p className="text-sm text-slate-600">
                        Based on your {data.occasion} occasion, {data.preferences.length} style priorities, 
                        and personal profile
                      </p>
                    </div>
                  </div>
                </div>

                {/* Outfit Comparison Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                  {rankedOutfits.map((outfit) => (
                    <div
                      key={outfit.index}
                      className={`overflow-hidden rounded-3xl border-2 bg-white shadow-lg transition ${
                        outfit.rank === 1
                          ? "border-yellow-400 ring-4 ring-yellow-100"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className="relative">
                        {outfit.rank === 1 && (
                          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                            <Trophy size={16} />
                            AI PICK
                          </div>
                        )}
                        {outfit.rank !== 1 && (
                          <div className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 bg-opacity-75 text-lg font-bold text-white">
                            #{outfit.rank}
                          </div>
                        )}
                        
                        {/* Image */}
                        <img
                          src={outfit.imageUrl}
                          alt={`Outfit ${outfit.index + 1}`}
                          className="h-96 w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">Outfit #{outfit.index + 1}</span>
                          <span className={`text-2xl font-black ${getStyleScoreColor(outfit.score)}`}>
                            {outfit.score}%
                          </span>
                        </div>

                        {/* Reasons */}
                        <ul className="space-y-2">
                          {outfit.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-0.5 text-green-600">✓</span>
                              {reason}
                            </li>
                          ))}
                        </ul>

                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(outfit.imageUrl, outfit.index)}
                          className="mt-4 w-full rounded-xl border-2 border-indigo-600 bg-white py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        >
                          <Download size={16} className="inline mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Winner Analysis */}
                {rankedOutfits[0] && (
                  <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Winner: Outfit #{rankedOutfits[0].index + 1}</h2>
                        <p className="text-sm text-slate-600">Complete style analysis for your best match</p>
                      </div>
                    </div>

                    {/* Score Breakdown - Use winner's recommendation */}
                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                      <h4 className="mb-3 text-lg font-bold text-slate-900">Score Breakdown</h4>
                      <div className="space-y-2">
                        {rankedOutfits[0].recommendation.scoreBreakdown.map((item, index) => (
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
                        <span className="text-lg font-black text-indigo-600">{rankedOutfits[0].score}%</span>
                      </div>
                    </div>

                    {/* Styling Tips */}
                    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <Lightbulb className="text-yellow-500" size={20} />
                        Styling Tips
                      </h3>
                      <ul className="space-y-2">
                        {rankedOutfits[0].recommendation.tips.map((tip, index) => (
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
                        {rankedOutfits[0].recommendation.pairWith.map((item, index) => (
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
                )}
              </>
            )}

            {/* Single Outfit View */}
            {!hasMultipleOutfits && singleRecommendation && (
              <>
                {/* Main Result Image */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                  <img
                    src={imageUrls[0]}
                    alt="Virtual try-on result"
                    className="w-full object-cover"
                  />
                </div>

                {/* Style DNA Analysis */}
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
                      <span className={`text-3xl font-black ${getStyleScoreColor(singleRecommendation.styleScore)}`}>
                        {singleRecommendation.styleScore}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          singleRecommendation.styleScore >= 90
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600"
                        }`}
                        style={{ width: `${singleRecommendation.styleScore}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {singleRecommendation.styleScore >= 90
                        ? "Exceptional match! This outfit is perfect for your style DNA."
                        : "Great match! This outfit aligns well with your preferences."}
                    </p>

                    {/* Score Breakdown */}
                    <div className="mt-6 border-t border-slate-200 pt-4">
                      <h4 className="mb-3 text-sm font-semibold text-slate-700">Score Breakdown</h4>
                      <div className="space-y-2">
                        {singleRecommendation.scoreBreakdown.map((item, index) => (
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
                        <span className="text-lg font-black text-indigo-600">{singleRecommendation.styleScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Sparkles className="text-indigo-600" size={20} />
                      {singleRecommendation.title}
                    </h3>
                    <p className="leading-relaxed text-slate-700">{singleRecommendation.description}</p>
                  </div>

                  {/* Styling Tips */}
                  <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Lightbulb className="text-yellow-500" size={20} />
                      Styling Tips
                    </h3>
                    <ul className="space-y-2">
                      {singleRecommendation.tips.map((tip, index) => (
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
                      {singleRecommendation.pairWith.map((item, index) => (
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
              </>
            )}

            {/* Styling Variations - "3 Ways to Style" */}
            {stylingVariations.length > 0 && (
              <div className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Style This Outfit 2 Ways</h2>
                    <p className="text-sm text-slate-600">Versatile styling options for different occasions</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {stylingVariations.map((variation, index) => (
                    <div key={index} className="rounded-2xl bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">{variation.occasion} Ready</h3>
                        <span className="text-xl font-black text-purple-600">{variation.score}%</span>
                      </div>

                      <p className="mb-4 text-sm italic text-slate-600">&ldquo;{variation.vibe}&rdquo;</p>

                      <div className="space-y-3 text-sm">
                        {variation.additions.length > 0 && (
                          <div>
                            <p className="font-semibold text-slate-900">✨ Add:</p>
                            <ul className="ml-4 mt-1 space-y-1">
                              {variation.additions.map((item, idx) => (
                                <li key={idx} className="text-slate-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {variation.swaps.length > 0 && (
                          <div>
                            <p className="font-semibold text-slate-900">🔄 Swap:</p>
                            <ul className="ml-4 mt-1 space-y-1">
                              {variation.swaps.map((item, idx) => (
                                <li key={idx} className="text-slate-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {variation.styling.length > 0 && (
                          <div>
                            <p className="font-semibold text-slate-900">💄 Style:</p>
                            <ul className="ml-4 mt-1 space-y-1">
                              {variation.styling.map((item, idx) => (
                                <li key={idx} className="text-slate-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mix & Match Suggestions (for multiple outfits) */}
            {hasMultipleOutfits && mixMatchSuggestions.length > 0 && (
              <div className="rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50 p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-slate-900">💡 Mix & Match Tips</h3>
                <ul className="space-y-2">
                  {mixMatchSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-0.5 text-green-600">✓</span>
                      <span className="text-slate-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profile Summary */}
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
              {!hasMultipleOutfits && imageUrls[0] && (
                <button
                  type="button"
                  onClick={() => handleDownload(imageUrls[0])}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-indigo-600 bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  <Download size={20} />
                  Download Image
                </button>
              )}

              <button
                type="button"
                onClick={handleStartOver}
                className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Try More Outfits
              </button>
            </div>

            {/* Powered by YouCam */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-center">
              <p className="text-sm text-slate-600">
                Virtual try-on powered by <span className="font-semibold text-indigo-600">YouCam AI</span> • 
                Perfect Corp Technology
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Smart Wardrobe Advisor with AI ranking and styling intelligence
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

            {/* Share Results */}
            <ShareButton 
              score={hasMultipleOutfits && rankedOutfits.length > 0 
                ? rankedOutfits[0].score 
                : singleRecommendation?.styleScore || 0
              }
              occasion={data.occasion}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            <p className="font-semibold">No Result Available</p>
            <p className="mt-2 text-sm">Please go back and start the analysis.</p>
          </div>
        )}
      </div>
    </main>
  );
}
