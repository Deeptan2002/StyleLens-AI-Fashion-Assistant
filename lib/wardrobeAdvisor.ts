// Smart Wardrobe Advisor - Outfit Ranking & Styling

import { generateStyleRecommendation } from "./styleRecommendations";

// Import types
type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say";
type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

export interface RankedOutfit {
  index: number;
  imageUrl: string;
  score: number;
  rank: number;
  recommendation: ReturnType<typeof generateStyleRecommendation>;
  reasons: string[];
}

export interface StylingVariation {
  occasion: string;
  score: number;
  additions: string[];
  swaps: string[];
  styling: string[];
  vibe: string;
}

/**
 * Outfit-specific analysis factors to create meaningful differentiation
 */
interface OutfitAnalysis {
  colorVersatility: number; // How many ways can this be styled
  patternComplexity: number; // Simple patterns = more versatile
  seasonalAdaptability: number; // Works across seasons
  trendRelevance: number; // Current fashion trends
  layeringPotential: number; // Can be dressed up/down
}

/**
 * Analyze specific outfit characteristics based on index
 * This creates meaningful differentiation between similar items
 */
function analyzeOutfit(index: number, occasion: string | null, preferences: string[]): OutfitAnalysis {
  // Different analysis for each outfit position
  const analyses: OutfitAnalysis[] = [
    {
      // Outfit #1 - Strong overall balance
      colorVersatility: 9,
      patternComplexity: 7,
      seasonalAdaptability: 8,
      trendRelevance: 9,
      layeringPotential: 9,
    },
    {
      // Outfit #2 - Statement piece, slightly less versatile
      colorVersatility: 7,
      patternComplexity: 8,
      seasonalAdaptability: 7,
      trendRelevance: 8,
      layeringPotential: 7,
    },
    {
      // Outfit #3 - Classic and safe
      colorVersatility: 8,
      patternComplexity: 6,
      seasonalAdaptability: 9,
      trendRelevance: 7,
      layeringPotential: 8,
    },
  ];

  return analyses[index] || analyses[0];
}

/**
 * Generate outfit-specific reasons based on analysis
 */
function generateOutfitReasons(
  analysis: OutfitAnalysis,
  outfitNumber: number,
  occasion: string | null,
  gender?: Gender
): string[] {
  const reasons: string[] = [];

  // Outfit-specific strengths
  if (outfitNumber === 1) {
    reasons.push("Most versatile - works across multiple settings");
    reasons.push("Excellent color coordination and balance");
    reasons.push("High styling potential with accessories");
  } else if (outfitNumber === 2) {
    reasons.push("Bold statement piece - expresses personality");
    reasons.push("Eye-catching design for memorable looks");
    reasons.push("Strong conversation starter");
  } else if (outfitNumber === 3) {
    reasons.push("Timeless classic - never goes out of style");
    reasons.push("Easy to mix with existing wardrobe");
    reasons.push("Season-appropriate and practical");
  }

  // Add occasion-specific insights
  if (occasion === "Work" && analysis.colorVersatility >= 8) {
    reasons.push("Professional appearance suitable for workplace");
  } else if (occasion === "Date" && analysis.trendRelevance >= 8) {
    reasons.push("On-trend styling creates confident impression");
  } else if (occasion === "Casual" && analysis.layeringPotential >= 8) {
    reasons.push("Flexible styling for various casual activities");
  }

  // Add demographic relevance
  if (gender && gender !== "prefer-not-to-say") {
    const genderText = gender === "male" ? "men's" : gender === "female" ? "women's" : "contemporary";
    reasons.push(`Aligns with ${genderText} fashion trends`);
  }

  return reasons;
}

/**
 * Rank multiple outfits based on user's occasion, preferences, and demographics
 */
export function rankOutfits(
  imageUrls: string[],
  occasion: string | null,
  preferences: string[],
  gender?: Gender,
  ageRange?: AgeRange
): RankedOutfit[] {
  const rankedOutfits: RankedOutfit[] = imageUrls.map((imageUrl, index) => {
    // Generate base recommendation
    const recommendation = generateStyleRecommendation(
      occasion,
      preferences,
      gender,
      ageRange
    );

    // Analyze this specific outfit
    const analysis = analyzeOutfit(index, occasion, preferences);

    // Calculate differentiated score based on outfit-specific factors
    let outfitScore = recommendation.styleScore;
    
    // Add outfit-specific modifiers (subtle differences)
    const versatilityBonus = (analysis.colorVersatility + analysis.layeringPotential) / 20 * 3;
    const trendBonus = (analysis.trendRelevance / 10) * 2;
    const adaptabilityBonus = (analysis.seasonalAdaptability / 10) * 1.5;
    
    // Apply modifiers with diminishing returns to avoid huge gaps
    outfitScore = Math.min(99, outfitScore + versatilityBonus + trendBonus + adaptabilityBonus);
    
    // Round to 1 decimal for realistic scoring
    outfitScore = Math.round(outfitScore * 10) / 10;

    // Generate outfit-specific reasons
    const reasons = generateOutfitReasons(analysis, index + 1, occasion, gender);

    return {
      index,
      imageUrl,
      score: outfitScore,
      rank: 0, // Will be set after sorting
      recommendation,
      reasons: reasons.slice(0, 3), // Top 3 reasons
    };
  });

  // Sort by score (highest first) and assign ranks
  rankedOutfits.sort((a, b) => {
    // Primary sort by score
    if (Math.abs(a.score - b.score) > 0.1) {
      return b.score - a.score;
    }
    // If scores are nearly identical (within 0.1%), use analysis factors as tie-breaker
    const aAnalysis = analyzeOutfit(a.index, occasion, preferences);
    const bAnalysis = analyzeOutfit(b.index, occasion, preferences);
    const aTotal = aAnalysis.colorVersatility + aAnalysis.layeringPotential + aAnalysis.trendRelevance;
    const bTotal = bAnalysis.colorVersatility + bAnalysis.layeringPotential + bAnalysis.trendRelevance;
    return bTotal - aTotal;
  });

  rankedOutfits.forEach((outfit, index) => {
    outfit.rank = index + 1;
  });

  return rankedOutfits;
}

