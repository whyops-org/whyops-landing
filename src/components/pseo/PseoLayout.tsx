'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { Footer } from "@/sections/Footer";
import { Navbar } from "@/sections/Navbar";

type PseoLayoutProps = {
  children: React.ReactNode;
};

export function PseoLayout({ children }: PseoLayoutProps) {
  return (
    <ThemeProvider>
      <div className="text-ds-text-primary dark:text-ds-dark-text-primary bg-ds-background dark:bg-ds-dark-background min-h-screen font-geist transition-colors duration-300">
        <div className="relative flex min-h-screen flex-col overflow-clip border border-ds-border dark:border-ds-dark-border">
          <Navbar />
          <main className="flex flex-1 flex-col pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
