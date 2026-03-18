'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Exam } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';

interface CachedExams {
  data: Exam[];
  timestamp: number;
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const ROMAN_TO_ARABIC: Record<string, string> = {
  'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5',
  'VI': '6', 'VII': '7', 'VIII': '8', 'IX': '9', 'X': '10',
};
const ARABIC_TO_ROMAN: Record<string, string> = {
  '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V',
  '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX', '10': 'X',
};

/**
 * Normalizes a subject name by converting all Roman numerals to Arabic.
 * "თეორიული მექანიკა I" → "თეორიული მექანიკა 1"
 * "ფიზიკა II" → "ფიზიკა 2"
 * Also converts Arabic to Roman for reverse matching.
 * Returns lowercase trimmed string with Romans→Arabic.
 */
function normalizeNumerals(name: string): string {
  let result = name.toLowerCase().trim();
  // Replace Roman numerals (word boundaries) with Arabic
  // Process longer numerals first to avoid partial matches (VIII before VII before VI etc.)
  const romans = Object.keys(ROMAN_TO_ARABIC).sort((a, b) => b.length - a.length);
  for (const roman of romans) {
    const regex = new RegExp(`\\b${roman.toLowerCase()}\\b`, 'g');
    result = result.replace(regex, ROMAN_TO_ARABIC[roman]);
  }
  // Also normalize Arabic that might need matching
  // "მექანიკა 1" stays "მექანიკა 1" (already Arabic)
  return result;
}

export function useExams(
  group: string | null,
  university: 'agruni' | 'freeuni' = 'agruni',
  selectedSubjects?: string[] | null
) {
  const [rawExams, setRawExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    if (!group) {
      setRawExams([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Check localStorage cache first
    const cached = getItem<CachedExams | null>(STORAGE_KEYS.EXAM_CACHE, null);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setRawExams(cached.data);
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

      setRawExams(sorted);
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

  // Filter by selected subjects with multi-tier fallback
  const exams = useMemo(() => {
    if (!selectedSubjects || selectedSubjects.length === 0) return rawExams;

    // Tier 1: exact match
    const exactMatch = rawExams.filter((exam) =>
      selectedSubjects.includes(exam.subjectClean)
    );
    if (exactMatch.length > 0) return exactMatch;

    // Tier 2: normalize Roman numerals ↔ Arabic numbers, then exact match
    const normalizedSubjects = selectedSubjects.map(normalizeNumerals);
    const romanMatch = rawExams.filter((exam) =>
      normalizedSubjects.includes(normalizeNumerals(exam.subjectClean))
    );
    if (romanMatch.length > 0) return romanMatch;

    // Tier 3: fuzzy partial containment (lowercase)
    const lowerSubjects = selectedSubjects.map(s => s.toLowerCase().trim());
    const fuzzyMatch = rawExams.filter((exam) => {
      const examLower = exam.subjectClean.toLowerCase().trim();
      return lowerSubjects.some(sel =>
        sel.includes(examLower) || examLower.includes(sel)
      );
    });
    if (fuzzyMatch.length > 0) return fuzzyMatch;

    // Tier 4: fallback - show all if filtering kills everything
    return rawExams;
  }, [rawExams, selectedSubjects]);

  return { exams, loading, error, refetch: fetchExams };
}
