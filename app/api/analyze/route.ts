import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: Orchestrate the complete StyleDNA analysis
 * This endpoint coordinates:
 * 1. Upload selfie (if not already uploaded)
 * 2. Upload wardrobe items (if any)
 * 3. Create try-on task
 * 4. Return task_id for client-side polling
 * 
 * Note: For the hackathon, we're using a simplified flow where
 * files are uploaded earlier in the user journey
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selfieFileId, wardrobeFileId, occasion, preferences } = body;

    if (!selfieFileId) {
      return NextResponse.json(
        { error: "Selfie is required" },
        { status: 400 }
      );
    }

    // For the hackathon demo, we need at least a wardrobe item
    // In production, this could use AI-generated clothing based on preferences
    if (!wardrobeFileId) {
      return NextResponse.json(
        { error: "Wardrobe item is required for try-on" },
        { status: 400 }
      );
    }

    // Create try-on task via our API
    const tryonResponse = await fetch(
      `${request.nextUrl.origin}/api/youcam/tryon`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selfieFileId, clothFileId: wardrobeFileId }),
      }
    );

    if (!tryonResponse.ok) {
      throw new Error("Failed to create try-on task");
    }

    const { taskId } = await tryonResponse.json();

    return NextResponse.json({
      success: true,
      taskId,
      message: "Analysis started successfully",
    });
  } catch (error) {
    console.error("Analysis API error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to start analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}