import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {/* Blog title skeleton */}
        <Skeleton className="h-12 w-3/4 mb-6" />

        {/* Blog metadata skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Blog content skeleton */}
        <div className="space-y-6">
          {/* First paragraph */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Subheading */}
          <Skeleton className="h-8 w-2/3 mt-8 mb-4" />

          {/* Second paragraph */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Image placeholder */}
          <Skeleton className="h-64 w-full rounded-lg my-8" />

          {/* Third paragraph */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Another subheading */}
          <Skeleton className="h-8 w-1/2 mt-8 mb-4" />

          {/* Final paragraph */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mt-12">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
      </article>
    </div>
  );
}
