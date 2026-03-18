'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { useUserGroup } from '@/hooks/use-user-group';
import { useSubjects, getAvailableSubjects } from '@/hooks/use-subjects';
import { SubjectFilter } from '@/components/subjects/subject-filter';
import type { Exam } from '@/types';

export default function SubjectsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { group } = useUserGroup();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!group) {
      setLoading(false);
      return;
    }

    const fetchExams = async () => {
      try {
        const params = new URLSearchParams({
          group: group.groupCode,
          university: group.university,
        });
        const res = await fetch(`/api/sheets/exams?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data: Exam[] = Array.isArray(json) ? json : (json.exams ?? []);
        setExams(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [group]);

  const availableSubjects = useMemo(() => getAvailableSubjects(exams), [exams]);
  const {
    selectedSubjects,
    toggleSubject,
    selectAll,
    deselectAll,
  } = useSubjects(availableSubjects);

  const handleContinue = () => {
    router.push('/exams');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="rounded-xl border border-border/50 bg-card p-8 shadow-sm max-w-sm w-full">
          <p className="mb-4 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/exams')}
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] min-h-[44px]"
          >
            {t('subjects.continue')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-lg font-semibold text-foreground">
          {t('subjects.title')}
        </h1>
      </div>

      {availableSubjects.length > 0 ? (
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <SubjectFilter
            subjects={availableSubjects}
            selected={selectedSubjects}
            onToggle={toggleSubject}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 text-center animate-fade-in">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {t('exams.noExams')}
          </p>
        </div>
      )}

      {/* Continue button */}
      <div className="sticky bottom-20 mt-6 pb-4 md:bottom-6">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] shadow-sm shadow-primary/25 min-h-[48px]"
        >
          {t('subjects.continue')}
          {selectedSubjects.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
              {selectedSubjects.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
