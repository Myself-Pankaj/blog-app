"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { BlogData } from "@/types/blog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogForm, BlogFormRef } from "@/components/blog/blog-form";
import {
  useGetPostsQuery,
  useUpdatePostMutation,
} from "@/lib/redux/api/blog.api";

interface EditBlogPageProps {
  params: { slug: string };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const router = useRouter();
  const formRef = useRef<BlogFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all blog posts
  const {
    data: blogsResponse,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetPostsQuery();

  // Find the blog post by slug
  const blogPost = blogsResponse?.data?.find(
    (post) => post.slug === params.slug
  );

  // Update mutation
  const [updatePost] = useUpdatePostMutation();

  // Handle form submission
  const handleSubmit = async (formData: BlogData) => {
    if (!blogPost?.blog_id) {
      toast.error("Blog post ID not found");
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        id: String(blogPost.blog_id),
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        category: formData.category,
        signature: formData.signature,
        // Note: thumbnail handling might need special consideration
        // depending on your API implementation
      };

      await updatePost(updateData).unwrap();

      toast.success("Blog post updated successfully!");

      // Reset form and redirect
      formRef.current?.reset();
      router.push(`/blog/${params.slug}`); // or wherever you want to redirect
    } catch (error: unknown) {
      console.error("Update failed:", error);

      // Handle different error types
      if (
        typeof error === "object" &&
        error !== null &&
        ("status" in error || "data" in error)
      ) {
        const err = error as { status?: number; data?: { message?: string } };
        if (err.status === 401 || err.status === 403) {
          toast.error("Invalid signature. Please check your credentials.");
        } else if (err.status === 404) {
          toast.error("Blog post not found.");
        } else if (err.data?.message) {
          toast.error(err.data.message);
        } else {
          toast.error("Failed to update blog post. Please try again.");
        }
      } else {
        toast.error("Failed to update blog post. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleGoBack = () => {
    router.back();
  };

  // Handle retry on fetch error
  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Failed to Load Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {"status" in fetchError && fetchError.status === 404
                ? "Blog post not found."
                : "An error occurred while loading the blog post."}
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleRetry}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No blog post found
  if (!blogPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Blog Post Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    title: blogPost.title,
    content: blogPost.content,
    tags: blogPost.tags || [],
    category: blogPost.category,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-4"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your blog post: {blogPost.title}
        </p>
      </div>

      {/* Form */}
      <BlogForm
        ref={formRef}
        initialData={initialData}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />

      {/* Additional Actions */}
      <div className="max-w-3xl mx-auto mt-6 p-6">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Last updated:{" "}
            {new Date(blogPost.updated_at ?? "").toLocaleDateString()}
          </span>
          <span>
            Created: {new Date(blogPost.created_at ?? "").toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
