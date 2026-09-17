import { Building } from './building';

export interface CommitteeMember {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'committee';
  providerId: string;
  buildingId?: Building | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommitteePayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  buildingId: string;
}

export interface UpdateCommitteePayload {
  name?: string;
  phone?: string;
  buildingId?: string;
}
