export interface UploadRequest {
  files: {
    file_name: string;
    file_size: number;
    content_type: string;
  }[];
}

export interface UploadResponse {
  data: {
    files: {
      file_id: string;
      requests: {
        method: string;
        url: string;
        headers: Record<string, string>;
      }[];
    }[];
  };
}

export interface CreateTaskRequest {
  src_file_id: string;
  ref_file_id: string;
  garment_category: string;
}

export interface CreateTaskResponse {
  data: {
    task_id: string;
  };
}

export interface TaskStatusResponse {
  data: {
    task_id: string;
    task_status: "processing" | "success" | "error";
    results?: {
      url?: string;
      [key: string]: any;
    };
    error?: string;
  };
}