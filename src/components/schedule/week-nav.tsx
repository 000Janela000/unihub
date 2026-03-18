'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/i18n';

const MONTH_NAMES_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_NAMES_KA = [
  'იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ',
  'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ',
];

interface WeekNavProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function getFriday(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + 4);
  return d;
}

function formatDate(date: Date, lang: 'ka' | 'en'): string {
  const months = lang === 'ka' ? MONTH_NAMES_KA : MONTH_NAMES_EN;
  const month = months[date.getMonth()];
  return `${month} ${date.getDate()}`;
}

export function WeekNav({ currentDate, onPrev, onNext }: WeekNavProps) {
  const { lang, t } = useLanguage();

  const monday = getMonday(currentDate);
  const friday = getFriday(monday);

  const label = `${t('schedule.weekOf')} ${formatDate(monday, lang)} - ${formatDate(friday, lang)}`;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onClick={onPrev}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <span className="text-sm font-medium text-foreground">{label}</span>

      <button
        type="button"
        onClick={onNext}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Next week"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
