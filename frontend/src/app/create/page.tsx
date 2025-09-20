"use client";

import { BlogForm, BlogFormRef } from "@/components/blog/blog-form";
import { useCreatePostMutation } from "@/lib/redux/api/blog.api";
import { CreateBlogResponse } from "@/types/api";
import { BlogData } from "@/types/blog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PenTool, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<BlogFormRef>(null);
  const router = useRouter();

  const handleCreate = async (data: BlogData) => {
    // Prevent multiple submissions
    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);

    // Show loading toast
    const loadingToastId = toast.loading("Creating blog...");

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      formData.append("tags", JSON.stringify(data.tags));

      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      // Make API call
      const response: CreateBlogResponse = await createPost({
        formData,
        secret: data.signature,
      }).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show success message from API response
      toast.success(response.message || "Blog created successfully");

      // Reset form on success
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Extract error message with fallback
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to create blog. Please try again.";

      // Show error toast
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="h-9 w-9 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Create New Blog
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Share your thoughts with the world
                  </p>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="hidden sm:flex items-center space-x-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>Draft</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto px-0 sm:px-0">
          {/* Welcome Card */}
          <Card className="mb-6 sm:mb-8 mx-2 sm:mx-0 border-0 shadow-lg bg-gradient-to-r from-card via-card to-card/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Ready to create something amazing?</span>
              </CardTitle>
              <CardDescription className="text-base">
                Fill out the form below to publish your blog post. All fields
                marked with an asterisk are required.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Form Container */}
          <Card className="mx-2 sm:mx-0 shadow-xl border-0 bg-card/60 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Blog Details
                </CardTitle>
                {(isSubmitting || isLoading) && (
                  <Badge variant="outline" className="animate-pulse">
                    Publishing...
                  </Badge>
                )}
              </div>
              <Separator className="!mt-4" />
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <BlogForm
                ref={formRef}
                onSubmit={handleCreate}
                disabled={isSubmitting || isLoading}
              />
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6 sm:mt-8 mx-2 sm:mx-0 border-dashed bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Writing Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    Use a compelling title that captures your readers attention
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    Add relevant tags to help readers discover your content
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    Include a high-quality thumbnail image for better engagement
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isSubmitting || isLoading) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              <div>
                <p className="font-medium">Publishing your blog...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a moment
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
