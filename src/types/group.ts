export interface Faculty {
  id: string;
  nameKa: string;
  nameEn: string;
  prefix: string;
  icon: string; // lucide icon name
}

export interface UserGroup {
  university: 'agruni' | 'freeuni';
  facultyId: string;
  year: number;
  groupNumber: number;
  groupCode: string; // Full code: "chem24-01"
}

export interface UserPreferences {
  group: UserGroup | null;
  language: 'ka' | 'en';
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  notificationTimings: string[];
}
