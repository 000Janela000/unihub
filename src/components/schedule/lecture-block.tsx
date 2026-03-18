'use client';

import type { Lecture } from '@/types';

interface LectureBlockProps {
  lecture: Lecture;
  onClick: (lecture: Lecture) => void;
  startHour: number;
  endHour: number;
}

/**
 * Deterministic pastel color from a string hash.
 */
function subjectColor(subject: string): string {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 85%)`;
}

function subjectTextColor(subject: string): string {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 30%)`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function LectureBlock({ lecture, onClick, startHour, endHour }: LectureBlockProps) {
  const totalMinutes = (endHour - startHour) * 60;
  const lectureStart = timeToMinutes(lecture.startTime) - startHour * 60;
  const lectureEnd = timeToMinutes(lecture.endTime) - startHour * 60;
  const duration = lectureEnd - lectureStart;

  const topPercent = (lectureStart / totalMinutes) * 100;
  const heightPercent = (duration / totalMinutes) * 100;

  const bgColor = subjectColor(lecture.subject);
  const textColor = subjectTextColor(lecture.subject);

  // Truncate subject to fit
  const maxChars = duration < 60 ? 20 : 40;
  const truncatedSubject =
    lecture.subject.length > maxChars
      ? lecture.subject.slice(0, maxChars) + '...'
      : lecture.subject;

  return (
    <button
      type="button"
      onClick={() => onClick(lecture)}
      className="absolute inset-x-1 overflow-hidden rounded-md border border-black/5 px-1.5 py-1 text-left transition-shadow hover:shadow-md"
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        minHeight: '24px',
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <p className="truncate text-[10px] font-semibold leading-tight">
        {truncatedSubject}
      </p>
      {duration >= 45 && lecture.room && (
        <p className="mt-0.5 truncate text-[9px] opacity-80">
          {lecture.room}
        </p>
      )}
      {duration >= 60 && (
        <p className="mt-0.5 text-[9px] opacity-70">
          {lecture.startTime} - {lecture.endTime}
        </p>
      )}
    </button>
  );
}
