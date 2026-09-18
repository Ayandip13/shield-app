import { UserRole } from './auth';

export interface UserProfileBuilding {
  id: string;
  name: string;
  address: string;
}

export interface UserProfileProvider {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employeeId?: string | null;
  designation?: string | null;
  joiningDate?: string | null;
  building?: UserProfileBuilding | null;
  provider?: UserProfileProvider | null;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}
