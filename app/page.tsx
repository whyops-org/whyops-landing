'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { CodeSection } from "@/sections/CodeSection";
import { ComparisonSection } from "@/sections/ComparisonSection";
import { CompatibilityBadges } from "@/sections/CompatibilityBadges";
import { CTASection } from "@/sections/CTASection";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { HeroPreview } from "@/sections/Hero/components/HeroPreview";
import { Navbar } from "@/sections/Navbar";
import { PlatformSection } from "@/sections/PlatformSection";
import { ProblemSection } from "@/sections/ProblemSection";
import { SolutionSection } from "@/sections/SolutionSection";
import { WorkflowSection } from "@/sections/WorkflowSection";

export default function Home() {
  return (
    <ThemeProvider>
      <div id="top" className="text-ds-text-primary dark:text-ds-dark-text-primary text-base not-italic normal-nums font-normal accent-auto bg-ds-background dark:bg-ds-dark-background box-border caret-transparent block tracking-[normal] leading-6 list-outside list-disc pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-geist transition-colors duration-300">
        <div className="box-border caret-transparent hidden"></div>
        <div className="box-border caret-transparent isolate"></div>
        <div className="box-border caret-transparent hidden p-3"></div>
        <div className="relative box-border caret-transparent flex flex-col min-h-[1000px] border border-ds-border dark:border-ds-dark-border overflow-clip">
          <Navbar />
          <main className="box-border caret-transparent flex basis-[0%] flex-col grow">
            <div className="box-border px-3 md:px-10 caret-transparent max-w-[1400px] w-full border-ds-border dark:border-ds-dark-border mx-auto border-l border-r border-dashed">
              <Hero />
              <CompatibilityBadges />
              <section id="how-it-works" className="box-border caret-transparent gap-x-6 flex flex-col min-h-0 gap-y-6 mt-10 md:mt-40 md:gap-x-12 md:min-h-[1000px] md:gap-y-12">
                <CodeSection />
              </section>
            </div>
            <ProblemSection />
            <ComparisonSection />
            <SolutionSection />
            <WorkflowSection />
            <PlatformSection />
            <div className="box-border px-3 md:px-10 caret-transparent max-w-[1400px] w-full border-ds-border dark:border-ds-dark-border mx-auto border-l border-r border-dashed">
              <HeroPreview imagePath="/assets/TRACES.webp" />
            </div>
            <CTASection />
          </main>
          <Footer />
        </div>
        <section
          aria-label="Notifications alt+T"
          className="box-border caret-transparent"
        ></section>
        <div className="absolute box-border caret-transparent block"></div>
      </div>
    </ThemeProvider>
  );
}
