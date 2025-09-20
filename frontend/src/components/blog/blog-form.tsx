"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogData } from "@/types/blog";

interface BlogFormProps {
  initialData?: Partial<Omit<BlogData, "signature">>;
  onSubmit: (data: BlogData) => Promise<void>; // Changed to async
  disabled?: boolean; // Added disabled prop
}

export interface BlogFormRef {
  reset: () => void;
}

export const BlogForm = forwardRef<BlogFormRef, BlogFormProps>(
  ({ initialData, onSubmit, disabled = false }, ref) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [tags, setTags] = useState((initialData?.tags || []).join(","));
    const [category, setCategory] = useState(initialData?.category || "");
    const [fileContent, setFileContent] = useState(initialData?.content || "");
    const [signature, setSignature] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [tabValue, setTabValue] = useState<"manual" | "upload">("manual");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Expose reset method to parent component
    useImperativeHandle(ref, () => ({
      reset: () => {
        setTitle("");
        setContent("");
        setTags("");
        setCategory("");
        setFileContent("");
        setSignature("");
        setThumbnail(null);
        setTabValue("manual");
        setError("");
        setIsSubmitting(false);

        // Reset file inputs
        const fileInputs = document.querySelectorAll(
          'input[type="file"]'
        ) as NodeListOf<HTMLInputElement>;
        fileInputs.forEach((input) => {
          input.value = "";
        });
      },
    }));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        setFileContent(text);
        setTabValue("upload");
      } catch {
        setError("Failed to read file. Please try again.");
      }
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      setThumbnail(e.target.files?.[0] || null);
    };

    const handleSubmit = async () => {
      if (disabled || isSubmitting) return;

      if (!signature.trim()) {
        setError("Please enter your signature to submit.");
        return;
      }

      if (!title.trim()) {
        setError("Please enter a title.");
        return;
      }

      const currentContent = tabValue === "upload" ? fileContent : content;
      if (!currentContent.trim()) {
        setError("Please enter some content.");
        return;
      }

      if (!category.trim()) {
        setError("Please enter a category.");
        return;
      }

      setError("");
      setIsSubmitting(true);

      try {
        const blogData: BlogData = {
          title: title.trim(),
          content: currentContent.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          category: category.trim(),
          signature: signature.trim(),
          thumbnail,
        };

        await onSubmit(blogData);
      } catch (err) {
        // Error handling is done in parent component
        console.error("Form submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    const isFormDisabled = disabled || isSubmitting;

    return (
      <Card className="max-w-3xl mx-auto p-6 shadow-lg dark:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">
            {initialData ? "Update Blog" : "Create Blog"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isFormDisabled}
                className="mt-1"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isFormDisabled}
                className="mt-1"
                placeholder="react, nextjs, typescript"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isFormDisabled}
                className="mt-1"
                placeholder="Technology, Lifestyle, etc."
              />
            </div>

            {/* Thumbnail */}
            <div>
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                disabled={isFormDisabled}
                className="mt-1"
              />
            </div>

            {/* Content Tabs */}
            <Tabs
              value={tabValue}
              onValueChange={(v) =>
                !isFormDisabled && setTabValue(v as "manual" | "upload")
              }
            >
              <TabsList className="grid w-full grid-cols-2 rounded-md border bg-background">
                <TabsTrigger value="manual" disabled={isFormDisabled}>
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="upload" disabled={isFormDisabled}>
                  Upload .md File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  className="mt-1 min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isFormDisabled}
                />
              </TabsContent>

              <TabsContent value="upload" className="mt-2">
                <Label htmlFor="file">Upload Markdown File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".md"
                  onChange={handleFileUpload}
                  disabled={isFormDisabled}
                  className="mt-1"
                />
                {fileContent && (
                  <div className="mt-3 p-3 border rounded-md bg-muted text-sm max-h-[200px] overflow-auto">
                    <pre className="whitespace-pre-wrap">{fileContent}</pre>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Signature */}
            <div>
              <Label htmlFor="signature">Signature (Required) *</Label>
              <Input
                id="signature"
                type="password"
                placeholder="Enter your secret signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                disabled={isFormDisabled}
                className="mt-1"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <Button
              className="w-full py-3 text-lg"
              onClick={handleSubmit}
              disabled={isFormDisabled}
            >
              {isSubmitting
                ? "Submitting..."
                : initialData
                ? "Update Blog"
                : "Submit Blog"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

BlogForm.displayName = "BlogForm";
