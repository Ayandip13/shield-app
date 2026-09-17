import { Building } from './building';

export interface GuardShift {
  _id?: string;
  guardId: string;
  buildingId: Building | string;
  providerId: string;
  startTime: string; // HH:mm format, e.g. "08:00"
  endTime: string;   // HH:mm format, e.g. "20:00"
  isActive: boolean;
  isDefaultFallback?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateShiftDto {
  startTime: string;
  endTime: string;
}
