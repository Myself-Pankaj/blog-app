"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Blog page error:", error);
  }, [error]);

  const text = `We're sorry, but we couldn't load the blog post you're looking for.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          An error occurred while loading the blog post. This could be due to a
          network issue or a problem with the server.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">{text}</p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reset} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            asChild
            className="inline-flex items-center gap-2"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
