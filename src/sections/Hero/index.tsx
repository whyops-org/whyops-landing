import { motion } from 'framer-motion';
import { HeroContent } from "@/sections/Hero/components/HeroContent";
import { HeroPreview } from "@/sections/Hero/components/HeroPreview";

export const Hero = () => {
  return (
    <div className="box-border caret-transparent gap-x-8 flex flex-col min-h-0 gap-y-8 pt-32 md:flex-row md:min-h-[1000px]">
      <div className="box-border caret-transparent gap-x-6 flex basis-[0%] flex-col grow gap-y-6">
        <HeroContent />
        <HeroPreview />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="items-center box-border caret-transparent gap-x-10 flex flex-col-reverse justify-center gap-y-10 w-full mt-10 px-6 md:flex-row md:justify-between md:mt-auto md:px-4"
        >
          <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2 flex-wrap justify-center md:justify-start">
            <p className="text-[oklab(0.145_-0.00000143796_0.00000340492_/_0.6)] text-xs box-border caret-transparent leading-4 font-geist_mono">
              Works well with
            </p>
            <a
              href="https://react.dev/"
              className="box-border caret-transparent block transition-transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-9.svg"
                alt="React"
                className="box-border caret-transparent h-4 w-4"
              />
            </a>
            <a
              href="https://nextjs.org/"
              className="box-border caret-transparent block transition-transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-10.svg"
                alt="Next.js"
                className="box-border caret-transparent h-4 w-4"
              />
            </a>
            <a
              href="https://tailwindcss.com/"
              className="box-border caret-transparent block transition-transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-11.svg"
                alt="Tailwind CSS"
                className="box-border caret-transparent h-4 w-4"
              />
            </a>
            <a
              href="https://ui.shadcn.com/"
              className="box-border caret-transparent block transition-transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-12.svg"
                alt="shadcn/ui"
                className="box-border caret-transparent h-4 w-4"
              />
            </a>
          </div>
          <div className="box-border caret-transparent gap-x-2 hidden min-h-0 min-w-0 gap-y-2 w-max md:flex md:min-h-[auto] md:min-w-[auto]">
            <button
              type="button"
              className="text-sm font-medium items-center bg-[lab(96.52_-0.0000298023_0.0000119209)] dark:bg-[lab(12_0_0)] caret-transparent gap-x-1.5 inline-flex shrink-0 h-8 justify-center leading-5 min-h-0 min-w-0 gap-y-1.5 text-center text-nowrap border border-[oklab(0.205_-0.00000207871_0.00000478327_/_0.1)] dark:border-[oklab(0.8_0_0_/_0.2)] px-3 py-0 rounded-sm border-dashed md:flex md:min-h-[auto] md:min-w-[auto] transition-all hover:bg-[lab(93.04_0.0000298023_-0.0000119209)] dark:hover:bg-[lab(15_0_0)]"
            >
              Support inbox
            </button>
            <button
              type="button"
              className="text-[lab(7.78201_-0.0000149012_0)] dark:text-[lab(95_0_0)] text-sm font-medium items-center bg-[lab(95.36_0_0)] dark:bg-[lab(15_0_0)] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,oklab(0.205_-0.00000207871_0.00000478327_/_0.2)_0px_0px_0px_2px,rgba(0,0,0,0)_0px_0px_0px_0px] caret-transparent gap-x-1.5 inline-flex shrink-0 h-8 justify-center leading-5 min-h-0 min-w-0 gap-y-1.5 text-center text-nowrap border px-3 py-0 rounded-sm border-solid border-transparent md:flex md:min-h-[auto] md:min-w-[auto] transition-all hover:bg-[lab(90.952_0_-0.0000119209)] dark:hover:bg-[lab(20_0_0)]"
            >
              Real-time conversation
            </button>
            <button
              type="button"
              className="text-[lab(7.78201_-0.0000149012_0)] dark:text-[lab(95_0_0)] text-sm font-medium items-center bg-[lab(95.36_0_0)] dark:bg-[lab(15_0_0)] caret-transparent gap-x-2 inline-flex shrink-0 h-8 justify-center leading-5 min-h-0 min-w-0 gap-y-2 text-center text-nowrap w-8 border p-0 rounded-sm border-solid border-transparent md:flex md:min-h-[auto] md:min-w-[auto] transition-all hover:bg-[lab(90.952_0_-0.0000119209)] dark:hover:bg-[lab(20_0_0)]"
            >
              <img
                src="https://c.animaapp.com/mlnjf5yy2zLUvi/assets/icon-13.svg"
                alt="Icon"
                className="text-[oklab(0.205_-0.00000207871_0.00000478327_/_0.6)] dark:text-[oklab(0.8_0_0)] box-border caret-transparent shrink-0 h-4 pointer-events-none text-nowrap w-4"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
