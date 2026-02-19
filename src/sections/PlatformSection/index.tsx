import { animations, commonClasses, spacing, typography } from '@/design-system';
import { content } from '@/design-system/content';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { motion } from 'framer-motion';

export const PlatformSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section id="platform" className={commonClasses.section}>
      <div className={commonClasses.container}>
        <div className={`box-border caret-transparent ${spacing.section.mobile.px} ${spacing.section.mobile.py} ${spacing.section.desktop.py}`}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower }}
            className="mb-16 md:mb-20"
          >
            <h2 className={`${commonClasses.heading} text-[${typography.fontSize.hero}] md:text-6xl box-border caret-transparent leading-[${typography.lineHeight['2xl']}] md:leading-[${typography.lineHeight['3xl']}] max-w-4xl mb-6`}>
              {content.platform.title}
            </h2>
            <p className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-2xl`}>
              {content.platform.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.platform.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: animations.duration.slow, delay: 0.4 + index * 0.2 }}
                className={commonClasses.card + ' p-6'}
              >
                <h3 className={`text-base font-medium mb-3 ${commonClasses.heading}`}>
                  {feature.title}
                </h3>
                <p className={`${commonClasses.body} text-sm leading-5`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
