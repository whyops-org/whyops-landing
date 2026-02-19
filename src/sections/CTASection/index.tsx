import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { colors, typography, spacing, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const CTASection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section id="early-access" className={`${commonClasses.section} bg-[${colors.background.secondary}] dark:bg-[${colors.dark.background.DEFAULT}]`}>
      <div className={commonClasses.container}>
        <div className={`box-border caret-transparent ${spacing.section.mobile.px} ${spacing.section.mobile.py} ${spacing.section.desktop.py}`}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower }}
            className="text-center"
          >
            <h2 className={`${commonClasses.heading} text-[${typography.fontSize.hero}] md:text-6xl box-border caret-transparent leading-[${typography.lineHeight['2xl']}] md:leading-[${typography.lineHeight['3xl']}] max-w-4xl mx-auto mb-6`}>
              {content.finalCta.title}
            </h2>
            <p className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-2xl mx-auto mb-12`}>
              {content.finalCta.subtitle}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a href="#early-access" className={commonClasses.buttonPrimary}>
                {content.cta.primary}
              </a>
              <a href="#contact" className={commonClasses.buttonSecondary}>
                {content.cta.tertiary}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
