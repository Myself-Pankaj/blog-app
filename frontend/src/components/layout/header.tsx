"use client";
import { useRouter } from "next/navigation";
import { Search, Edit3, Sparkles, Menu } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../shared/theme-toggle";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo */}
          <div
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 font-bold text-lg sm:text-xl cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-extrabold tracking-tight">
              Blog App
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <Input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 hover:bg-card/70 focus:bg-card shadow-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => router.push("/create")}
              className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                <Edit3 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="font-semibold">Create Blog</span>
              </div>
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/30 transition-all duration-300" />
            </Button>

            <div className="p-1 rounded-lg bg-card/50 backdrop-blur-sm border border-border/40 hover:bg-card/70 transition-all duration-200">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-xl 
             bg-black dark:bg-white 
      
             active:scale-95 transition-all duration-200
             text-white dark:text-black shadow-sm"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-background/95 border-t border-border/40 backdrop-blur-lg">
          {/* Mobile Search */}
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Mobile Create Blog */}
          <Button
            onClick={() => {
              setMobileMenuOpen(false);
              router.push("/create");
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span>Create Blog</span>
            </div>
          </Button>
        </div>
      )}

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </header>
  );
}
