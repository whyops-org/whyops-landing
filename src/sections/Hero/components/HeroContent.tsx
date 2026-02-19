'use client';

import { EmailSignup } from '@/components/EmailSignup';
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
        className="box-border caret-transparent flex flex-col gap-3 w-full mt-6"
      >
        <EmailSignup />
      </motion.div>
    </div>
  );
};
