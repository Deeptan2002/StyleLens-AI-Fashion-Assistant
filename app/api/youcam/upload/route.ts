import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/youcam";

/**
 * API Route: Upload image to Perfect Corp
 * Accepts multipart/form-data with an image file
 * Returns the file_id needed for subsequent API calls
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Upload to Perfect Corp and get file_id
    const fileId = await uploadFile(file);

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}