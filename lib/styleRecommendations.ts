/**
 * Generate AI-style recommendations based on occasion, preferences, gender, and age
 */

interface StyleRecommendation {
  title: string;
  description: string;
  styleScore: number;
  scoreBreakdown: ScoreBreakdown[];
  tips: string[];
  pairWith: string[];
}

interface ScoreBreakdown {
  category: string;
  points: number;
  reason: string;
  icon: string;
}

type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say";
type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

const occasionDescriptions: Record<string, string> = {
  "Work": "professional and polished",
  "Date": "romantic and confident",
  "Casual": "relaxed and comfortable",
  "Travel": "versatile and practical",
  "Party": "bold and eye-catching",
  "Interview": "sharp and trustworthy",
};

const preferenceDescriptions: Record<string, string> = {
  "Comfort": "prioritizing ease of movement and all-day wearability",
  "Professional": "maintaining a polished, business-appropriate appearance",
  "Budget-Friendly": "focusing on value and versatility",
  "Trendy": "incorporating current fashion trends",
  "Weather-Appropriate": "considering climate and seasonal factors",
  "Sustainable": "choosing eco-conscious and ethical options",
  "Minimalist": "embracing clean lines and understated elegance",
  "Luxury": "selecting premium fabrics and sophisticated styling",
};

const occasionPairings: Record<string, string[]> = {
  "Work": ["tailored trousers", "leather shoes", "structured bag", "minimal jewelry"],
  "Date": ["fitted jeans or skirt", "heeled boots or dress shoes", "statement accessory", "subtle makeup"],
  "Casual": ["comfortable jeans or joggers", "sneakers or casual shoes", "crossbody bag", "sunglasses"],
  "Travel": ["versatile pants", "comfortable walking shoes", "practical backpack", "layers for weather"],
  "Party": ["statement bottoms", "bold shoes", "eye-catching accessories", "confident styling"],
  "Interview": ["pressed trousers", "polished dress shoes", "professional bag", "conservative accessories"],
};

// Gender-specific pairing suggestions
const genderSpecificPairings: Record<Gender, Record<string, string[]>> = {
  "male": {
    "Work": ["tailored chinos or dress pants", "oxford shoes or loafers", "leather belt", "watch"],
    "Date": ["well-fitted jeans or slacks", "dress shoes or clean sneakers", "cologne", "watch or bracelet"],
    "Casual": ["jeans or chinos", "sneakers or boat shoes", "baseball cap (optional)", "sunglasses"],
    "Travel": ["comfortable pants or shorts", "walking sneakers", "backpack", "travel jacket"],
    "Party": ["dark jeans or smart trousers", "statement shoes", "minimal accessories", "confident attitude"],
    "Interview": ["dress pants", "polished oxford shoes", "leather belt", "simple watch"],
  },
  "female": {
    "Work": ["tailored pants or pencil skirt", "heels or flats", "structured handbag", "delicate jewelry"],
    "Date": ["fitted dress or jeans with nice top", "heels or ankle boots", "clutch or small bag", "statement earrings"],
    "Casual": ["jeans or leggings", "sneakers or sandals", "crossbody bag", "simple jewelry"],
    "Travel": ["comfortable pants or maxi dress", "walking sandals or sneakers", "tote or backpack", "scarf"],
    "Party": ["mini or midi dress/skirt", "heels or bold shoes", "statement jewelry", "clutch bag"],
    "Interview": ["tailored pants or conservative dress", "closed-toe heels or flats", "professional bag", "minimal jewelry"],
  },
  "non-binary": {
    "Work": ["tailored bottoms", "professional shoes", "structured bag", "subtle accessories"],
    "Date": ["well-fitted outfit pieces", "comfortable yet stylish shoes", "personal accessories", "confident styling"],
    "Casual": ["comfortable separates", "versatile sneakers", "practical bag", "personal touches"],
    "Travel": ["mix-and-match pieces", "comfortable walking shoes", "functional bag", "layers"],
    "Party": ["bold statement pieces", "eye-catching shoes", "unique accessories", "personal expression"],
    "Interview": ["professional separates", "polished footwear", "understated bag", "minimal accessories"],
  },
  "prefer-not-to-say": {
    "Work": ["professional bottoms", "business-appropriate shoes", "structured bag", "minimal accessories"],
    "Date": ["well-fitted pieces", "stylish footwear", "complementary accessories", "personal style"],
    "Casual": ["comfortable essentials", "versatile shoes", "practical bag", "personal touches"],
    "Travel": ["versatile separates", "walking shoes", "functional luggage", "adaptable layers"],
    "Party": ["statement pieces", "bold footwear", "unique accessories", "personal flair"],
    "Interview": ["tailored pieces", "professional shoes", "conservative bag", "subtle accessories"],
  },
};

