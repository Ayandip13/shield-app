import { request } from './apiClient';
import {
  EntryLog,
  CreateEntryLogDto,
  EntryLogFilterParams,
} from '../types/entryLog';

/**
 * Record a new person entry log (Guard)
 */
export async function createEntryLog(dto: CreateEntryLogDto): Promise<EntryLog> {
  const response = await request<EntryLog>('/entry-logs', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  return response.data!;
}

/**
 * Mark a person as exited (Guard)
 */
export async function markEntryLogExit(id: string): Promise<EntryLog> {
  const response = await request<EntryLog>(`/entry-logs/${id}/exit`, {
    method: 'PATCH',
  });
  return response.data!;
}

/**
 * Get active entries currently inside (exitTime == null)
 */
export async function getActiveEntryLogs(buildingId?: string): Promise<EntryLog[]> {
  const queryParams = new URLSearchParams();
  if (buildingId) queryParams.append('buildingId', buildingId);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await request<EntryLog[]>(`/entry-logs/active${queryString}`);
  return response.data || [];
}

/**
 * Get historical entry logs with optional filters
 */
export async function getEntryLogs(
  filters: EntryLogFilterParams = {}
): Promise<EntryLog[]> {
  const queryParams = new URLSearchParams();
  if (filters.buildingId) queryParams.append('buildingId', filters.buildingId);
  if (filters.guardId) queryParams.append('guardId', filters.guardId);
  if (filters.personType) queryParams.append('personType', filters.personType);
  if (filters.date) queryParams.append('date', filters.date);
  if (filters.from) queryParams.append('from', filters.from);
  if (filters.to) queryParams.append('to', filters.to);
  if (filters.active !== undefined) queryParams.append('active', String(filters.active));

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await request<EntryLog[]>(`/entry-logs${queryString}`);
  return response.data || [];
}

/**
 * Get single entry log by ID
 */
export async function getEntryLogById(id: string): Promise<EntryLog> {
  const response = await request<EntryLog>(`/entry-logs/${id}`);
  return response.data!;
}
