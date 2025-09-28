"use client";

import React, { createContext, useContext, useState } from "react";

// Mobile Menu Context
const MobileMenuContext = createContext<{
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
} | null>(null);

export function MobileMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within MobileMenuProvider");
  }
  return context;
}

// Client Layout Wrapper
export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mobileMenuOpen } = useMobileMenu();

  return (
    <main
      className={`transition-all duration-300 ${
        mobileMenuOpen
          ? "pt-[180px] md:pt-24" // Adjust this value based on your mobile menu height
          : "pt-16 md:pt-14"
      }`}
    >
      {children}
    </main>
  );
}