// Age-specific styling tips
const ageSpecificTips: Record<AgeRange, string[]> = {
  "18-24": [
    "Experiment with current trends and bold patterns",
    "Mix high and low fashion pieces for budget-conscious styling",
    "Don't be afraid to show personality through accessories",
  ],
  "25-34": [
    "Invest in quality basics that can be dressed up or down",
    "Balance trendy pieces with timeless staples",
    "Focus on fit and tailoring for a polished look",
  ],
  "35-44": [
    "Choose sophisticated pieces that command presence",
    "Prioritize quality fabrics and construction",
    "Refine your personal style with subtle details",
  ],
  "45-54": [
    "Embrace elevated classics with modern touches",
    "Focus on impeccable fit and premium materials",
    "Let confidence be your best accessory",
  ],
  "55+": [
    "Choose timeless elegance over fleeting trends",
    "Invest in comfort without compromising style",
    "Embrace your personal style with confidence",
  ],
};

export function generateStyleRecommendation(
  occasion?: string | null,
  preferences: string[] = [],
  gender?: Gender,
  ageRange?: AgeRange
): StyleRecommendation {
  const occ = occasion || "Casual";
  const occasionDesc = occasionDescriptions[occ] || "versatile and stylish";
  
  // Generate description based on preferences
  let prefDesc = "";
  if (preferences.length > 0) {
    const mainPref = preferences[0];
    const secondaryPref = preferences[1];
    
    prefDesc = preferenceDescriptions[mainPref] || "";
    if (secondaryPref && preferences.length > 1) {
      prefDesc += ` while ${preferenceDescriptions[secondaryPref]?.toLowerCase() || "maintaining balance"}`;
    }
  } else {
    prefDesc = "balancing style and comfort";
  }

  // Calculate style score (higher if preferences align with occasion and demographics)
  let baseScore = 85;
  
  // Boost score based on preference alignment
  if (occ === "Work" && preferences.includes("Professional")) baseScore += 10;
  if (occ === "Casual" && preferences.includes("Comfort")) baseScore += 8;
  if (occ === "Date" && preferences.includes("Trendy")) baseScore += 7;
  if (occ === "Party" && preferences.includes("Luxury")) baseScore += 9;
  if (preferences.includes("Weather-Appropriate")) baseScore += 5;
  if (preferences.length >= 2) baseScore += 3; // Bonus for detailed preferences
  
  // Age-appropriate bonus
  if (ageRange) {
    if (ageRange === "18-24" && preferences.includes("Trendy")) baseScore += 5;
    if ((ageRange === "35-44" || ageRange === "45-54") && preferences.includes("Professional")) baseScore += 5;
    if (ageRange === "55+" && preferences.includes("Comfort")) baseScore += 4;
  }
  
  // Cap at 98 to keep it realistic
  const styleScore = Math.min(baseScore, 98);

  // Generate personalized description with demographics
  let demographicContext = "";
  if (ageRange && gender && gender !== "prefer-not-to-say") {
    const ageDesc = ageRange === "18-24" ? "youthful energy" : 
                    ageRange === "25-34" ? "contemporary professional style" :
                    ageRange === "35-44" ? "sophisticated maturity" :
                    ageRange === "45-54" ? "refined elegance" : "timeless grace";
    demographicContext = ` The selection complements your ${ageDesc} beautifully.`;
  }

  const description = `This outfit perfectly captures a ${occasionDesc} aesthetic, ${prefDesc}. The combination creates a harmonious look that matches your style DNA and fits the ${occ.toLowerCase()} setting beautifully.${demographicContext}`;

  // Generate styling tips
  const tips: string[] = [];
  
  // Add age-specific tips first
  if (ageRange && ageSpecificTips[ageRange]) {
    tips.push(ageSpecificTips[ageRange][0]); // Add first age-specific tip
  }
  
  if (preferences.includes("Comfort")) {
    tips.push("Choose breathable fabrics and avoid restrictive fits for all-day comfort");
  }
  if (preferences.includes("Professional")) {
    tips.push("Keep colors neutral or coordinated, and ensure pieces are well-pressed");
  }
  if (preferences.includes("Trendy")) {
    tips.push("Add a statement accessory or modern silhouette to stay current");
  }
  if (preferences.includes("Luxury")) {
    tips.push("Focus on fabric quality and tailored fit for an elevated look");
  }
  if (preferences.includes("Minimalist")) {
    tips.push("Keep accessories minimal and let the outfit's clean lines shine");
  }
  if (preferences.includes("Sustainable")) {
    tips.push("Consider timeless pieces that can be worn multiple ways");
  }
  
  // Add occasion-specific tip
  if (occ === "Work" || occ === "Interview") {
    tips.push("Ensure proper fit and avoid overly casual elements");
  } else if (occ === "Date") {
    tips.push("Add a touch of personal flair to show your personality");
  } else if (occ === "Party") {
    tips.push("Don't be afraid to make a bold statement with this look");
  }

  // Default tips if none generated
  if (tips.length === 0) {
    tips.push("Ensure proper fit and comfort for confidence");
    tips.push("Consider the setting and adjust accessories accordingly");
  }

  // Get pairing suggestions (gender-specific if available)
  let pairWith: string[];
  if (gender && genderSpecificPairings[gender] && genderSpecificPairings[gender][occ]) {
    pairWith = genderSpecificPairings[gender][occ];
  } else {
    pairWith = occasionPairings[occ] || occasionPairings["Casual"];
  }

  // Generate score breakdown for transparency
  const scoreBreakdown: ScoreBreakdown[] = [];
  
  // Base score explanation
  scoreBreakdown.push({
    category: "Base Style Match",
    points: 85,
    reason: "Foundation score for outfit selection",
    icon: "✨"
  });

  // Occasion-preference alignment
  if (occ === "Work" && preferences.includes("Professional")) {
    scoreBreakdown.push({
      category: "Occasion Match",
      points: 10,
      reason: `Perfect alignment: Professional style for ${occ}`,
      icon: "🎯"
    });
  } else if (occ === "Casual" && preferences.includes("Comfort")) {
    scoreBreakdown.push({
      category: "Occasion Match",
      points: 8,
      reason: `Great fit: Comfort-focused for ${occ} setting`,
      icon: "🎯"
    });
  } else if (occ === "Date" && preferences.includes("Trendy")) {
    scoreBreakdown.push({
      category: "Occasion Match",
      points: 7,
      reason: `Trendy style works perfectly for ${occ}`,
      icon: "🎯"
    });
  } else if (occ === "Party" && preferences.includes("Luxury")) {
    scoreBreakdown.push({
      category: "Occasion Match",
      points: 9,
      reason: `Luxury pieces shine at ${occ} events`,
      icon: "🎯"
    });
  }

  // Age-appropriate bonus
  if (ageRange) {
    if (ageRange === "18-24" && preferences.includes("Trendy")) {
      scoreBreakdown.push({
        category: "Age Alignment",
        points: 5,
        reason: `Trendy choices suit ${ageRange} demographic`,
        icon: "🎂"
      });
    } else if ((ageRange === "35-44" || ageRange === "45-54") && preferences.includes("Professional")) {
      scoreBreakdown.push({
        category: "Age Alignment",
        points: 5,
        reason: `Professional style enhances ${ageRange} presence`,
        icon: "🎂"
      });
    } else if (ageRange === "55+" && preferences.includes("Comfort")) {
      scoreBreakdown.push({
        category: "Age Alignment",
        points: 4,
        reason: `Comfort priority matches ${ageRange} preferences`,
        icon: "🎂"
      });
    }
  }

  // Weather-appropriate bonus
  if (preferences.includes("Weather-Appropriate")) {
    scoreBreakdown.push({
      category: "Practical Considerations",
      points: 5,
      reason: "Climate-conscious outfit selection",
      icon: "🌤️"
    });
  }

  // Multiple preferences bonus
  if (preferences.length >= 2) {
    scoreBreakdown.push({
      category: "Style Complexity",
      points: 3,
      reason: `Balanced ${preferences.length} style priorities`,
      icon: "⚖️"
    });
  }

  // Gender-specific styling
  if (gender && gender !== "prefer-not-to-say") {
    scoreBreakdown.push({
      category: "Demographic Fit",
      points: 3,
      reason: `Tailored to ${gender === "male" ? "men's" : gender === "female" ? "women's" : "non-binary"} styling`,
      icon: "👤"
    });
  }

  return {
    title: `Perfect for ${occ}!`,
    description,
    styleScore,
    scoreBreakdown,
    tips: tips.slice(0, 4), // Limit to 4 tips max
    pairWith,
  };
}

export function getStyleScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-indigo-600";
  if (score >= 70) return "text-blue-600";
  return "text-slate-600";
}

export function getStyleScoreBgColor(score: number): string {
  if (score >= 90) return "bg-green-100";
  if (score >= 80) return "bg-indigo-100";
  if (score >= 70) return "bg-blue-100";
  return "bg-slate-100";
}
