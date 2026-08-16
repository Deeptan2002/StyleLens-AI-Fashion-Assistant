import axios from "axios";

import {
  YOUCAM_BASE_URL,
  YOUCAM_HEADERS,
} from "./config";

import { TaskStatusResponse } from "./types";

const MAX_POLL_ATTEMPTS = 150; // 150 attempts × 2 seconds = 5 minutes max
const POLL_INTERVAL_MS = 2000; // Poll every 2 seconds

/**
 * Poll a try-on task until completion or error
 * @param taskId - The task_id to poll
 * @returns The completed task data with result image
 */
export async function pollTaskStatus(
  taskId: string
): Promise<TaskStatusResponse> {
  let attempts = 0;

  console.log(`Starting to poll task ${taskId}`);

  while (attempts < MAX_POLL_ATTEMPTS) {
    try {
      console.log(`Poll attempt ${attempts + 1}/${MAX_POLL_ATTEMPTS}`);
      
      const response = await axios.get<TaskStatusResponse>(
        `${YOUCAM_BASE_URL}/s2s/v3.0/task/cloth/${taskId}`,
        {
          headers: YOUCAM_HEADERS,
        }
      );

      const taskData = response.data;
      console.log(`Task status: ${taskData.data.task_status}`);
      console.log(`Task data:`, taskData.data);

      if (taskData.data.task_status === "success") {
        console.log("Task completed successfully!");
        console.log("Results:", taskData.data.results);
        console.log("Image URL:", taskData.data.results?.url);
        return taskData;
      }

      if (taskData.data.task_status === "error") {
        console.error("Task failed with error:", taskData.data.error);
        throw new Error(
          taskData.data.error || "Try-on task failed"
        );
      }

      // Still processing, wait before next poll
      console.log("Task still processing, waiting...");
      await new Promise((resolve) =>
        setTimeout(resolve, POLL_INTERVAL_MS)
      );

      attempts++;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        console.error("Polling error response:", error.response.data);
        throw new Error(
          error.response.data.error || "Task polling failed"
        );
      }
      throw error;
    }
  }

  console.error("Polling timeout reached");
  throw new Error("Task polling timeout - maximum attempts reached");
}