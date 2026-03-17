import { Citation } from '@/components/Citation';
import { animations, commonClasses, spacing, typography } from '@/design-system';
import { content } from '@/design-system/content';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { benchmarkEvidence } from '@/lib/evidence';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section id="problem" className={commonClasses.section}>
      <div className={commonClasses.container}>
        <div className={`box-border min-h-screen caret-transparent ${spacing.section.mobile.px} ${spacing.section.mobile.py} ${spacing.section.desktop.py}`}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower }}
            className="mb-16 md:mb-20"
          >
            <h2 className={`${commonClasses.heading} text-[${typography.fontSize.hero}] md:text-6xl box-border caret-transparent leading-[${typography.lineHeight['2xl']}] md:leading-[${typography.lineHeight['3xl']}] max-w-4xl mb-6`}>
              {content.problem.title}
            </h2>
            <p className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-2xl`}>
              {content.problem.subtitle} Microsoft reports that 78% of AI users are already bringing their own AI tools to work, while Grafana says 70% of organizations now manage four or more observability tools. That combination makes agent failures especially hard to explain.{' '}
              <Citation
                href="https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part"
                label="Microsoft Work Trend Index, 2024"
                className="inline"
              />{' '}
              <Citation
                href="https://grafana.com/observability-survey/2024/"
                label="Grafana Observability Survey 2024"
                className="inline"
              />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower, delay: 0.2 }}
            className="mb-16 md:mb-20"
          >
            <h3 className={`text-sm font-medium box-border caret-transparent leading-5 mb-8 ${commonClasses.muted} font-geist_mono`}>
              {content.problem.sectionTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.problem.challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: animations.duration.slow, delay: 0.3 + index * 0.1 }}
                  className={commonClasses.card + ' p-6'}
                >
                  <h4 className="text-base font-medium mb-3 dark:text-ds-dark-text-primary">
                    {challenge.title}
                  </h4>
                  <p className={`${commonClasses.body} text-sm leading-5 mb-4`}>
                    {challenge.description}
                  </p>
                  <div className="space-y-2">
                    {challenge.issues.map((issue) => (
                      <div key={issue} className="flex items-start gap-2">
                        <span className="text-status-error dark:text-status-errorDark text-sm mt-0.5">✖</span>
                        <span className={`${commonClasses.muted} text-sm leading-5`}>
                          {issue}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower, delay: 0.6 }}
          >
            <h3 className="text-2xl md:text-5xl font-medium mb-4 dark:text-ds-dark-text-primary font-f37stout">
              {content.problem.cost.title}
            </h3>
            <p className={`${commonClasses.body} text-base leading-6 mb-12 max-w-2xl`}>
              {content.problem.cost.subtitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benchmarkEvidence.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: animations.duration.slow, delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-medium mb-3 dark:text-ds-dark-text-primary font-f37stout">
                    {item.value}
                  </div>
                  <p className="mb-3 text-sm font-medium leading-5 text-ds-text-primary dark:text-ds-dark-text-primary">
                    {item.label}
                  </p>
                  <p className={`${commonClasses.muted} text-sm leading-5 mb-3`}>
                    {item.detail}
                  </p>
                  <Citation href={item.href} label={item.sourceLabel} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