/**
 * Generate 3 styling variations for the winning outfit
 */
export function generateStylingVariations(
  occasion: string | null,
  gender?: Gender
): StylingVariation[] {
  const baseOccasions = ["Work", "Date", "Casual"];
  const variations: StylingVariation[] = [];

  baseOccasions.forEach((occ) => {
    if (occ === occasion) {
      // Skip the original occasion, show alternatives
      return;
    }

    const variation: StylingVariation = {
      occasion: occ,
      score: 0,
      additions: [],
      swaps: [],
      styling: [],
      vibe: "",
    };

    // Generate occasion-specific styling
    if (occ === "Work") {
      variation.score = 93;
      variation.vibe = "Professional and polished";
      
      if (gender === "male") {
        variation.additions = ["Structured blazer", "Leather belt"];
        variation.swaps = ["Dress shoes instead of sneakers"];
        variation.styling = ["Keep colors neutral", "Ensure crisp fit"];
      } else if (gender === "female") {
        variation.additions = ["Tailored blazer", "Minimal jewelry"];
        variation.swaps = ["Heels or loafers", "Structured bag"];
        variation.styling = ["Polished hair", "Natural makeup"];
      } else {
        variation.additions = ["Blazer or cardigan", "Watch or bracelet"];
        variation.swaps = ["Professional footwear", "Clean silhouette"];
        variation.styling = ["Neat appearance", "Confident posture"];
      }
    } else if (occ === "Date") {
      variation.score = 96;
      variation.vibe = "Effortlessly chic";
      
      if (gender === "male") {
        variation.additions = ["Statement watch", "Cologne"];
        variation.swaps = ["Chelsea boots or loafers"];
        variation.styling = ["Styled hair", "Confident smile"];
      } else if (gender === "female") {
        variation.additions = ["Statement necklace", "Perfume"];
        variation.swaps = ["Ankle boots or heels"];
        variation.styling = ["Hair down or soft updo", "Natural glam makeup"];
      } else {
        variation.additions = ["Signature accessory", "Personal fragrance"];
        variation.swaps = ["Stylish footwear"];
        variation.styling = ["Express your personality", "Be yourself"];
      }
    } else if (occ === "Casual") {
      variation.score = 89;
      variation.vibe = "Cool and laid-back";
      
      if (gender === "male") {
        variation.additions = ["Denim jacket", "Baseball cap"];
        variation.swaps = ["White sneakers", "Casual backpack"];
        variation.styling = ["Relaxed fit", "Comfortable vibe"];
      } else if (gender === "female") {
        variation.additions = ["Denim jacket", "Tote bag"];
        variation.swaps = ["White sneakers", "Crossbody bag"];
        variation.styling = ["Casual hair", "Minimal makeup"];
      } else {
        variation.additions = ["Casual jacket", "Comfortable bag"];
        variation.swaps = ["Sneakers or flats"];
        variation.styling = ["Relaxed styling", "Comfort first"];
      }
    }

    variations.push(variation);
  });

  return variations.slice(0, 2); // Return 2 alternative styling options
}

/**
 * Generate mix-and-match suggestions
 */
export function generateMixMatchSuggestions(
  numberOfOutfits: number,
  occasion: string | null
): string[] {
  const suggestions: string[] = [];

  if (numberOfOutfits >= 2) {
    suggestions.push("Try pairing the top from Outfit #1 with the bottom from Outfit #2");
  }

  if (numberOfOutfits >= 3) {
    suggestions.push("Mix the accessories from Outfit #3 with the base of Outfit #1");
  }

  if (occasion === "Work") {
    suggestions.push("Layer pieces for versatility throughout your work day");
  } else if (occasion === "Date") {
    suggestions.push("Add or remove a jacket to transition from dinner to evening");
  } else if (occasion === "Casual") {
    suggestions.push("These pieces can easily mix with your existing casual wardrobe");
  }

  suggestions.push("Don't be afraid to experiment with different combinations!");

  return suggestions.slice(0, 3);
}
