"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Create page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <Card className="w-full border-destructive/20">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold text-destructive">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-base mt-2">
            We encountered an error while loading the blog creation page. This
            might be a temporary issue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              Error Details:
            </h3>
            <p className="text-sm font-mono text-destructive break-all">
              {error.message || "An unexpected error occurred"}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={reset}
              className="flex items-center gap-2 flex-1"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2 flex-1"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm mb-3">Still having trouble?</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Check your internet connection and try refreshing the page
              </p>
              <p>• Clear your browser cache and cookies</p>
              <p>• Try accessing the page in an incognito/private window</p>
            </div>

            <Button asChild variant="link" className="mt-4 p-0 h-auto text-sm">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
