import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { FooterBrand } from "@/sections/Footer/components/FooterBrand";
import { FooterLinks } from "@/sections/Footer/components/FooterLinks";
import { env } from '@/lib/env';

export const FooterContent = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="box-border caret-transparent max-w-[1400px] w-full z-0 border-ds-border dark:border-ds-dark-border mx-auto px-2 py-12 border-l border-r border-dashed md:pt-60 md:px-0"
    >
      <div className="box-border caret-transparent gap-x-8 grid grid-cols-[repeat(1,minmax(0px,1fr))] max-w-screen-2xl gap-y-8 w-full mx-auto px-4 md:grid-cols-[repeat(4,minmax(0px,1fr))]">
        <FooterBrand />
        <FooterLinks
          title="Product"
          links={[
            { href: "#problem", text: "The Problem" },
            { href: "#solution", text: "Solution" },
            { href: "#platform", text: "Platform" },
          ]}
        />
        <FooterLinks
          title="Resources"
          links={[
            { href: `${env.siteUrl}/docs/introduction`, text: "Docs", external: true },
            { href: `${env.siteUrl}/docs/architecture/overview`, text: "Architecture", external: true },
            { href: `${env.siteUrl}/docs/sitemap.xml`, text: "Docs Sitemap", external: true },
            { href: `${env.siteUrl}/sitemap.xml`, text: "Sitemap", external: true },
            { href: `${env.siteUrl}/robots.txt`, text: "Robots", external: true },
          ]}
        />
      </div>
    </motion.div>
  );
};
