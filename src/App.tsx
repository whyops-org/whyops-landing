import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { CompatibilityBadges } from "@/sections/CompatibilityBadges";
import { CodeSection } from "@/sections/CodeSection";
import { ProblemSection } from "@/sections/ProblemSection";
import { ComparisonSection } from "@/sections/ComparisonSection";
import { SolutionSection } from "@/sections/SolutionSection";
import { WorkflowSection } from "@/sections/WorkflowSection";
import { PlatformSection } from "@/sections/PlatformSection";
import { CTASection } from "@/sections/CTASection";
import { Footer } from "@/sections/Footer";
import { FloatingButton } from "@/components/FloatingButton";

export const App = () => {
  return (
    <ThemeProvider>
      <div className="text-[lab(2.75381_0_0)] dark:text-[lab(95_0_0)] text-base not-italic normal-nums font-normal accent-auto bg-[lab(98.84_0.0000298023_-0.0000119209)] dark:bg-[lab(7_0_0)] box-border caret-transparent block tracking-[normal] leading-6 list-outside list-disc pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-geist transition-colors duration-300">
        <div className="box-border caret-transparent hidden"></div>
        <div className="box-border caret-transparent isolate"></div>
        <div className="bg-[oklab(0.969998_-0.00000959635_0.0000227094_/_0.5)] box-border caret-transparent hidden p-3"></div>
        <div className="relative box-border caret-transparent flex flex-col min-h-[1000px] border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] overflow-clip border-l border-r border-dashed">
          <Navbar />
          <main className="box-border caret-transparent flex basis-[0%] flex-col grow">
            <div className="box-border caret-transparent max-w-[1400px] w-full border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.1)] mx-auto border-l border-r border-dashed">
              <Hero />
              <CompatibilityBadges />
              <section id="how-it-works" className="box-border caret-transparent gap-x-6 flex flex-col min-h-0 gap-y-6 mt-20 md:mt-40 md:gap-x-12 md:min-h-[1000px] md:gap-y-12">
                <CodeSection />
              </section>
            </div>
            <ProblemSection />
            <ComparisonSection />
            <SolutionSection />
            <WorkflowSection />
            <PlatformSection />
            <CTASection />
          </main>
          <Footer />
          <FloatingButton />
        </div>
        <section
          aria-label="Notifications alt+T"
          className="box-border caret-transparent"
        ></section>
        <div className="absolute box-border caret-transparent block"></div>
      </div>
    </ThemeProvider>
  );
};
