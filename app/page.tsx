'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { BenchmarksSection } from "@/sections/BenchmarksSection";
import { CodeSection } from "@/sections/CodeSection";
import { ComparisonSection } from "@/sections/ComparisonSection";
import { CompatibilityBadges } from "@/sections/CompatibilityBadges";
import { CTASection } from "@/sections/CTASection";
import { Footer } from "@/sections/Footer";
import { FAQSection } from "@/sections/FAQSection";
import { Hero } from "@/sections/Hero";
import { Navbar } from "@/sections/Navbar";
import { PlatformSection } from "@/sections/PlatformSection";
import { ProblemSection } from "@/sections/ProblemSection";
import { SolutionSection } from "@/sections/SolutionSection";
import { WorkflowSection } from "@/sections/WorkflowSection";
import { JsonLd } from "@/components/JsonLd";
import { buildHomeStructuredData } from "@/lib/structuredData";
import { motion } from 'framer-motion';
import Image from "next/image";

export default function Home() {
  return (
    <ThemeProvider>
      <div id="top" className="text-ds-text-primary dark:text-ds-dark-text-primary text-base not-italic normal-nums font-normal accent-auto bg-ds-background dark:bg-ds-dark-background box-border caret-transparent block tracking-[normal] leading-6 list-outside list-disc pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-geist transition-colors duration-300">
        <JsonLd data={buildHomeStructuredData()} />
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
            <BenchmarksSection />
            <ComparisonSection />
            <SolutionSection />
            <WorkflowSection />
            <PlatformSection />
            <FAQSection />
            <div className="box-border px-3 md:px-10 caret-transparent max-w-[1400px] w-full border-ds-border dark:border-ds-dark-border mx-auto border-l border-r border-dashed">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/assets/cta2.webp"
                  alt="WhyOps mid section"
                  width={1920}
                  height={1080}
                  className="h-auto w-full"
                />
              </motion.div>
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
