import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function WordCardSkeleton() {
    return (
        <Card className="w-full overflow-hidden animate-pulse">
            <CardHeader className="pb-3">
                <div className="flex justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-32 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-full rounded" />
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-8 w-24 rounded" />
                    </div>
                    <div className="pl-4 border-l-2 border-gray-200 space-y-4">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-8 w-full rounded" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
