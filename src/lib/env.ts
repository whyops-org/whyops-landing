export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com',
  countriesApi:
    process.env.NEXT_PUBLIC_COUNTRIES_API ||
    "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,region,subregion,currencies,population,area,capital,languages",
  worldBankApi:
    process.env.WORLD_BANK_API ||
    "https://api.worldbank.org/v2/country?format=json&per_page=400",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  schedulingLink: process.env.NEXT_PUBLIC_SCHEDULING_LINK || 'https://cal.com/whyops',
  githubToken: process.env.GITHUB_TOKEN || '',
  geonamesUsername: process.env.GEONAMES_USERNAME || '',
  onetUsername: process.env.ONET_USERNAME || '',
  onetPassword: process.env.ONET_PASSWORD || '',
  docsUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/docs`,
  docsArchitectureUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/docs/architecture/overview`,
  docsSitemapUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/docs/sitemap.xml`,
  seoDescription:
    'WhyOps helps teams debug AI agents with decision-aware state tracking, production replay, and visual debugging.',
} as const;

export const brand = {
  name: 'WhyOps',
  companyName: 'WhyOps',
  url: env.siteUrl,
  logo: {
    src: '/WhyOpsLogo.svg',
    alt: 'WhyOps logo',
  },
  poweredBy: 'WhyOps',
} as const;
