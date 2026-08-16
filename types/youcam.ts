export interface UploadResponse {
  success: boolean;
  fileId: string;
}

export interface AnalysisResponse {
  success: boolean;
  taskId: string;
}

export interface TryOnResponse {
  success: boolean;
  imageUrl: string;
}