import axios from "axios";

import {
  YOUCAM_API_KEY,
  YOUCAM_BASE_URL,
} from "./config";

import { UploadResponse } from "./types";

/**
 * Step 1: Request an upload slot from Perfect Corp
 */
async function requestUploadSlot(fileName: string, fileSize: number, contentType: string) {
  const response = await axios.post<UploadResponse>(
    `${YOUCAM_BASE_URL}/s2s/v2.0/file/cloth-v3`,
    {
      files: [
        {
          file_name: fileName,
          file_size: fileSize,
          content_type: contentType,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${YOUCAM_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.files[0];
}

/**
 * Step 2: Upload the actual file binary to the pre-signed URL
 */
async function uploadToPerfectCorp(
  presignedUrl: string,
  fileBuffer: ArrayBuffer,
  headers: Record<string, string>
) {
  await axios.put(presignedUrl, fileBuffer, {
    headers,
  });
}

/**
 * Complete upload flow: Request slot + Upload binary
 * Returns the file_id needed for subsequent API calls
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    console.log("Starting file upload:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Step 1: Request upload slot
    const uploadSlot = await requestUploadSlot(
      file.name,
      file.size,
      file.type
    );

    console.log("Upload slot received:", uploadSlot);

    const fileId = uploadSlot.file_id;
    const uploadRequest = uploadSlot.requests[0];

    // Step 2: Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    console.log("Uploading to pre-signed URL...");

    // Step 3: Upload to pre-signed URL
    await uploadToPerfectCorp(
      uploadRequest.url,
      fileBuffer,
      uploadRequest.headers
    );

    console.log("Upload complete. File ID:", fileId);

    return fileId;
  } catch (error) {
    console.error("Upload error details:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Request config:", error.config);
    }
    throw new Error(
      axios.isAxiosError(error) && error.response?.data
        ? JSON.stringify(error.response.data)
        : "Failed to upload file to Perfect Corp"
    );
  }
}