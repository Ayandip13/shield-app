import { request } from './apiClient';
import { Guard, CreateGuardPayload, UpdateGuardPayload } from '../types/guard';

export async function getGuards(buildingId?: string): Promise<Guard[]> {
  const query = buildingId ? `?buildingId=${encodeURIComponent(buildingId)}` : '';
  const response = await request<Guard[]>(`/guards${query}`, {
    method: 'GET',
  });
  return response.data || [];
}

export async function getGuard(id: string): Promise<Guard> {
  const response = await request<Guard>(`/guards/${id}`, {
    method: 'GET',
  });
  if (!response.data) {
    throw new Error('Guard record not found');
  }
  return response.data;
}

export async function createGuard(payload: CreateGuardPayload): Promise<Guard> {
  const response = await request<Guard>('/guards', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.data) {
    throw new Error('Failed to create guard account');
  }
  return response.data;
}

export async function updateGuard(id: string, payload: UpdateGuardPayload): Promise<Guard> {
  const response = await request<Guard>(`/guards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!response.data) {
    throw new Error('Failed to update guard details');
  }
  return response.data;
}

export async function updateGuardStatus(id: string, isActive: boolean): Promise<Guard> {
  const response = await request<Guard>(`/guards/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
  if (!response.data) {
    throw new Error('Failed to update guard status');
  }
  return response.data;
}

export async function getMyGuardProfile(): Promise<Guard> {
  const response = await request<Guard>('/guards/me', {
    method: 'GET',
  });
  if (!response.data) {
    throw new Error('Failed to fetch guard profile');
  }
  return response.data;
}
