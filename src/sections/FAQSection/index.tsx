import { motion } from 'framer-motion';
import { Citation } from '@/components/Citation';
import { animations, commonClasses, spacing, typography } from '@/design-system';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { faqItems } from '@/lib/evidence';

export const FAQSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section id="faq" className={commonClasses.section}>
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
              Frequently asked questions
            </h2>
            <p className={`${commonClasses.body} text-lg box-border caret-transparent leading-7 max-w-3xl`}>
              Clear answers for teams evaluating decision-aware observability, replay, and production debugging for AI agents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {faqItems.map((item, index) => (
              <motion.details
                key={item.question}
                initial={{ opacity: 0, y: 24 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: animations.duration.slow, delay: index * 0.08 }}
                className={`${commonClasses.card} group p-6`}
              >
                <summary className="cursor-pointer list-none pr-8 text-base font-medium text-ds-text-primary marker:hidden dark:text-ds-dark-text-primary">
                  {item.question}
                </summary>
                <div className="mt-4 max-w-3xl">
                  <p className={`${commonClasses.body} text-sm leading-6 mb-4`}>
                    {item.answer}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {item.citations.map((citation) => (
                      <Citation
                        key={citation.href}
                        href={citation.href}
                        label={citation.label}
                      />
                    ))}
                  </div>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
