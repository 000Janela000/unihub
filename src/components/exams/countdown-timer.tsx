'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInHours } from 'date-fns';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  lang: 'ka' | 'en';
}

function getCountdownText(target: Date, lang: 'ka' | 'en'): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const daysDiff = differenceInDays(targetDay, today);

  if (daysDiff === 0) {
    const hours = target.getHours();
    const mins = String(target.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${mins}`;
    return lang === 'ka' ? `დღეს ${timeStr}` : `Today ${timeStr}`;
  }

  if (daysDiff === 1) {
    return lang === 'ka' ? 'ხვალ' : 'Tomorrow';
  }

  if (daysDiff >= 2 && daysDiff <= 6) {
    return lang === 'ka' ? `${daysDiff} დღეში` : `In ${daysDiff} days`;
  }

  if (daysDiff >= 7 && daysDiff < 14) {
    return lang === 'ka' ? '1 კვირაში' : 'In 1 week';
  }

  if (daysDiff >= 14) {
    const weeks = Math.floor(daysDiff / 7);
    return lang === 'ka' ? `${weeks} კვირაში` : `In ${weeks} weeks`;
  }

  if (daysDiff === -1) {
    return lang === 'ka' ? 'გუშინ' : 'Yesterday';
  }

  if (daysDiff < -1) {
    return lang === 'ka'
      ? `${Math.abs(daysDiff)} დღის წინ`
      : `${Math.abs(daysDiff)} days ago`;
  }

  return '';
}

function getUrgencyClass(target: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const daysDiff = differenceInDays(targetDay, today);

  if (daysDiff <= 0) return 'text-exam-final font-semibold';
  if (daysDiff === 1) return 'text-exam-final';
  if (daysDiff <= 3) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
}

export function CountdownTimer({ targetDate, lang }: CountdownTimerProps) {
  const [text, setText] = useState(() => getCountdownText(targetDate, lang));
  const [urgency, setUrgency] = useState(() => getUrgencyClass(targetDate));

  useEffect(() => {
    setText(getCountdownText(targetDate, lang));
    setUrgency(getUrgencyClass(targetDate));

    const interval = setInterval(() => {
      setText(getCountdownText(targetDate, lang));
      setUrgency(getUrgencyClass(targetDate));
    }, 60_000);

    return () => clearInterval(interval);
  }, [targetDate, lang]);

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs', urgency)}>
      <Clock className="h-3 w-3" />
      {text}
    </span>
  );
}
