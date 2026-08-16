import axios from "axios";

import {
  YOUCAM_BASE_URL,
  YOUCAM_HEADERS,
} from "./config";

import { CreateTaskResponse } from "./types";

/**
 * Create a virtual try-on task using Perfect Corp AI Clothes API
 * @param selfieFileId - The file_id of the uploaded selfie
 * @param clothFileId - The file_id of the uploaded clothing item
 * @returns The task_id for polling
 */
export async function createTryOnTask(
  selfieFileId: string,
  clothFileId: string
): Promise<string> {
  try {
    console.log("Creating try-on task:", {
      selfieFileId,
      clothFileId
    });

    const requestBody = {
      src_file_id: selfieFileId,
      ref_file_id: clothFileId,
      garment_category: "auto",
    };

    console.log("Request body:", requestBody);

    const response = await axios.post<CreateTaskResponse>(
      `${YOUCAM_BASE_URL}/s2s/v3.0/task/cloth`,
      requestBody,
      {
        headers: YOUCAM_HEADERS,
      }
    );

    console.log("Task created:", response.data);

    return response.data.data.task_id;
  } catch (error) {
    console.error("Create task error details:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Request URL:", error.config?.url);
      console.error("Request headers:", error.config?.headers);
    }
    throw new Error(
      axios.isAxiosError(error) && error.response?.data
        ? JSON.stringify(error.response.data)
        : "Failed to create try-on task"
    );
  }
}