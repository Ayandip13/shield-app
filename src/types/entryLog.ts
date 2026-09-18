import { Building } from './building';

export type PersonType = 'visitor' | 'delivery' | 'staff' | 'other';

export interface EntryLogGuardInfo {
  _id: string;
  name: string;
  employeeId?: string;
  designation?: string;
  phone?: string;
  email?: string;
}

export interface EntryLog {
  _id: string;
  providerId: string;
  buildingId: Building | string;
  guardId: EntryLogGuardInfo | string;
  personName: string;
  phone?: string;
  personType: PersonType;
  purpose?: string;
  flatUnit?: string;
  entryTime: string; // ISO date string
  exitTime?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryLogDto {
  personName: string;
  phone?: string;
  personType: PersonType;
  purpose?: string;
  flatUnit?: string;
  notes?: string;
}

export interface EntryLogFilterParams {
  buildingId?: string;
  guardId?: string;
  personType?: PersonType;
  date?: string;
  from?: string;
  to?: string;
  active?: boolean | string;
}
