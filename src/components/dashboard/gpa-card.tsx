'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Link2 } from 'lucide-react';
import { useLanguage } from '@/i18n';

// EMIS not connected yet - always show the connect state
// Once EMIS integration is done, this will pull real GPA data
export function GPACard() {
  const { t } = useLanguage();

  return (
    <Card className="border border-border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Trophy className="h-5 w-5 text-primary" />
          {t('dashboard.gpa')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Link2 className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="mb-4 text-sm text-muted-foreground">
            {t('dashboard.connectEmisDesc')}
          </p>
          <Button variant="outline" size="sm">
            {t('dashboard.connectEmis')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
