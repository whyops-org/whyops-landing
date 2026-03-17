export const heroEvidence = [
  {
    value: '78%',
    label: 'of organizations used AI in 2024',
    detail: 'Stanford HAI says mainstream AI adoption is already here, which raises the cost of blind spots in production.',
    href: 'https://hai.stanford.edu/ai-index/2025-ai-index-report',
    sourceLabel: 'Stanford HAI, AI Index 2025',
  },
  {
    value: '75%',
    label: 'of knowledge workers already use AI at work',
    detail: 'Microsoft found generative AI use has moved from experimentation into day-to-day work.',
    href: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
    sourceLabel: 'Microsoft Work Trend Index, 2024',
  },
  {
    value: '78%',
    label: 'of AI users bring their own AI tools to work',
    detail: 'Tool sprawl makes governance and debugging harder before teams even standardize their stack.',
    href: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
    sourceLabel: 'Microsoft Work Trend Index, 2024',
  },
] as const;

export const benchmarkEvidence = [
  {
    value: '71%',
    label: 'use generative AI in at least one business function',
    detail: 'The problem is not AI adoption. It is making autonomous behavior inspectable once usage reaches production workflows.',
    href: 'https://hai.stanford.edu/ai-index/2025-ai-index-report',
    sourceLabel: 'Stanford HAI, AI Index 2025',
  },
  {
    value: '70%',
    label: 'of organizations rely on four or more observability tools',
    detail: 'Fragmented telemetry stacks already slow root-cause analysis before agent reasoning enters the picture.',
    href: 'https://grafana.com/observability-survey/2024/',
    sourceLabel: 'Grafana Observability Survey 2024',
  },
  {
    value: '79%',
    label: 'say centralized observability saved time or money',
    detail: 'Teams already see economic value in unified visibility. Agent debugging needs the same consolidation for decision context.',
    href: 'https://grafana.com/observability-survey/2024/',
    sourceLabel: 'Grafana Observability Survey 2024',
  },
] as const;

export const expertQuotes = [
  {
    quote: 'Observability is the ability to understand the internal state or condition of a complex system based solely on knowledge of its external outputs.',
    person: 'Chrystal R. China',
    role: 'IBM',
    href: 'https://www.ibm.com/think/topics/observability',
    sourceLabel: 'IBM, What Is Observability?',
  },
  {
    quote: 'Organizations that apply AI to drive growth, manage costs, and deliver greater value to their customers will pull ahead.',
    person: 'Lucy Debono',
    role: 'Modern Work Business Director, Microsoft Australia and New Zealand',
    href: 'https://news.microsoft.com/en-nz/2024/05/09/ai-at-work-is-here-now-comes-the-hard-part/',
    sourceLabel: 'Microsoft News, May 9, 2024',
  },
] as const;

export const faqItems = [
  {
    question: 'Why is agent debugging harder than normal application debugging?',
    answer:
      'Agent failures are driven by prompts, tool choices, hidden state, and changing context. Microsoft found that 78% of AI users are already bringing their own AI tools to work, while Grafana reports that 70% of organizations manage four or more observability tools. That combination makes root-cause analysis fragmented before teams even inspect agent reasoning.',
    citations: [
      {
        href: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
        label: 'Microsoft Work Trend Index, 2024',
      },
      {
        href: 'https://grafana.com/observability-survey/2024/',
        label: 'Grafana Observability Survey 2024',
      },
    ],
  },
  {
    question: 'What does decision-aware observability actually mean?',
    answer:
      'It means capturing the state, instructions, and outputs around each decision so teams can explain why an agent acted the way it did. IBM defines observability as understanding the internal state of a complex system from its external outputs. WhyOps applies that principle directly to agent behavior.',
    citations: [
      {
        href: 'https://www.ibm.com/think/topics/observability',
        label: 'IBM, What Is Observability?',
      },
    ],
  },
  {
    question: 'Why does replay matter for production AI systems?',
    answer:
      'Replay turns one-off incidents into repeatable debugging sessions. Stanford HAI reports that 71% of organizations already use generative AI in at least one business function, so teams need a way to reproduce failures with the exact context that caused them instead of guessing from logs alone.',
    citations: [
      {
        href: 'https://hai.stanford.edu/ai-index/2025-ai-index-report',
        label: 'Stanford HAI, AI Index 2025',
      },
    ],
  },
  {
    question: 'Why is centralized visibility important before scaling agents?',
    answer:
      'Because fragmented telemetry slows trust and incident response. Grafana found that 79% of organizations said centralized observability saved time or money. The same principle applies to agent systems: teams need one place to inspect decisions, replay runs, and share evidence during fixes.',
    citations: [
      {
        href: 'https://grafana.com/observability-survey/2024/',
        label: 'Grafana Observability Survey 2024',
      },
    ],
  },
] as const;
