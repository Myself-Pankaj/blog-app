import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="w-full">
        <CardHeader className="space-y-4">
          {/* Page Title Skeleton */}
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Title Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Category Select Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Tags Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>

          {/* Thumbnail Upload Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="border-2 border-dashed rounded-lg p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-48 mx-auto" />
                  <Skeleton className="h-3 w-32 mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Card className="min-h-[400px] p-4">
              <div className="space-y-4">
                {/* Editor Toolbar */}
                <div className="flex gap-1 border-b pb-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8" />
                  ))}
                </div>

                {/* Editor Content Area */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex justify-end gap-4 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
