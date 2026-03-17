import { motion } from 'framer-motion';
import { animations, commonClasses, spacing, typography } from '@/design-system';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { benchmarkEvidence, expertQuotes } from '@/lib/evidence';
import { Citation } from '@/components/Citation';

export const BenchmarksSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section id="benchmarks" className={`${commonClasses.section} bg-ds-backgroundSecondary dark:bg-ds-dark-background`}>
      <div className={commonClasses.container}>
        <div className={`box-border caret-transparent ${spacing.section.mobile.px} ${spacing.section.mobile.py} ${spacing.section.desktop.py}`}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: animations.duration.slower }}
            className="mb-16 md:mb-20"
          >
            <h2 className={`${commonClasses.heading} text-[${typography.fontSize.hero}] md:text-6xl box-border caret-transparent leading-[${typography.lineHeight['2xl']}] md:leading-[${typography.lineHeight['3xl']}] max-w-5xl mb-6`}>
              Benchmarks teams can actually cite
            </h2>
            <p className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-3xl`}>
              WhyOps is built for a market where AI adoption is ahead of governance, and where observability is still fragmented. The numbers below explain why agent debugging now needs decision context, not just traces.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
            {benchmarkEvidence.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: animations.duration.slow, delay: index * 0.1 }}
                className={`${commonClasses.card} p-6`}
              >
                <div className="text-4xl md:text-5xl font-medium mb-3 dark:text-ds-dark-text-primary font-f37stout">
                  {item.value}
                </div>
                <h3 className="text-base font-medium mb-3 dark:text-ds-dark-text-primary">
                  {item.label}
                </h3>
                <p className={`${commonClasses.body} text-sm leading-6 mb-4`}>
                  {item.detail}
                </p>
                <Citation href={item.href} label={item.sourceLabel} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertQuotes.map((quote, index) => (
              <motion.figure
                key={quote.person}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: animations.duration.slow, delay: 0.3 + index * 0.1 }}
                className={`${commonClasses.card} p-8`}
              >
                <blockquote className="text-lg leading-8 text-ds-text-primary dark:text-ds-dark-text-primary mb-6">
                  "{quote.quote}"
                </blockquote>
                <figcaption className="flex flex-col gap-2">
                  <div className="text-sm font-medium dark:text-ds-dark-text-primary">
                    {quote.person}
                  </div>
                  <div className={`${commonClasses.muted} text-sm`}>
                    {quote.role}
                  </div>
                  <Citation href={quote.href} label={quote.sourceLabel} />
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
