"use client";

import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";

import { BlogData } from "@/types/blog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlogForm, BlogFormRef } from "@/components/blog/blog-form";
import {
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "@/lib/redux/api/blog.api";

interface EditBlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const router = useRouter();
  const formRef = useRef<BlogFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Unwrap the params Promise using React.use()
  const { slug } = use(params);

  // Fetch all blog posts
  const {
    data: blogsResponse,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetPostByIdQuery(slug, { skip: !slug });

  // Find the blog post by slug
  const blogPost = blogsResponse?.data;

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
      };

      await updatePost(updateData).unwrap();

      toast.success("Blog post updated successfully!");

      // Reset form and redirect
      formRef.current?.reset();
      router.push(`/blog/${slug}`); // or wherever you want to redirect
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-destructive">
                  Failed to Load Blog Post
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  {"status" in fetchError && fetchError.status === 404
                    ? "Blog post not found."
                    : "An error occurred while loading the blog post."}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={handleGoBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button onClick={handleRetry}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // No blog post found
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Blog Post Not Found
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" onClick={handleGoBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <nav className="hidden md:block sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto ">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              disabled={isLoading}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold truncate">
                Edit: {blogPost.title}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Blog Post
            </h1>
            <p className="text-muted-foreground">
              Make changes to your blog post and save when you are ready.
            </p>
          </div>

          {/* Blog Form */}
          <BlogForm
            ref={formRef}
            initialData={initialData}
            onSubmit={handleSubmit}
            disabled={isLoading}
          />

          {/* Metadata Footer */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
                <div className="space-y-1 sm:space-y-0">
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(blogPost.created_at ?? "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className="space-y-1 sm:space-y-0">
                  <p>
                    <span className="font-medium">Last updated:</span>{" "}
                    {new Date(blogPost.updated_at ?? "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
