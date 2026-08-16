import { WardrobeItem } from "./wardrobe";

export type WardrobeMode =
  | "photos"
  | "description"
  | "skip";

export interface OnboardingData {
  // Selfie
  selfieFile: File | null;
  selfiePreview: string | null;
  selfieFileId?: string; // Perfect Corp file_id

  // Personal Profile
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  ageRange?: "18-24" | "25-34" | "35-44" | "45-54" | "55+";

  // Wardrobe
  wardrobeMode: WardrobeMode | null;

  wardrobeItems: WardrobeItem[];
  wardrobeFileId?: string; // Perfect Corp file_id for wardrobe (legacy - kept for compatibility)
  wardrobeFileIds?: string[]; // Perfect Corp file_ids for multiple wardrobe items

  wardrobeDescription: string;

  // Occasion
  occasion: string | null;

  // Preferences
  preferences: string[];

  // AI Processing
  taskId?: string; // Perfect Corp task_id (legacy - single item)
  taskIds?: string[]; // Perfect Corp task_ids for multiple items
  resultImageUrl?: string; // Generated outfit image (legacy - single result)
  resultImageUrls?: string[]; // Generated outfit images for multiple items
  isProcessing?: boolean; // Processing state
  error?: string; // Error message if any
}