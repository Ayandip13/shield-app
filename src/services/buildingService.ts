import { request } from './apiClient';
import {
  Building,
  CreateBuildingPayload,
  UpdateBuildingPayload,
} from '../types/building';

export async function getBuildings(): Promise<Building[]> {
  const response = await request<Building[]>('/buildings', {
    method: 'GET',
  });
  return response.data || [];
}

export async function getBuilding(id: string): Promise<Building> {
  const response = await request<Building>(`/buildings/${id}`, {
    method: 'GET',
  });
  if (!response.data) {
    throw new Error('Building details not found');
  }
  return response.data;
}

export async function createBuilding(payload: CreateBuildingPayload): Promise<Building> {
  const response = await request<Building>('/buildings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.data) {
    throw new Error('Failed to create building');
  }
  return response.data;
}

export async function updateBuilding(
  id: string,
  payload: UpdateBuildingPayload
): Promise<Building> {
  const response = await request<Building>(`/buildings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!response.data) {
    throw new Error('Failed to update building details');
  }
  return response.data;
}

export async function updateBuildingStatus(
  id: string,
  isActive: boolean
): Promise<Building> {
  const response = await request<Building>(`/buildings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
  if (!response.data) {
    throw new Error('Failed to update building status');
  }
  return response.data;
}
