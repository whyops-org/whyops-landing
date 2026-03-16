'use client';

import { commonClasses } from '@/design-system';
import { content } from '@/design-system/content';
import { motion } from 'framer-motion';

export const HeroContent = () => {
  return (
    <div className="items-start box-border caret-transparent flex flex-col gap-3 pb-8 px-4 md:px-0">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl dark:text-ds-dark-text-primary box-border caret-transparent leading-tight max-w-4xl text-left font-f37stout md:text-6xl md:leading-tight"
      >
        {content.site.tagline}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-2xl`}
      >
        {content.site.description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="box-border w-full caret-transparent mt-6"
      >
        <a
          href={content.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonClasses.buttonPrimary} md:w-fit w-full group relative inline-flex h-11 overflow-hidden px-4 pr-3 text-sm shadow-[0_10px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5`}
        >
          <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_52%)] opacity-80 transition-opacity duration-200 group-hover:opacity-100" />
          <span className="relative flex items-center gap-2.5">
            <span>{content.cta.primary}</span>
            <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5">
            </span>
          </span>
        </a>
      </motion.div>
    </div>
  );
};
