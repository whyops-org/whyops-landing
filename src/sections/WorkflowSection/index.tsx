import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AlertCircle, Lightbulb, CheckCircle } from 'lucide-react';
import { colors, typography, spacing, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';

export const WorkflowSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  const steps = [
    {
      icon: AlertCircle,
      label: content.workflow.steps[0].label,
      title: content.workflow.steps[0].title,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      icon: Lightbulb,
      label: content.workflow.steps[1].label,
      title: content.workflow.steps[1].title,
      subtitle: content.workflow.steps[1].subtitle,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: CheckCircle,
      label: content.workflow.steps[2].label,
      title: content.workflow.steps[2].title,
      color: 'text-green-600 dark:text-green-400',
    },
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
            <h2 className={`${commonClasses.heading} text-[${typography.fontSize.hero}] md:text-6xl box-border caret-transparent leading-[${typography.lineHeight['2xl']}] md:leading-[${typography.lineHeight['3xl']}] max-w-4xl`}>
              {content.workflow.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: animations.duration.slow, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className={commonClasses.card + ' p-6'}>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-5 h-5 ${step.color}`} />
                      <span className={`text-xs font-medium ${commonClasses.muted} font-${typography.fontFamily.mono}`}>
                        {step.label}
                      </span>
                    </div>
                    <h3 className={`text-base font-medium mb-2 ${commonClasses.heading}`}>
                      {index + 1}. {step.title}
                    </h3>
                    {step.subtitle && (
                      <p className={`${commonClasses.body} text-sm leading-5 italic`}>
                        {step.subtitle}
                      </p>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`text-[${colors.border.strong}] dark:text-[${colors.dark.border.tertiary}]`}>
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
