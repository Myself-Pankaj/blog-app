"use client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
  Search,
  X,
} from "lucide-react";
import { useSearch } from "@/components/context/SearchContext";
import { useSearchBlogs } from "@/components/hooks/useSearchBlogs";
// Add this import

export default function Home() {
  const [page, setPage] = useState(1);
  const { debouncedQuery, isSearching, clearSearch } = useSearch();
  const limit = 10;

  // Use the custom hook instead of direct API calls
  const {
    data: posts,
    pagination,
    isLoading,
    isError,
    error,
    isSearchMode,
    handlePrev,
    handleNext,
  } = useSearchBlogs({ page, setPage, limit });
  console.log("Posts data:", posts);
  const handleClearSearch = () => {
    clearSearch();
    setPage(1);
  };
  const search_heading = ` Search Results for ${debouncedQuery}`;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-12 sm:py-16">
        {/* Search Status Banner */}
        {isSearchMode && (
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {search_heading}
                  </p>
                  {pagination && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Found {pagination.totalItems || pagination.total} articles
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleClearSearch}
                variant="ghost"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}

        {/* Searching indicator */}
        {isSearching && (
          <div className="mb-6 flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-orange-900 dark:text-orange-100 font-medium">
                Searching...
              </span>
            </div>
          </div>
        )}

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
              {isSearchMode ? "Search failed" : "Something went wrong"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
              {error && typeof error === "object" && "status" in error
                ? `Unable to ${
                    isSearchMode ? "search" : "load"
                  } articles (Error: ${(error as { status: number }).status})`
                : `We encountered an issue while ${
                    isSearchMode ? "searching for" : "loading"
                  } articles. Please try again.`}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              {isSearchMode && (
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="px-6 py-3 rounded-full"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && !isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-6 shadow-lg">
                {isSearchMode ? (
                  <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                ) : (
                  <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                )}
              </div>
              <div className="absolute -inset-4 bg-slate-500/5 dark:bg-slate-400/5 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              {isSearchMode ? "No search results" : "No stories yet"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-6">
              {isSearchMode
                ? `No articles found matching "${debouncedQuery}". Try adjusting your search terms.`
                : "Beautiful content is being crafted for you. Check back soon for inspiring articles and insights."}
            </p>
            {isSearchMode && (
              <Button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Clear Search
              </Button>
            )}
            {!isSearchMode && (
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                <Sparkles className="w-4 h-4" />
                <span>Something amazing is coming</span>
              </div>
            )}
          </div>
        )}

        {/* Blog list */}
        {!isLoading && posts.length > 0 && (
          <div className="space-y-8 sm:space-y-10">
            {posts.map((post: Blog, index: number) => (
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
                    disabled={!pagination.hasPrevPage}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm">
                    <span>{pagination.currentPage}</span>
                    <span className="text-slate-400 dark:text-slate-600">
                      of
                    </span>
                    <span>{pagination.totalPages}</span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={!pagination.hasNextPage}
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
                    {pagination.currentPage && pagination.itemsPerPage
                      ? (pagination.currentPage - 1) * pagination.itemsPerPage +
                        1
                      : 1}
                    –
                    {pagination.currentPage &&
                    pagination.itemsPerPage &&
                    pagination.totalItems
                      ? Math.min(
                          pagination.currentPage * pagination.itemsPerPage,
                          pagination.totalItems
                        )
                      : pagination.totalItems || 0}{" "}
                    of {pagination.totalItems}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {isSearchMode ? "search results" : "articles"}
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

// <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//   <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-12 sm:py-16">
//     {/* Loading state */}
//     {isLoading && <SkeletonGrid />}

//     {/* Error state */}
//     {isError && (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className="relative">
//           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 flex items-center justify-center mb-6 shadow-lg">
//             <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
//           </div>
//           <div className="absolute -inset-4 bg-red-500/5 dark:bg-red-400/5 rounded-full animate-pulse"></div>
//         </div>
//         <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
//           Something went wrong
//         </h3>
//         <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
//           {error && "status" in error
//             ? `Unable to load articles (Error: ${error.status})`
//             : "We encountered an issue while loading the articles. Please try again."}
//         </p>
//         <Button
//           onClick={() => window.location.reload()}
//           className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
//         >
//           <RefreshCw className="w-4 h-4" />
//           Try Again
//         </Button>
//       </div>
//     )}

//     {/* Empty state */}
//     {!isLoading && posts.length === 0 && !isError && (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className="relative">
//           <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-6 shadow-lg">
//             <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
//           </div>
//           <div className="absolute -inset-4 bg-slate-500/5 dark:bg-slate-400/5 rounded-full animate-pulse"></div>
//         </div>
//         <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
//           No stories yet
//         </h3>
//         <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
//           Beautiful content is being crafted for you. Check back soon for
//           inspiring articles and insights.
//         </p>
//         <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
//           <Sparkles className="w-4 h-4" />
//           <span>Something amazing is coming</span>
//         </div>
//       </div>
//     )}

//     {/* Blog list */}
//     {!isLoading && posts.length > 0 && (
//       <div className="space-y-8 sm:space-y-10">
//         {posts.map((post, index) => (
//           <article
//             key={post.blog_id}
//             style={{
//               animationDelay: `${index * 150}ms`,
//               opacity: 0,
//               animation: `fadeInUp 0.6s ease-out ${index * 150}ms forwards`,
//             }}
//             className="group"
//           >
//             <BlogCard post={post} />
//           </article>
//         ))}
//       </div>
//     )}

//     {/* Enhanced Pagination */}
//     {pagination && pagination.totalPages > 1 && (
//       <div className="mt-16 sm:mt-20">
//         <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
//             {/* Navigation buttons */}
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="outline"
//                 onClick={handlePrev}
//                 disabled={page === 1}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 <span className="hidden sm:inline">Previous</span>
//                 <span className="sm:hidden">Prev</span>
//               </Button>

//               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm">
//                 <span>{pagination.page}</span>
//                 <span className="text-slate-400 dark:text-slate-600">
//                   of
//                 </span>
//                 <span>{pagination.totalPages}</span>
//               </div>

//               <Button
//                 variant="outline"
//                 onClick={handleNext}
//                 disabled={page === pagination.totalPages}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <span className="sm:hidden">Next</span>
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>

//             {/* Stats */}
//             <div className="text-center sm:text-right">
//               <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
//                 {(pagination.page - 1) * limit + 1}–
//                 {Math.min(pagination.page * limit, pagination.total)} of{" "}
//                 {pagination.total}
//               </div>
//               <div className="text-xs text-slate-500 dark:text-slate-500">
//                 articles
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )}
//   </main>

//   {/* Add custom CSS for animations */}
//   <style jsx>{`
//     @keyframes fadeInUp {
//       from {
//         opacity: 0;
//         transform: translateY(30px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
//   `}</style>
// </div>
