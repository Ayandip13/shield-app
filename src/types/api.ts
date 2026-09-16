export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface HealthCheckResponse {
  status: string;
  uptime: number;
  environment: string;
  database: {
    connected: boolean;
    state: string;
  };
  timestamp: string;
}
