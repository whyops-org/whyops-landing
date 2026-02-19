import { motion } from 'framer-motion';
import { colors, typography, spacing, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const HeroContent = () => {
  return (
    <div className={`items-start box-border caret-transparent ${spacing.gap.sm} flex flex-col pb-8 ${spacing.section.mobile.px}`}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animations.duration.slow, delay: 0.2 }}
        className={`text-[${typography.fontSize.hero}] dark:text-[${colors.dark.text.primary}] box-border caret-transparent leading-[${typography.lineHeight['2xl']}] max-w-4xl text-left font-${typography.fontFamily.display} md:text-6xl md:leading-[${typography.lineHeight['3xl']}]`}
      >
        {content.site.tagline}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animations.duration.slow, delay: 0.3 }}
        className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-2xl`}
      >
        {content.site.description}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animations.duration.slow, delay: 0.4 }}
        className={`[align-items:normal] box-border caret-transparent gap-x-3 flex flex-col max-w-none gap-y-3 w-full mt-6 md:items-center md:gap-x-6 md:flex-row md:max-w-full md:gap-y-6`}
      >
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className={commonClasses.input + ' w-full md:w-[300px]'}
          />
          <a href="#early-access" className={commonClasses.buttonPrimary}>
            {content.cta.primary}
          </a>
        </div>
        <a href="#how-it-works" className={commonClasses.buttonSecondary}>
          {content.cta.secondary}
        </a>
      </motion.div>
    </div>
  );
};
