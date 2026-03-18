'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Exam } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';

interface CachedExams {
  data: Exam[];
  timestamp: number;
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export function useExams(group: string | null, university: 'agruni' | 'freeuni' = 'agruni') {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    if (!group) {
      setExams([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Check localStorage cache first
    const cached = getItem<CachedExams | null>(STORAGE_KEYS.EXAM_CACHE, null);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setExams(cached.data);
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({ group, university });
      const res = await fetch(`/api/sheets/exams?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch exams: ${res.status}`);
      }

      const json = await res.json();
      // API returns { exams: Exam[], total: number }
      const data: Exam[] = Array.isArray(json) ? json : (json.exams ?? []);

      // Sort by date ascending
      const sorted = data.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      setExams(sorted);
      setItem(STORAGE_KEYS.EXAM_CACHE, { data: sorted, timestamp: Date.now() });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch exams';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [group, university]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refetch: fetchExams };
}
