export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  schedulingLink: process.env.NEXT_PUBLIC_SCHEDULING_LINK || 'https://cal.com/whyops',
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
