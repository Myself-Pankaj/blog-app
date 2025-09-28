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

import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CreatePage() {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<BlogFormRef>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Sticky Header */}

      <nav className="hidden md:block sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">All Articles</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto px-0 sm:px-0">
          {/* Welcome Card - Enhanced Design */}
          <Card className="mb-6 sm:mb-8 mx-2 sm:mx-0 border-0 shadow-lg bg-gradient-to-r from-card via-card/95 to-card/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Ready to create something amazing?
                </span>
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/90">
                Fill out the form below to publish your blog post. All fields
                marked with an asterisk are required.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Enhanced Form Container */}
          <Card className="mx-2 sm:mx-0 shadow-xl border-0 bg-card/70 backdrop-blur-md ring-1 ring-border/50">
            <CardHeader className="space-y-1 pb-6 bg-gradient-to-r from-transparent via-muted/5 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <div className="h-1 w-8 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                  <span>Blog Details</span>
                </CardTitle>
              </div>
              <Separator className="!mt-4 bg-gradient-to-r from-transparent via-border to-transparent" />
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <BlogForm
                ref={formRef}
                onSubmit={handleCreate}
                disabled={isSubmitting || isLoading}
              />
            </CardContent>
          </Card>

          {/* Enhanced Tips Card */}
          <Card className="mt-6 sm:mt-8 mx-2 sm:mx-0 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/20 via-muted/10 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <span>Writing Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm text-muted-foreground/90">
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/60 mt-2 flex-shrink-0" />
                  <span>
                    Use a compelling title that captures your readers attention
                  </span>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/60 mt-2 flex-shrink-0" />
                  <span>
                    Add relevant tags to help readers discover your content
                  </span>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-primary/60 mt-2 flex-shrink-0" />
                  <span>
                    Include a high-quality thumbnail image for better engagement
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Loading Overlay */}
      {(isSubmitting || isLoading) && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center">
          <Card className="p-8 shadow-2xl border-0 bg-card/95 backdrop-blur-sm ring-1 ring-border/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="animate-spin h-8 w-8 border-3 border-primary/20 border-t-primary rounded-full" />
                <div
                  className="absolute inset-1 animate-spin h-6 w-6 border-2 border-transparent border-t-primary/60 rounded-full"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1s",
                  }}
                />
              </div>
              <div>
                <p className="font-semibold text-lg">Publishing your blog...</p>
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
