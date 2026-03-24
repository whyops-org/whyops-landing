import { brand, env } from '@/lib/env';
import { faqItems } from '@/lib/evidence';

const siteUrl = env.siteUrl;

export const buildHomeStructuredData = () => {
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;
  const softwareId = `${siteUrl}#software`;
  const faqId = `${siteUrl}#faq`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: brand.companyName,
        url: siteUrl,
        logo: `${siteUrl}/Logo.png`,
        sameAs: ['https://github.com/whyops-org'],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            url: env.schedulingLink,
            availableLanguage: ['English'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: brand.name,
        url: siteUrl,
        publisher: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': softwareId,
        name: brand.name,
        url: siteUrl,
        image: `${siteUrl}/twitter-og.png`,
        operatingSystem: 'Web',
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'AI agent observability',
        description:
          'WhyOps helps teams inspect agent decisions with decision-aware state, production replay, and multi-agent debugging.',
        featureList: [
          'Decision-aware state tracking',
          'Production replay for agent runs',
          'Interactive state diff and constraint tracking',
          'Multi-agent graph visibility',
        ],
        brand: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
};
