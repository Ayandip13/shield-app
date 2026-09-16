export type UserRole = 'provider_admin' | 'committee' | 'guard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  buildingId?: string;
}
