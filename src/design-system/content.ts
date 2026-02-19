export const content = {
  site: {
    name: 'WhyOps',
    tagline: 'See the why behind every agent action.',
    description: 'WhyOps makes agent decisions legible, replayable, and fixable. Stop guessing, start shipping reliable autonomy.',
    copyright: '© 2026 WhyOps',
  },
  
  navigation: {
    links: [
      { href: '#problem', text: 'The Problem' },
      { href: '#solution', text: 'Solution' },
      { href: '#platform', text: 'Platform' },
    ],
  },
  
  cta: {
    primary: 'Get Early Access',
    secondary: 'See How It Works',
    tertiary: 'Talk to Us',
    docs: 'Read the docs',
  },
  
  compatibility: {
    title: 'Works well with',
    badges: [
      { label: 'All Framework', description: 'Fits your stack' },
      { label: 'All LLM', description: 'Any model provider' },
      { label: 'All Tool', description: 'Any tool or API' },
    ],
  },
  
  problem: {
    title: 'The Core Challenge',
    subtitle: 'AI agents fail in production for reasons you can\'t see. Teams lack visibility into agent decision-making, so debugging becomes guesswork.',
    sectionTitle: 'Why teams get stuck',
    challenges: [
      {
        title: 'Context drift',
        description: 'Agents lose the thread mid-run. Prompts look fine, but decisions quietly change.',
        issues: ['Quality drops without warning', 'Hard to spot in real time'],
      },
      {
        title: 'Unreproducible failures',
        description: '"Works on my machine" doesn\'t apply. Real data and timing make failures hard to reproduce.',
        issues: ['Hours spent reproducing bugs', 'Fixes ship with low confidence'],
      },
      {
        title: 'Decision opacity',
        description: 'You can see outputs, but not why the agent chose a tool, ignored an instruction, or stopped early.',
        issues: ['Trial-and-error prompting', 'No safe iteration loop'],
      },
    ],
    cost: {
      title: 'The cost',
      subtitle: 'Invisible failures slow teams down. Every hour spent guessing is an hour not shipping. WhyOps turns uncertainty into clarity so teams can move fast with confidence.',
      metrics: [
        { time: 'Days', description: 'Lost to debugging opaque behavior' },
        { time: 'Weeks', description: 'To diagnose production-only failures' },
        { time: 'Months', description: 'To earn trust in autonomous systems' },
      ],
    },
  },
  
  comparison: {
    title: 'Where WhyOps fits',
    subtitle: 'The missing link: decision context',
    description: 'Others show what happened. WhyOps shows why it happened.',
    competitors: [
      { name: 'LangSmith', description: 'Great traces, limited agent reasoning.' },
      { name: 'Langfuse', description: 'Solid monitoring, shallow decision context.' },
      { name: 'Helicone', description: 'Strong metrics, limited debugging depth.' },
      { name: 'AgentOps', description: 'Basic monitoring, no replayable state.' },
    ],
  },
  
  solution: {
    title: 'The debugging copilot for agents',
    subtitle: 'Replay any run, inspect the decision trail, and share the exact state with your team.',
    features: [
      {
        title: 'Decision-aware state',
        description: 'Capture the state right before each decision so you can see what the agent saw.',
      },
      {
        title: 'Decision reasoning',
        description: 'Understand why a tool was chosen, why a step was skipped, and where the run veered off.',
      },
      {
        title: 'Production replay',
        description: 'Recreate production failures in dev with the exact context that caused the issue.',
      },
      {
        title: 'Multi-agent graph',
        description: 'See handoffs, dependencies, and where failures cascade across agents.',
      },
    ],
  },
  
  workflow: {
    title: 'From failure to fix, fast',
    steps: [
      {
        label: 'INCIDENT DETECTED',
        title: 'An agent fails in production',
      },
      {
        label: 'WHYOPS INSIGHT',
        title: 'WhyOps reveals the missing decision context',
        subtitle: 'Suggestion: tighten the instruction that was skipped.',
      },
      {
        label: 'RESOLUTION',
        title: 'Fix applied → replay verified → shipped',
      },
    ],
  },
  
  platform: {
    title: 'Visual Decision Debugger',
    subtitle: 'Inspect every decision as clearly as a code trace.',
    features: [
      {
        title: 'Interactive state diff',
        description: 'Compare state before/after any decision and pinpoint the change that mattered.',
      },
      {
        title: 'Constraint tracker',
        description: 'Track instructions and see the exact step where they were dropped.',
      },
      {
        title: 'Guided fixes',
        description: 'Turn failure patterns into clear, actionable fixes your team can apply.',
      },
    ],
  },
  
  finalCta: {
    title: 'Ready to ship with confidence?',
    subtitle: 'Join teams making agent decisions legible, replayable, and fixable.',
  },
  
  footer: {
    description: 'Making agent decisions legible, replayable, and fixable.',
    sections: [
      {
        title: 'Product',
        links: [
          { href: '#problem', text: 'The Problem' },
          { href: '#solution', text: 'Solution' },
          { href: '#platform', text: 'Platform' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/docs/introduction`, text: 'Docs', external: true },
          { href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/docs/architecture/overview`, text: 'Architecture', external: true },
          { href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/docs/sitemap.xml`, text: 'Docs Sitemap', external: true },
          { href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/sitemap.xml`, text: 'Sitemap', external: true },
          { href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://whyops.com'}/robots.txt`, text: 'Robots', external: true },
        ],
      },
    ],
    legal: [
      // { href: '/privacy', text: 'Privacy' },
      // { href: '/terms', text: 'Terms' },
      { href: 'https://github.com/whyops-org', text: 'Github' },
    ],
  },
  
  code: {
    title: 'Wrap your tools, route your LLM calls',
    subtitle: 'WhyOps integrates with your existing agent framework. Wrap tools to track execution, route LLM traffic through our proxy to capture decision context.',
    filename: 'whyops_weather_agent.ts',
    installCommands: {
      pnpm: 'pnpm add @whyops/ts',
      npm: 'npm install @whyops/ts',
      yarn: 'yarn add @whyops/ts',
      bun: 'bun add @whyops/ts',
    },
  },
} as const;
