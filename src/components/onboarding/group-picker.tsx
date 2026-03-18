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
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {Array.from({ length: maxGroups }, (_, i) => {
          const num = i + 1;
          const isSelected = value === num;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={cn(
                'flex h-14 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:border-muted-foreground/50'
              )}
            >
              {String(num).padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {groupCodePreview && (
        <div className="rounded-lg bg-muted p-3 text-center">
          <span className="text-xs text-muted-foreground">
            {t('onboarding.groupPreview')}:{' '}
          </span>
          <span className="font-mono font-bold text-primary">
            {groupCodePreview}
          </span>
        </div>
      )}
    </div>
  );
}
