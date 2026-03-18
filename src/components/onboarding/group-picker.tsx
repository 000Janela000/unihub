'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n';

interface GroupPickerProps {
  value: number | null;
  onChange: (num: number) => void;
  maxGroups?: number;
  groupCodePreview?: string;
}

export function GroupPicker({
  value,
  onChange,
  maxGroups = 5,
  groupCodePreview,
}: GroupPickerProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: maxGroups }, (_, i) => {
          const num = i + 1;
          const isSelected = value === num;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-200 min-h-[44px]',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'border-border/50 bg-card text-foreground hover:border-muted-foreground/30 hover:shadow-sm'
              )}
            >
              {String(num).padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {groupCodePreview && (
        <div className="rounded-xl bg-muted/60 p-4 text-center">
          <span className="text-xs text-muted-foreground">
            {t('onboarding.groupPreview')}:{' '}
          </span>
          <span className="font-mono text-sm font-bold text-primary">
            {groupCodePreview}
          </span>
        </div>
      )}
    </div>
  );
}
