import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProviders } from "@/components/providers/redux-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: {
    default: "My Blog App",
    template: "%s | My Blog App",
  },
  description:
    "A simple production-ready blogging platform built with Next.js 15",
  keywords: ["Next.js 15", "Blog", "SEO", "Node.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoMono.variable}  antialiased`}>
        <ReduxProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="pt-20">{children}</main>
            <Toaster />
          </ThemeProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
