"use client";

import { HeroContent } from "@/sections/Hero/components/HeroContent";
import { motion } from 'framer-motion';
import Image from "next/image";

export const Hero = () => {
  return (
    <div className="box-border caret-transparent gap-x-8 flex flex-col min-h-0 gap-y-8 pt-32 md:flex-row md:min-h-[1000px]">
      <div className="box-border caret-transparent gap-x-6 flex basis-[0%] flex-col grow gap-y-6">
        <HeroContent />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/assets/hero2.webp"
            alt="WhyOps hero"
            width={1920}
            height={1080}
            priority
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </div>
  );
};
