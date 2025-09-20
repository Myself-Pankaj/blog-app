// "use client";
// import { useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useGetPostsQuery } from "@/lib/redux/api/blog.api";
// import { Blog } from "@/types/blog";
// import { Button } from "@/components/ui/button";
// import { BlogCard } from "@/components/blog/blog-card";
// export default function Home() {
//   const [page, setPage] = useState(1);
//   const limit = 4;
//   const {
//     data: blogsResponse,
//     isLoading,
//     isError,
//     error,
//   } = useGetPostsQuery({ page, limit });
//   const posts: Blog[] = blogsResponse?.data ?? [];
//   const pagination = blogsResponse?.pagination;
//   const handlePrev = () => {
//     if (pagination && page > 1) setPage(page - 1);
//   };

//   const handleNext = () => {
//     if (pagination && page < pagination.totalPages) setPage(page + 1);
//   };

//   return (
//     <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-10">
//       {/* Error state */}
//       {isLoading && <SkeletonGrid />}
//       {isError && (
//         <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
//           <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0
//                  2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732
//                  0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold">Something went wrong</h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             {error && "status" in error
//               ? `Failed to load posts: ${error.status}`
//               : "Failed to load posts. Please try again later."}
//           </p>
//           <Button variant="outline" onClick={() => window.location.reload()}>
//             Try Again
//           </Button>
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && posts.length === 0 && !isError && (
//         <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
//           <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
//             <svg
//               className="w-6 h-6 text-slate-500 dark:text-slate-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0
//                  01-2-2V5a2 2 0 012-2h5.586a1 1
//                  0 01.707.293l5.414 5.414a1 1
//                  0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold">No stories yet</h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Exquisite content is being crafted for you ✨
//           </p>
//         </div>
//       )}

//       {/* Blog list */}
//       {!isLoading && posts.length > 0 && (
//         <div className="flex flex-col gap-8">
//           {posts.map((post, index) => (
//             <div
//               key={post.blog_id}
//               style={{ animationDelay: `${index * 100}ms` }}
//               className="w-full"
//             >
//               <BlogCard post={post} />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <div className="mt-12 flex flex-col items-center gap-4">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handlePrev}
//               disabled={page === 1}
//             >
//               Prev
//             </Button>

//             <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
//               Page {pagination.page} of {pagination.totalPages}
//             </span>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleNext}
//               disabled={page === pagination.totalPages}
//             >
//               Next
//             </Button>
//           </div>

//           <div className="text-sm text-slate-600 dark:text-slate-400">
//             Showing {(pagination.page - 1) * limit + 1}-
//             {Math.min(pagination.page * limit, pagination.total)} of{" "}
//             {pagination.total} posts
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// const BlogCardSkeleton = () => (
//   <div className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-stone-200/50 dark:border-slate-700/50 shadow-sm animate-pulse w-full">
//     {/* Left side: Image placeholder */}
//     <Skeleton className="h-36 sm:h-40 md:h-44 w-40 sm:w-48 md:w-56 rounded-xl" />

//     {/* Right side: Content */}
//     <div className="flex flex-col justify-between flex-1">
//       {/* Meta & Title */}
//       <div>
//         <Skeleton className="h-4 w-16 mb-2" /> {/* Article label */}
//         <Skeleton className="h-6 sm:h-7 w-1/2 mb-3" /> {/* Title */}
//         <Skeleton className="h-4 w-full mb-2" /> {/* Line 1 */}
//         <Skeleton className="h-4 w-5/6 mb-2" /> {/* Line 2 */}
//         <Skeleton className="h-4 w-2/3" /> {/* Line 3 */}
//       </div>

//       {/* Bottom meta (date & read time) */}
//       <div className="flex justify-between items-center mt-4">
//         <Skeleton className="h-4 w-20" /> {/* Date */}
//         <Skeleton className="h-4 w-16" /> {/* Read time */}
//       </div>
//     </div>
//   </div>
// );

// const SkeletonGrid = () => (
//   <div className="flex flex-col gap-6">
//     {Array.from({ length: 6 }).map((_, i) => (
//       <BlogCardSkeleton key={i} />
//     ))}
//   </div>
// );
"use client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsQuery } from "@/lib/redux/api/blog.api";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/blog-card";
import {
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 4;
  const {
    data: blogsResponse,
    isLoading,
    isError,
    error,
  } = useGetPostsQuery({ page, limit });
  const posts: Blog[] = blogsResponse?.data ?? [];
  const pagination = blogsResponse?.pagination;

  const handlePrev = () => {
    if (pagination && page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (pagination && page < pagination.totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-12 sm:py-16">
        {/* Loading state */}
        {isLoading && <SkeletonGrid />}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 flex items-center justify-center mb-6 shadow-lg">
                <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <div className="absolute -inset-4 bg-red-500/5 dark:bg-red-400/5 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Something went wrong
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
              {error && "status" in error
                ? `Unable to load articles (Error: ${error.status})`
                : "We encountered an issue while loading the articles. Please try again."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && !isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-6 shadow-lg">
                <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="absolute -inset-4 bg-slate-500/5 dark:bg-slate-400/5 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              No stories yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Beautiful content is being crafted for you. Check back soon for
              inspiring articles and insights.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
              <Sparkles className="w-4 h-4" />
              <span>Something amazing is coming</span>
            </div>
          </div>
        )}

        {/* Blog list */}
        {!isLoading && posts.length > 0 && (
          <div className="space-y-8 sm:space-y-10">
            {posts.map((post, index) => (
              <article
                key={post.blog_id}
                style={{
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease-out ${index * 150}ms forwards`,
                }}
                className="group"
              >
                <BlogCard post={post} />
              </article>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-16 sm:mt-20">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Navigation buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm">
                    <span>{pagination.page}</span>
                    <span className="text-slate-400 dark:text-slate-600">
                      of
                    </span>
                    <span>{pagination.totalPages}</span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={page === pagination.totalPages}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="text-center sm:text-right">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {(pagination.page - 1) * limit + 1}–
                    {Math.min(pagination.page * limit, pagination.total)} of{" "}
                    {pagination.total}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    articles
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

const BlogCardSkeleton = () => (
  <div className="group">
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-6 sm:p-8">
        {/* Image placeholder */}
        <div className="relative mb-4 sm:mb-0">
          <Skeleton className="h-48 sm:h-40 md:h-44 lg:h-48 w-full sm:w-48 md:w-56 lg:w-64 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 space-y-4">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <Skeleton className="h-7 sm:h-8 w-4/5 rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonGrid = () => (
  <div className="space-y-8 sm:space-y-10">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        style={{ animationDelay: `${i * 150}ms` }}
        className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
      >
        <BlogCardSkeleton />
      </div>
    ))}
  </div>
);
