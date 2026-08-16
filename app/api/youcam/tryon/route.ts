import { NextRequest, NextResponse } from "next/server";
import { createTryOnTask } from "@/lib/youcam";

/**
 * API Route: Create a virtual try-on task
 * Accepts selfieFileId and clothFileId
 * Returns the task_id for polling
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selfieFileId, clothFileId } = body;

    if (!selfieFileId || !clothFileId) {
      return NextResponse.json(
        { error: "Both selfieFileId and clothFileId are required" },
        { status: 400 }
      );
    }

    // Create try-on task with Perfect Corp
    const taskId = await createTryOnTask(selfieFileId, clothFileId);

    return NextResponse.json({
      success: true,
      taskId,
    });
  } catch (error) {
    console.error("Try-on API error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to create try-on task",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
