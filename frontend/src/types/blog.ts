export interface Blog {
  blog_id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  thumbnail?: string | null;
  signature?: string;
  created_at?: string;
  updated_at?: string;
}
export interface BlogData {
  title: string;
  content: string;
  tags: string[];
  category: string;
  signature: string;
  thumbnail?: File | null;
}
export interface MarkdownPreviewerProps {
  markdown: string;
  className?: string;
}
