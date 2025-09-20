import { Blog } from "./blog";

export interface CreateBlogResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Blog;
  pagination?: null;
  request?: {
    ip: string;
    method: string;
    url: string;
  };
  token?: string | null;
}
export interface GetBlogsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Blog[];
  pagination?: Pagination | null;
  request?: unknown;
  token?: string | null;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
