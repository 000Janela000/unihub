'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Lecture, DaySchedule, WeekSchedule } from '@/types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/storage';
import { useUserGroup } from '@/hooks/use-user-group';

const DAY_NAMES_KA: Record<number, string> = {
  1: 'ორშაბათი',
  2: 'სამშაბათი',
  3: 'ოთხშაბათი',
  4: 'ხუთშაბათი',
  5: 'პარასკევი',
};

const DAY_NAMES_EN: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
};

export function useSchedule() {
  const [lectures, setLecturesState] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const { group } = useUserGroup();

  useEffect(() => {
    const stored = getItem<Lecture[]>(STORAGE_KEYS.LECTURE_DATA, []);
    setLecturesState(stored);
    setLoading(false);
  }, []);

  const setLectures = useCallback((newLectures: Lecture[]) => {
    setLecturesState(newLectures);
    setItem(STORAGE_KEYS.LECTURE_DATA, newLectures);
  }, []);

  const clearLectures = useCallback(() => {
    setLecturesState([]);
    removeItem(STORAGE_KEYS.LECTURE_DATA);
  }, []);

  // Filter by user's group if available
  const filteredLectures = useMemo(() => {
    if (!group || !group.groupCode) return lectures;
    const code = group.groupCode.toLowerCase();
    return lectures.filter(
      (l) => !l.group || l.group.toLowerCase() === code || l.group.trim() === ''
    );
  }, [lectures, group]);

  // Group lectures into WeekSchedule (Mon-Fri)
  const weekSchedule: WeekSchedule = useMemo(() => {
    const days: WeekSchedule = [];
    for (let d = 1; d <= 5; d++) {
      const dayLectures = filteredLectures
        .filter((l) => l.dayOfWeek === d)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      days.push({
        dayOfWeek: d,
        dayNameKa: DAY_NAMES_KA[d] || '',
        dayNameEn: DAY_NAMES_EN[d] || '',
        lectures: dayLectures,
      });
    }
    return days;
  }, [filteredLectures]);

  return {
    lectures: filteredLectures,
    allLectures: lectures,
    loading,
    setLectures,
    clearLectures,
    weekSchedule,
  };
}
