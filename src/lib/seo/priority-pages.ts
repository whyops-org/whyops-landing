export type SiteLink = {
  href: string;
  label: string;
};

export type PriorityPage = SiteLink & {
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

export const servicePages: SiteLink[] = [
  { href: "/ai-agent-observability", label: "AI Agent Observability" },
  { href: "/ai-evaluation", label: "AI Evaluation" },
  { href: "/ai-gateway", label: "AI Gateway" },
  { href: "/ai-guardrails", label: "AI Guardrails" },
];

export const priorityPages: PriorityPage[] = [
  { href: "/", label: "WhyOps", priority: 1, changeFrequency: "weekly" },
  ...servicePages.map((page) => ({
    ...page,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  })),
  { href: "/blog", label: "Blog", priority: 0.7, changeFrequency: "weekly" },
];
