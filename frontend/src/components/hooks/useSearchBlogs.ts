import { useCallback } from "react";
import { useMemo } from "react";

import { useSearch } from "../context/SearchContext";
import { Blog } from "@/types/blog";
import { Pagination } from "@/types/api";
import {
  useGetPostsQuery,
  useGetSearchBlogsQuery,
} from "@/lib/redux/api/blog.api";

interface UseSearchBlogsResult {
  data: Blog[];
  pagination: Pagination | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isSearchMode: boolean;
  page: number;
  setPage: (page: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

interface UseSearchBlogsParams {
  page: number;
  setPage: (page: number) => void;
  limit?: number;
}

export const useSearchBlogs = ({
  page,
  setPage,
  limit = 4,
}: UseSearchBlogsParams): UseSearchBlogsResult => {
  const { debouncedQuery } = useSearch();

  // Reset to page 1 when search query changes
  const previousQuery = useMemo(() => debouncedQuery, [debouncedQuery]);

  useMemo(() => {
    if (previousQuery !== debouncedQuery) {
      setPage(1);
    }
  }, [debouncedQuery, previousQuery, setPage]);

  // Determine if we should search or get all posts
  const shouldSearch = debouncedQuery.length >= 2;

  // API calls - use conditional queries
  const {
    data: allPostsResponse,
    isLoading: allPostsLoading,
    isError: allPostsError,
    error: allPostsErrorDetails,
  } = useGetPostsQuery({ page, limit }, { skip: shouldSearch });

  const {
    data: searchResponse,
    isLoading: searchLoading,
    isError: searchError,
    error: searchErrorDetails,
  } = useGetSearchBlogsQuery(
    { q: debouncedQuery, page, limit },
    { skip: !shouldSearch }
  );

  const handlePrev = useCallback(() => {
    const currentPagination = shouldSearch
      ? searchResponse?.pagination
      : allPostsResponse?.pagination;
    if (currentPagination && page > 1) {
      setPage(page - 1);
    }
  }, [shouldSearch, searchResponse, allPostsResponse, page, setPage]);

  const handleNext = useCallback(() => {
    const currentPagination = shouldSearch
      ? searchResponse?.pagination
      : allPostsResponse?.pagination;
    if (currentPagination && page < currentPagination.totalPages) {
      setPage(page + 1);
    }
  }, [shouldSearch, searchResponse, allPostsResponse, page, setPage]);

  // Memoized results
  const results: UseSearchBlogsResult = useMemo(() => {
    if (shouldSearch) {
      return {
        data: searchResponse?.data || [],
        pagination: searchResponse?.pagination ?? undefined,
        isLoading: searchLoading,
        isError: searchError,
        error: searchErrorDetails,
        isSearchMode: true,
        page,
        setPage,
        handlePrev,
        handleNext,
      };
    }

    return {
      data: allPostsResponse?.data || [],
      pagination: allPostsResponse?.pagination ?? undefined,
      isLoading: allPostsLoading,
      isError: allPostsError,
      error: allPostsErrorDetails,
      isSearchMode: false,
      page,
      setPage,
      handlePrev,
      handleNext,
    };
  }, [
    shouldSearch,
    searchResponse,
    allPostsResponse,
    searchLoading,
    allPostsLoading,
    searchError,
    allPostsError,
    searchErrorDetails,
    allPostsErrorDetails,
    page,
    setPage,
    handlePrev,
    handleNext,
  ]);

  return results;
};
