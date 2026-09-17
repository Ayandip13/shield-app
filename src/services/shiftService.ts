import { request } from './apiClient';
import { GuardShift, UpdateShiftDto } from '../types/shift';

/**
 * Get shift schedule for a specific guard
 */
export async function getGuardShift(guardId: string): Promise<GuardShift> {
  const response = await request<GuardShift>(`/guards/${guardId}/shift`);
  return response.data!;
}

/**
 * Update shift schedule for a specific guard (Provider Admin)
 */
export async function updateGuardShift(
  guardId: string,
  shiftData: UpdateShiftDto
): Promise<GuardShift> {
  const response = await request<GuardShift>(`/guards/${guardId}/shift`, {
    method: 'PUT',
    body: JSON.stringify(shiftData),
  });
  return response.data!;
}
