import { request } from './apiClient';
import {
  ProviderDashboardData,
  CommitteeDashboardData,
  GuardDashboardData,
  ActivityItem,
} from '../types/dashboard';

/**
 * Fetch role-specific dashboard metrics & recent security activity
 */
export async function getDashboard(
  buildingId?: string
): Promise<ProviderDashboardData | CommitteeDashboardData> {
  const queryParams = new URLSearchParams();
  if (buildingId) queryParams.append('buildingId', buildingId);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await request<ProviderDashboardData | CommitteeDashboardData>(
    `/dashboard${queryString}`
  );
  return response.data!;
}

/**
 * Fetch guard duty dashboard status summary
 */
export async function getGuardDashboard(): Promise<GuardDashboardData> {
  const response = await request<GuardDashboardData>('/dashboard/guard');
  return response.data!;
}

/**
 * Fetch paginated security activity stream
 */
export async function getSecurityActivity(
  buildingId?: string,
  limit = 20
): Promise<ActivityItem[]> {
  const queryParams = new URLSearchParams();
  if (buildingId) queryParams.append('buildingId', buildingId);
  queryParams.append('limit', String(limit));

  const queryString = `?${queryParams.toString()}`;
  const response = await request<ActivityItem[]>(`/dashboard/activity${queryString}`);
  return response.data || [];
}
