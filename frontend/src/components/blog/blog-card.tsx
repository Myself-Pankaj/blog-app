// "use client";

// import Image from "next/image";
// import { extractFirst20Words, timeAgo } from "@/lib/utils";
// import { getReadingTime } from "@/lib/utils";
// import Link from "next/link";
// import { Blog } from "@/types/blog";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export function BlogCard({ post }: { post: Blog }) {
//   const readTime = getReadingTime(post.content || "");

//   return (
//     <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm">
//       <div className="flex flex-col md:flex-row h-full">
//         {/* Image Section */}
//         <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden">
//           <Image
//             src={post.thumbnail ?? "/default-thumbnail.png"}
//             alt={post.title}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//           />
//           {/* Category Badge */}
//           {post.category && (
//             <div className="absolute top-3 left-3">
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 backdrop-blur-sm">
//                 {post.category}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Content Section */}
//         <div className="flex flex-col flex-1 min-h-0">
//           <CardHeader className="pb-3">
//             <div className="flex items-start justify-between gap-4">
//               <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
//                 {post.title}
//               </CardTitle>
//             </div>
//             <div className="flex items-center gap-3 text-sm text-gray-500">
//               <CardDescription className="flex items-center gap-1">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 {timeAgo(post.updated_at ?? post.created_at ?? "")}
//               </CardDescription>
//               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//               <span className="flex items-center gap-1">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                   />
//                 </svg>
//                 {readTime}
//               </span>
//             </div>
//           </CardHeader>

//           <CardContent className="flex-1 pb-4">
//             <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
//               {extractFirst20Words(post.content) + "..."}
//             </p>
//           </CardContent>

//           <CardFooter className="pt-0 mt-auto">
//             <Link
//               href={`/blog/${post.blog_id}`}
//               className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 group/link"
//             >
//               Read full article
//               <svg
//                 className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 8l4 4m0 0l-4 4m4-4H3"
//                 />
//               </svg>
//             </Link>
//           </CardFooter>
//         </div>
//       </div>
//     </Card>
//   );
// }
"use client";

import Image from "next/image";
import { extractFirst20Words, timeAgo } from "@/lib/utils";
import { getReadingTime } from "@/lib/utils";
import Link from "next/link";
import { Blog } from "@/types/blog";
import { Clock, Calendar, ArrowRight, Tag } from "lucide-react";

export function BlogCard({ post }: { post: Blog }) {
  const readTime = getReadingTime(post.content || "");

  return (
    <Link href={`/blog/${post.blog_id}`} className="block group">
      <article className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200">
        {/* Image Section */}
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={post.thumbnail ?? "/default-thumbnail.png"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
          />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 backdrop-blur-sm">
                <Tag className="w-2.5 h-2.5" />
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">
            {extractFirst20Words(post.content)}...
          </p>

          {/* Meta & CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{timeAgo(post.updated_at ?? post.created_at ?? "")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span>Read</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
