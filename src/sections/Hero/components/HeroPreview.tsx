import { BrowserMockup } from "@/sections/Hero/components/BrowserMockup";
import { motion } from 'framer-motion';

const PREVIEW_IMAGE_URL = "/assets/widget-bg-1.jpg";

export const HeroPreview = ({ imagePath = PREVIEW_IMAGE_URL }) => {
  return (
    <div className="relative items-center box-border caret-transparent hidden justify-center min-h-[500px] w-full border-ds-border dark:border-ds-dark-border overflow-hidden border-b border-t border-dashed md:flex md:min-h-[600px] lg:min-h-[700px] md:max-h-[60dvh] md:px-6 md:py-6">
      <div className="absolute box-border caret-transparent z-0 inset-0">
        <picture className="absolute box-border caret-transparent block inset-0">
          <img
            alt="WhyOps Background"
            sizes="100vw"
            src="/assets/hero-bg-1.jpg"
            className="aspect-[auto_1920_/_1080] box-border caret-transparent grayscale-[0.5] h-full max-w-full object-cover object-center w-full"
          />
        </picture>
        <div className="absolute box-border caret-transparent h-full w-full overflow-hidden inset-0">
          <img
            alt="WhyOps Background"
            sizes="100vw"
            src="/assets/hero-bg-2.jpg"
            className="absolute text-transparent box-border h-full max-w-full object-cover w-full inset-0"
          />
          <div className="absolute items-center box-border caret-transparent flex justify-center mix-blend-multiply opacity-30 pointer-events-none inset-0">
            <img
              src="/assets/hero-overlay-1.png"
              alt="Overlay"
              className="box-border caret-transparent h-auto max-w-full w-auto"
            />
          </div>
        </div>
      </div>
      <div className="relative items-center box-border caret-transparent flex justify-center z-10 w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <BrowserMockup imageUrl={imagePath} />
        </motion.div>
      </div>
    </div>
  );
};
