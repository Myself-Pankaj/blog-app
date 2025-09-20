"use client";

import { use } from "react";
import MarkdownPreviewer from "@/components/blog/md-viewer";
import { useGetPostByIdQuery } from "@/lib/redux/api/blog.api";
import { Blog } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  AlertCircle,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  BookOpen,
} from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import { getReadingTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
export default function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  const { data, isLoading } = useGetPostByIdQuery(resolvedParams.slug, {
    skip: !resolvedParams.slug,
  });
  const post: Blog | undefined = data?.data;

  // Loading state with elegant skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Navigation Skeleton */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="px-6 py-6">
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="px-6 py-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-14 w-4/5" />
              <div className="flex gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Feature Image Skeleton */}
            <div className="relative">
              <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <Alert className="border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 shadow-xl">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            <AlertTitle className="text-slate-900 dark:text-slate-100">
              Article Not Found
            </AlertTitle>
            <AlertDescription className="text-slate-600 dark:text-slate-400">
              The requested article could not be found. It may have been moved
              or is no longer available.
            </AlertDescription>
          </Alert>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Return to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(post.content ?? "");
  const handleEdit = () => {
    if (!post?.blog_id) return;
    router.push(`/blog/${post.blog_id}/edit`);
  };
  const handleDelete = () => {};
  // Dummy related posts data
  const relatedPosts: Blog[] = [
    {
      blog_id: 1,
      title: "The Future of Web Development",
      content: "Exploring emerging trends and technologies shaping the web...",
      tags: ["Web Development", "Technology", "Future"],
      category: "Technology",
      thumbnail: "/default-thumbnail.png",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      blog_id: 2,
      title: "Design Systems at Scale",
      content:
        "Building consistent design languages for large organizations...",
      tags: ["Design", "Systems", "UI/UX"],
      category: "Design",
      thumbnail: "/default-thumbnail.png",
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:00:00Z",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Elegant Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">All Articles</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Sophisticated Layout */}
      <article className="w-full">
        {/* Article Header */}
        <header className="py-16 text-center px-6">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 tracking-wide uppercase">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 dark:text-slate-100 mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center justify-center gap-8 text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at ?? "").toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{readingTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image with Elegant Size */}
        {post.thumbnail && (
          <section className="mb-20 flex justify-center px-6">
            <div className="relative group max-w-4xl w-full">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-2xl shadow-slate-900/10">
                <div className="aspect-[16/9] relative">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                  />
                  {/* Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Action Buttons Bar - Full Width */}
        <div className="flex justify-between items-center mb-12 px-6">
          {/* Management Actions (Left) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>

          {/* Share Action (Right) */}
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Content - Full Width */}
        <MarkdownPreviewer markdown={post.content ?? ""} className="w-full" />
      </article>

      {/* Related Articles with Full Width */}
      <aside className="mt-32 border-t border-slate-200 dark:border-slate-800 w-full">
        <div className="px-6 py-20 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
              Continue Reading
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover more thoughtfully crafted articles
            </p>
          </div>

          <div className="grid gap-12 md:gap-8 grid-cols-1 md:grid-cols-2 w-full">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.blog_id}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-900/5 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={relatedPost.thumbnail || "/api/placeholder/400/240"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-8">
                    <div className="mb-3">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                      {relatedPost.content}
                    </p>
                    <div className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                      {timeAgo(relatedPost.created_at ?? "")}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl"
            >
              View All Articles
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
