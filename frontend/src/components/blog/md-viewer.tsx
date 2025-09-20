/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { MarkdownPreviewerProps } from "@/types/blog";
import React from "react";
import Image from "next/image";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import "highlight.js/styles/github-dark.css";

const MarkdownPreviewer: React.FC<MarkdownPreviewerProps> = ({
  markdown,
  className = "",
}) => {
  // Custom components for react-markdown with proper typing
  const components: Components = {
    h1: (props) => (
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-8 sm:mt-12 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b-4 border-blue-600 dark:border-blue-400 scroll-mt-20"
        {...props}
      >
        {props.children}
      </h1>
    ),
    h2: (props) => (
      <h2
        className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 sm:mt-10 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b-2 border-gray-300 dark:border-gray-600 scroll-mt-20"
        {...props}
      >
        {props.children}
      </h2>
    ),
    h3: (props) => (
      <h3
        className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 sm:mt-8 mb-3 sm:mb-4 border-l-4 border-blue-500 dark:border-blue-400 pl-3 sm:pl-4 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-r-md scroll-mt-20"
        {...props}
      >
        {props.children}
      </h3>
    ),
    h4: (props) => (
      <h4
        className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 scroll-mt-20"
        {...props}
      >
        {props.children}
      </h4>
    ),
    h5: (props) => (
      <h5
        className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2 scroll-mt-20"
        {...props}
      >
        {props.children}
      </h5>
    ),
    h6: (props) => (
      <h6
        className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2 scroll-mt-20"
        {...props}
      >
        {props.children}
      </h6>
    ),
    p: (props) => (
      <p
        className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base"
        {...props}
      >
        {props.children}
      </p>
    ),
    a: (props) => (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 py-0.5 rounded"
        {...props}
      >
        {props.children}
      </a>
    ),
    img: (props) => {
      if (!props.src) return null;

      // Handle external and internal images
      const isExternal =
        typeof props.src === "string" &&
        (props.src.startsWith("http") || props.src.startsWith("//"));

      if (isExternal && typeof props.src === "string") {
        return (
          <div className="my-4 sm:my-6 flex justify-center">
            <div className="relative max-w-full w-full">
              <Image
                src={props.src}
                alt={props.alt || "Image"}
                width={800}
                height={400}
                className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                style={{ width: "auto", height: "auto" }}
                unoptimized={isExternal}
              />
            </div>
          </div>
        );
      }

      if (typeof props.src === "string") {
        return (
          <div className="my-4 sm:my-6 flex justify-center">
            <div className="relative max-w-full w-full">
              <Image
                src={props.src}
                alt={props.alt || "Image"}
                width={800}
                height={400}
                className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        );
      }

      // If src is not a string, do not render anything
      return null;
    },
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4 my-4 sm:my-6 italic text-gray-700 dark:text-gray-300 rounded-r-lg shadow-sm"
        {...props}
      >
        {props.children}
      </blockquote>
    ),
    ul: (props) => (
      <ul className="my-4 sm:my-6 space-y-2 list-none ml-4 sm:ml-6" {...props}>
        {props.children}
      </ul>
    ),
    ol: (props) => (
      <ol
        className="my-4 sm:my-6 space-y-2 list-decimal ml-6 sm:ml-8 marker:text-blue-600 dark:marker:text-blue-400 marker:font-semibold"
        {...props}
      >
        {props.children}
      </ol>
    ),
    li: (props) => {
      const childrenArray = React.Children.toArray(props.children);
      const isTaskList = childrenArray.some(
        (child: unknown) =>
          React.isValidElement(child) &&
          child.props &&
          typeof child.props === "object" &&
          "type" in child.props &&
          child.props.type === "checkbox"
      );

      if (isTaskList) {
        return (
          <li className="flex items-center mb-2" {...props}>
            {props.children}
          </li>
        );
      }

      return (
        <li
          className="text-gray-700 dark:text-gray-300 mb-2 relative before:content-['●'] before:text-blue-500 dark:before:text-blue-400 before:font-bold before:absolute before:-ml-4 sm:before:-ml-6 before:top-0"
          {...props}
        >
          {props.children}
        </li>
      );
    },
    code: ({ node, className, children, ...restProps }) => {
      // Determine if the code is inline by the absence of a className
      const isInline = !className;

      if (isInline) {
        return (
          <code
            className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono border border-gray-300 dark:border-gray-600 shadow-sm"
            {...restProps}
          >
            {children}
          </code>
        );
      }

      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      return (
        <div className="my-4 sm:my-6">
          {language && (
            <div className="bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 px-3 sm:px-4 py-2 text-xs font-mono border-b border-gray-700 dark:border-gray-600 rounded-t-lg">
              {language}
            </div>
          )}
          <pre
            className={`bg-gray-900 dark:bg-gray-950 text-green-400 dark:text-green-300 p-3 sm:p-4 lg:p-6 ${
              language ? "rounded-b-lg" : "rounded-lg"
            } overflow-x-auto border-l-4 border-blue-500 dark:border-blue-400 shadow-lg text-xs sm:text-sm`}
          >
            <code className="font-mono whitespace-pre">{children}</code>
          </pre>
        </div>
      );
    },
    pre: (props) => <pre {...props}>{props.children}</pre>,
    table: (props) => (
      <div className="my-4 sm:my-6 overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
          {...props}
        >
          {props.children}
        </table>
      </div>
    ),
    thead: (props) => (
      <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
        {props.children}
      </thead>
    ),
    tbody: (props) => (
      <tbody
        className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      >
        {props.children}
      </tbody>
    ),
    th: (props) => (
      <th
        className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        {...props}
      >
        {props.children}
      </th>
    ),
    td: (props) => (
      <td
        className="px-3 sm:px-6 py-2 sm:py-4 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
        {...props}
      >
        {props.children}
      </td>
    ),
    hr: (props) => (
      <hr
        className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-12"
        {...props}
      />
    ),
    strong: (props) => (
      <strong
        className="font-semibold text-gray-900 dark:text-gray-100"
        {...props}
      >
        {props.children}
      </strong>
    ),
    em: (props) => (
      <em className="italic text-gray-700 dark:text-gray-300" {...props}>
        {props.children}
      </em>
    ),
    del: (props) => (
      <del className="line-through text-gray-500 dark:text-gray-400" {...props}>
        {props.children}
      </del>
    ),
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeHighlight,
              [
                rehypeSanitize,
                {
                  ...defaultSchema,
                  tagNames: [...(defaultSchema.tagNames || []), "input"],
                  attributes: {
                    ...defaultSchema.attributes,
                    input: ["type", "checked", "disabled", "className"],
                  },
                },
              ],
            ]}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>

      <style jsx global>{`
        /* Custom scrollbar for code blocks */
        .prose pre {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }

        .prose pre::-webkit-scrollbar {
          height: 8px;
        }

        .prose pre::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }

        .prose pre::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        .prose pre::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }

        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }

        /* Syntax highlighting theme adjustments */
        .hljs {
          background: #1f2937 !important;
          color: #10b981 !important;
        }
      `}</style>
    </div>
  );
};

export default MarkdownPreviewer;
