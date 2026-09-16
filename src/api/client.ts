import { envConfig } from '../config/env';
import { ApiResponse, HealthCheckResponse } from '../types/api';

export class ApiClient {
  private static baseUrl = envConfig.apiBaseUrl;

  public static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network request failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  public static async checkHealth(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.get<HealthCheckResponse>('/health');
  }
}
