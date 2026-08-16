import { NextRequest, NextResponse } from "next/server";
import { pollTaskStatus } from "@/lib/youcam";

/**
 * API Route: Poll task status
 * GET /api/youcam/task/[taskId]
 * Returns the task status and result when complete
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    // Await params in Next.js 16+
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    console.log("API Route: Polling task", taskId);

    // Poll the task until completion
    const result = await pollTaskStatus(taskId);

    console.log("API Route: Poll complete, full response:", result);
    console.log("API Route: result.data:", result.data);
    console.log("API Route: result.data.results:", result.data.results);
    console.log("API Route: Image URL:", result.data.results?.url);

    return NextResponse.json({
      success: true,
      status: result.data.task_status,
      imageUrl: result.data.results?.url, // Direct image URL
      results: result.data.results, // Full results object
    });
  } catch (error) {
    console.error("Task polling API error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to poll task",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
