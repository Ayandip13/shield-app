import { Building } from './building';

export interface Guard {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'guard';
  providerId: string;
  buildingId?: Building | string;
  employeeId?: string;
  joiningDate?: string;
  monthlySalary?: number;
  designation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuardPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  buildingId: string;
  employeeId?: string;
  joiningDate?: string;
  monthlySalary?: number;
  designation?: string;
}

export interface UpdateGuardPayload {
  name?: string;
  phone?: string;
  employeeId?: string;
  joiningDate?: string;
  monthlySalary?: number;
  designation?: string;
  buildingId?: string;
}
