import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text?.trim().split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
    }
  }

  return "Just now";
}
export function extractFirst20Words(content: string): string {
  if (!content || typeof content !== "string") {
    return "";
  }

  // Remove markdown syntax and HTML tags
  const cleanContent = content
    // Remove markdown headers (# ## ### etc.)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown bold/italic (**text** or *text*)
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    // Remove markdown code blocks ```code```
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code `code`
    .replace(/`([^`]+)`/g, "$1")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove markdown lists (- * +)
    .replace(/^[\s]*[-*+]\s+/gm, "")
    // Remove numbered lists (1. 2. etc.)
    .replace(/^\d+\.\s+/gm, "")
    // Remove blockquotes (>)
    .replace(/^>\s*/gm, "")
    // Remove horizontal rules (--- or ***)
    .replace(/^[-*]{3,}$/gm, "")
    // Remove extra whitespace and newlines
    .replace(/\s+/g, " ")
    .trim();

  // Extract pure words (only letters and numbers, remove punctuation)
  const words = cleanContent
    .split(/\s+/)
    .map((word) => word.replace(/[^\w]/g, "")) // Remove all non-word characters
    .filter((word) => word.length > 0) // Remove empty strings
    .slice(0, 20); // Take only first 20 words

  return words.join(" ");
}
