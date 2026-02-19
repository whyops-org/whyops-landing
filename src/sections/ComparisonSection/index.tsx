import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Check, X } from 'lucide-react';
import { colors, typography, spacing, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const ComparisonSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  const comparisonData = [
    { feature: 'Decision context (why)', langsmith: false, langfuse: false, whyops: 'Clear decision paths' },
    { feature: 'State tracking', langsmith: false, langfuse: false, whyops: 'Full run history' },
    { feature: 'Production replay', langsmith: false, langfuse: false, whyops: 'One-click reproduction' },
    { feature: 'Context drift', langsmith: false, langfuse: false, whyops: 'Visible in the UI' },
    { feature: 'Multi-agent graph', langsmith: false, langfuse: false, whyops: 'Causality chains' },
  ];

  return (
    <section className={`${commonClasses.section} bg-[${colors.background.secondary}] dark:bg-[${colors.dark.background.DEFAULT}]`}>
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
              {content.comparison.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 md:mb-20">
            {content.comparison.competitors.map((competitor, index) => (
              <motion.div
                key={competitor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: animations.duration.slow, delay: index * 0.1 }}
                className={commonClasses.card + ' p-6'}
              >
                <h3 className={`text-base font-medium mb-2 dark:text-[${colors.dark.text.primary}]`}>
                  {competitor.name}
                </h3>
                <p className={`${commonClasses.muted} text-sm leading-5`}>
                  {competitor.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower, delay: 0.4 }}
            className="mb-12"
          >
            <h3 className={`text-2xl md:text-3xl font-medium mb-4 dark:text-[${colors.dark.text.primary}] font-${typography.fontFamily.display}`}>
              {content.comparison.subtitle}
            </h3>
            <p className={`${commonClasses.body} text-base leading-6 max-w-2xl`}>
              {content.comparison.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower, delay: 0.6 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}]`}>
                  <th className={`text-left py-4 px-4 text-sm font-medium dark:text-[${colors.dark.text.primary}]`}>
                    Capability
                  </th>
                  <th className={`text-center py-4 px-4 text-sm font-medium dark:text-[${colors.dark.text.primary}]`}>
                    LangSmith
                  </th>
                  <th className={`text-center py-4 px-4 text-sm font-medium dark:text-[${colors.dark.text.primary}]`}>
                    Langfuse
                  </th>
                  <th className={`text-center py-4 px-4 text-sm font-medium dark:text-[${colors.dark.text.primary}]`}>
                    WhyOps
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-[${colors.border.DEFAULT}] dark:border-[${colors.dark.border.secondary}]`}
                  >
                    <td className={`py-4 px-4 text-sm dark:text-[${colors.dark.text.secondary}]`}>
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className={`text-sm dark:text-[${colors.dark.text.secondary}]`}>
                          {row.whyops}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
