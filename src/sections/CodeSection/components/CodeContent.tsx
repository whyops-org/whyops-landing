import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { colors, typography, spacing, borders, animations, commonClasses } from '@/design-system';
import { content } from '@/design-system/content';
import { CodeInstallation } from "@/sections/CodeSection/components/CodeInstallation";
import { env } from '@/lib/env';

export const CodeContent = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: animations.duration.slower, ease: animations.easing.smooth }}
      className={`relative box-border caret-transparent ${spacing.gap.sm} flex basis-[0%] flex-col grow col-end-auto col-start-auto justify-center overflow-hidden pt-20 pb-4 px-4 md:col-end-[span_3] md:col-start-[span_3] md:pt-0 md:px-0`}
    >
      <p className={`${commonClasses.muted} text-xs box-border caret-transparent leading-4 font-${typography.fontFamily.mono}`}>
        {content.code.filename}
      </p>
      <h2 className={`text-3xl md:text-4xl box-border caret-transparent leading-10 max-w-screen-md w-full font-${typography.fontFamily.display} ${commonClasses.heading}`}>
        {content.code.title}
      </h2>
      <p className={`${commonClasses.body} box-border caret-transparent max-w-screen-md w-full md:w-[83.3333%]`}>
        {content.code.subtitle}
      </p>
      <div className={`bg-ds-backgroundSecondary dark:bg-ds-dark-backgroundTertiary box-border caret-transparent w-full md:w-[83.3333%] border border-ds-border dark:border-ds-dark-borderSecondary mt-6 ${borders.style.dashed}`}>
        <CodeInstallation />
      </div>
      <div className={`[align-items:normal] box-border caret-transparent gap-x-3 flex flex-col max-w-none gap-y-3 w-full mt-6 md:items-center md:gap-x-6 md:flex-row md:max-w-full md:gap-y-6`}>
        <a href="#early-access" className={commonClasses.buttonPrimary + ' md:w-[250px]'}>
          {content.cta.primary}
        </a>
        <a
          href={`${env.siteUrl}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClasses.buttonSecondary}
        >
          {content.cta.docs}
        </a>
      </div>
    </motion.div>
  );
};
