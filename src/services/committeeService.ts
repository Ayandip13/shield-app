import { request } from './apiClient';
import { CommitteeMember, CreateCommitteePayload, UpdateCommitteePayload } from '../types/committee';

export async function getCommitteeMembers(buildingId?: string): Promise<CommitteeMember[]> {
  const query = buildingId ? `?buildingId=${encodeURIComponent(buildingId)}` : '';
  const response = await request<CommitteeMember[]>(`/committee-members${query}`, {
    method: 'GET',
  });
  return response.data || [];
}

export async function getCommitteeMember(id: string): Promise<CommitteeMember> {
  const response = await request<CommitteeMember>(`/committee-members/${id}`, {
    method: 'GET',
  });
  if (!response.data) {
    throw new Error('Committee member record not found');
  }
  return response.data;
}

export async function createCommitteeMember(payload: CreateCommitteePayload): Promise<CommitteeMember> {
  const response = await request<CommitteeMember>('/committee-members', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.data) {
    throw new Error('Failed to create committee member account');
  }
  return response.data;
}

export async function updateCommitteeMember(
  id: string,
  payload: UpdateCommitteePayload
): Promise<CommitteeMember> {
  const response = await request<CommitteeMember>(`/committee-members/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!response.data) {
    throw new Error('Failed to update committee member details');
  }
  return response.data;
}

export async function updateCommitteeStatus(
  id: string,
  isActive: boolean
): Promise<CommitteeMember> {
  const response = await request<CommitteeMember>(`/committee-members/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
  if (!response.data) {
    throw new Error('Failed to update committee member status');
  }
  return response.data;
}

export async function getMyCommitteeProfile(): Promise<CommitteeMember> {
  const response = await request<CommitteeMember>('/committee/me', {
    method: 'GET',
  });
  if (!response.data) {
    throw new Error('Failed to fetch committee member profile');
  }
  return response.data;
}
