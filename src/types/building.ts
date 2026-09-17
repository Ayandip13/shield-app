export interface Building {
  _id: string;
  providerId: string;
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuildingPayload {
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateBuildingPayload {
  name?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface BuildingStatusPayload {
  isActive: boolean;
}
