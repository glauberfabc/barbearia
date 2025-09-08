
import React, { Suspense } from 'react';
import { SchedulePageContent } from '@/components/schedule-page-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function SchedulePage() {
  return (
    <Suspense fallback={<SchedulePageSkeleton />}>
      <SchedulePageContent />
    </Suspense>
  );
}

function SchedulePageSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-48" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-[180px]" />
                    <Skeleton className="h-10 w-[190px]" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Selecione uma data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[290px] w-full rounded-md border" />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Agendamentos do dia</CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-64" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-[76px] w-full" />
                        <Skeleton className="h-[76px] w-full" />
                        <Skeleton className="h-[76px] w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Para manter os componentes de UI no mesmo arquivo, se desejado.
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
);
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
);
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`text-sm text-muted-foreground ${className}`} {...props} />
);
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 pt-0 ${className}`} {...props} />
);
