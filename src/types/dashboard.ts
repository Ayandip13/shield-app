export type ActivityType = 'ENTRY' | 'EXIT' | 'ATTENDANCE';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  timestamp: string; // ISO String
  title: string;
  description: string;
  buildingName: string;
  buildingId: string;
  personType?: string;
  guardName?: string;
}

export interface ProviderDashboardSummary {
  totalBuildings: number;
  activeBuildings: number;
  activeGuards: number;
  presentToday: number;
  currentlyOnDuty: number;
  currentlyInside: number;
  todayEntries: number;
}

export interface CommitteeDashboardSummary {
  activeGuards: number;
  presentToday: number;
  currentlyOnDuty: number;
  currentlyInside: number;
  todayEntries: number;
}

export interface ProviderDashboardData {
  summary: ProviderDashboardSummary;
  recentActivity: ActivityItem[];
}

export interface CommitteeDashboardData {
  building: {
    id: string;
    name: string;
    address: string;
  };
  summary: CommitteeDashboardSummary;
  recentActivity: ActivityItem[];
}

export interface GuardDashboardData {
  guard: {
    id: string;
    name: string;
    employeeId: string | null;
  };
  building: {
    id: string;
    name: string;
    address: string;
  } | null;
  shift: {
    startTime: string;
    endTime: string;
  } | null;
  todayStatus: {
    status: 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'CHECKED_OUT';
    checkIn: string | null;
    checkOut: string | null;
  };
}
