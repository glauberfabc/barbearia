
import React, { Suspense } from 'react';
import { SchedulePageContent } from '@/components/schedule-page-content';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Skeleton className="h-9 w-48" />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Skeleton className="h-10 w-full sm:w-[180px]" />
                    <Skeleton className="h-10 w-full sm:w-[190px]" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Skeleton className="h-[290px] w-full max-w-sm rounded-md border" />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-3/4" />
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
