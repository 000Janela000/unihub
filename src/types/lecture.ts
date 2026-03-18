export interface Lecture {
  id: string;
  dayOfWeek: number; // 1=Monday ... 5=Friday
  startTime: string;
  endTime: string;
  subject: string;
  lecturer: string;
  room: string;
  type: 'lecture' | 'seminar' | 'lab' | 'unknown';
  group: string;
}

export interface DaySchedule {
  dayOfWeek: number;
  dayNameKa: string;
  dayNameEn: string;
  lectures: Lecture[];
}

export type WeekSchedule = DaySchedule[];
