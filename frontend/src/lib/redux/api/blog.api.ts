import { CreateBlogResponse, GetBlogsResponse } from "@/types/api";
import { Blog } from "@/types/blog";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://35.200.241.91/api/v1" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // GET all posts
    getPosts: builder.query<
      GetBlogsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const { page = 1, limit = 10 } = params || {};
        return `/readall?page=${page}&limit=${limit}`;
      },
      providesTags: ["Post"],
    }),

    //GET recent posts
    getRecentPosts: builder.query<
      Blog[], // since it's just an array of blogs without pagination meta
      void
    >({
      query: () => `/recent`,
      providesTags: ["Post"],
      transformResponse: (response: GetBlogsResponse) => response.data,
    }),

    // GET single post by id
    getPostById: builder.query<CreateBlogResponse, string>({
      query: (id) => `/read/${id}`,
      providesTags: ["Post"],
    }),

    // CREATE post - Updated to return CreateBlogResponse
    createPost: builder.mutation<
      CreateBlogResponse,
      { formData: FormData; secret: string }
    >({
      query: ({ formData, secret }) => ({
        url: `/create?secret=${secret}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),

    // UPDATE post
    updatePost: builder.mutation<
      Blog,
      { id: string } & Partial<
        Omit<Blog, "blog_id" | "thumbnail" | "createdAt" | "updatedAt">
      >
    >({
      query: ({ id, ...rest }) => ({
        url: `/update/${id}`,
        method: "PUT",

        body: rest,
      }),
      invalidatesTags: ["Post"],
    }),

    // DELETE post
    deletePost: builder.mutation<
      { success: boolean; id: string },
      { id: number; secret: string }
    >({
      query: ({ id, secret }) => ({
        url: `/delete/${id}?secret=${encodeURIComponent(secret)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    // SEARCH posts
    getSearchBlogs: builder.query<
      GetBlogsResponse,
      { q: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const { q = "", page = 1, limit = 10 } = params || {};
        return {
          url: "/search",
          params: { q, page, limit },
        };
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetRecentPostsQuery,
  useGetSearchBlogsQuery,
} = blogApi;
