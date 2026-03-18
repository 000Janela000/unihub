'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';

interface SeatInputProps {
  examId: string;
  onSeatChange: (seat: string) => void;
  initialValue?: string;
}

/**
 * Determines the section letter from a seat number.
 * A: 001-069, B: 070-132, C: 133-162, D: 163-186,
 * E: 187-235, F: 236-281, G: 282-305
 */
export function getSectionFromSeat(seat: string): string | null {
  // Try to extract the letter prefix (e.g., "B" from "B115")
  const letterMatch = seat.match(/^([A-Ga-g])\d/);
  if (letterMatch) {
    return letterMatch[1].toUpperCase();
  }

  // Try numeric-only seat
  const numMatch = seat.match(/^(\d+)$/);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    if (num >= 1 && num <= 69) return 'A';
    if (num >= 70 && num <= 132) return 'B';
    if (num >= 133 && num <= 162) return 'C';
    if (num >= 163 && num <= 186) return 'D';
    if (num >= 187 && num <= 235) return 'E';
    if (num >= 236 && num <= 281) return 'F';
    if (num >= 282 && num <= 305) return 'G';
  }

  return null;
}

export function SeatInput({ examId, onSeatChange, initialValue }: SeatInputProps) {
  const [value, setValue] = useState(initialValue || '');
  const [section, setSection] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      setSection(getSectionFromSeat(initialValue));
    }
  }, [initialValue]);

  function handleChange(newValue: string) {
    setValue(newValue);
    const detectedSection = getSectionFromSeat(newValue);
    setSection(detectedSection);
    onSeatChange(newValue);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-muted-foreground">
        {t('exams.seat')}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('exams.seatPlaceholder')}
        className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label={t('exams.seat')}
      />
      {section && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {t('exams.section')} {section}
        </span>
      )}
    </div>
  );
}
