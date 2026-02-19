import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { colors, typography, spacing, borders, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

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

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower, delay: 0.2 }}
            className={commonClasses.card + ' p-8 mb-12'}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xs font-medium mb-4 ${commonClasses.muted} font-${typography.fontFamily.mono}`}>
                  STATE INSPECTOR
                </h3>
                <div className={`space-y-2 text-sm font-${typography.fontFamily.mono}`}>
                  <div className={`dark:text-[${colors.dark.text.secondary}]`}>▼ Execution Context</div>
                  <div className={`pl-4 dark:text-[${colors.dark.text.secondary}]`}>▶ System Prompt</div>
                  <div className={`pl-4 dark:text-[${colors.dark.text.secondary}]`}>▶ History (3.5k)</div>
                  <div className={`pl-4 dark:text-[${colors.dark.text.secondary}]`}>▶ Retrieved Docs (Truncated)</div>
                  <div className={`dark:text-[${colors.dark.text.secondary}]`}>▼ Memory</div>
                  <div className={`pl-4 ${commonClasses.muted}`}>
                    user_id: "u_123"
                  </div>
                  <div className={`pl-4 ${commonClasses.muted}`}>
                    task: "research"
                  </div>
                </div>
              </div>
              <div>
                <h3 className={`text-xs font-medium mb-4 ${commonClasses.muted} font-${typography.fontFamily.mono}`}>
                  DECISION REASONING
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className={`text-sm font-medium mb-1 ${commonClasses.heading}`}>Selected Action</div>
                    <div className={`text-sm dark:text-[${colors.dark.text.secondary}]`}>Tool B: Search Web</div>
                    <div className={`text-xs ${commonClasses.muted}`}>
                      Confidence: 0.92
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium mb-1 ${commonClasses.heading}`}>Reasoning</div>
                    <div className={`text-sm ${commonClasses.body}`}>
                      "User asked for real-time data. Local DB is stale, so web search chosen."
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium mb-1 ${commonClasses.heading}`}>Constraints</div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 bg-[${colors.background.tertiary}] dark:bg-[${colors.dark.background.elevated}] ${borders.radius.sm} dark:text-[${colors.dark.text.secondary}] border border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}]`}>
                        no_code_gen
                      </span>
                      <span className={`text-xs px-2 py-1 bg-[${colors.background.tertiary}] dark:bg-[${colors.dark.background.elevated}] ${borders.radius.sm} dark:text-[${colors.dark.text.secondary}] border border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}]`}>
                        academic_only
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
