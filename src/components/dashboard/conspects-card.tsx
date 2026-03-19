'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ThumbsUp, FileImage, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n';

interface Conspect {
  id: string;
  title: string;
  subject: string;
  votes: number;
  fileType: 'pdf' | 'image' | 'doc';
}

// Placeholder data until conspect sharing feature is implemented
const recentConspects: Conspect[] = [
  {
    id: '1',
    title: 'ინტეგრალური გამოთვლები',
    subject: 'მათემატიკა I',
    votes: 24,
    fileType: 'pdf',
  },
  {
    id: '2',
    title: 'ციკლები და პირობითი ოპერატორები',
    subject: 'პროგრამირება',
    votes: 18,
    fileType: 'pdf',
  },
  {
    id: '3',
    title: 'ნიუტონის კანონები',
    subject: 'ფიზიკა',
    votes: 12,
    fileType: 'image',
  },
];

const fileTypeIcons: Record<Conspect['fileType'], typeof FileText> = {
  pdf: FileText,
  image: FileImage,
  doc: File,
};

const fileTypeColors: Record<Conspect['fileType'], string> = {
  pdf: 'text-red-500',
  image: 'text-blue-500',
  doc: 'text-emerald-500',
};

export function ConspectsCard() {
  const { t } = useLanguage();

  return (
    <Card className="border border-border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          {t('dashboard.recentConspects')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentConspects.map((conspect) => {
            const FileIcon = fileTypeIcons[conspect.fileType];
            return (
              <div
                key={conspect.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted"
              >
                <FileIcon
                  className={cn(
                    'mt-0.5 h-5 w-5 shrink-0',
                    fileTypeColors[conspect.fileType]
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {conspect.title}
                  </p>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    {conspect.subject}
                  </Badge>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{conspect.votes}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
