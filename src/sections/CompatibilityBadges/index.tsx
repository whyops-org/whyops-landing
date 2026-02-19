import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { colors, borders, spacing, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const CompatibilityBadges = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: animations.duration.slow }}
      className={`items-center box-border caret-transparent ${spacing.gap.lg} flex flex-col justify-center w-full py-12 ${spacing.section.mobile.px} border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.DEFAULT}] ${borders.sides.top} ${borders.style.dashed} md:flex-row md:py-16`}
    >
      {content.compatibility.badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: animations.duration.slow, delay: index * 0.1 }}
          className="items-center box-border caret-transparent gap-x-3 flex flex-col gap-y-3 text-center"
        >
          <div className={`text-sm font-medium box-border caret-transparent px-4 py-2 ${borders.radius.sm} border border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}] ${borders.style.dashed} bg-[${colors.background.DEFAULT}] dark:bg-[${colors.dark.background.tertiary}] dark:text-[${colors.dark.text.primary}]`}>
            {badge.label}
          </div>
          <p className={`${commonClasses.muted} text-sm box-border caret-transparent leading-5`}>
            {badge.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};
