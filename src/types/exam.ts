export enum ExamType {
  Midterm = 'midterm',
  Final = 'final',
  Quiz = 'quiz',
  Retake = 'retake',
  Additional = 'additional',
  Unknown = 'unknown',
}

export interface Exam {
  id: string;
  date: string; // ISO date "2026-03-20"
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  subject: string; // Full subject name with exam type
  subjectClean: string; // Subject without exam type suffix
  examType: ExamType;
  examTypeLabel: string; // Original Georgian label e.g. "შუალედური 2"
  lecturers: string[];
  groups: string[]; // All group codes this exam applies to
  university: 'agruni' | 'freeuni';
  studentCount: number;
  tabName: string; // Sheet tab name (exam day)
}
