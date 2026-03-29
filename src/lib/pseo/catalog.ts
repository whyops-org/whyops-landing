import type { PseoDatasetInput } from "@/lib/pseo/types";

export const whyopsPseoCatalog: PseoDatasetInput = {
  categories: [
    {
      name: "AI Agent Observability",
      description:
        "AI agent observability covers tracing, debugging, replay, and state inspection for multi-step agent workflows that call tools, maintain memory, and make branching decisions.",
      summary:
        "Teams use this category to understand why an agent made a decision, which tool call caused a failure, and how to reproduce a run with the same context.",
      subcategories: [
        {
          name: "Agent Tracing",
          description:
            "Trace spans, steps, prompts, outputs, and execution timing across a single agent run.",
          useCases: ["trace agent runs", "inspect execution trees"],
        },
        {
          name: "Replay Debugging",
          description:
            "Replay failed or surprising agent sessions with the same state and inputs.",
          useCases: ["replay failures", "compare run variants"],
        },
        {
          name: "Tool-Call Observability",
          description:
            "Monitor how agents call tools, handle retries, and map downstream failures back to decision logic.",
          useCases: ["inspect tool calls", "audit tool retries"],
        },
      ],
      useCases: [
        "trace agent runs",
        "inspect tool calls",
        "replay failures",
        "explain decision paths",
      ],
      industries: ["SaaS", "Fintech", "Healthcare", "Developer tools"],
      painPoints: [
        "Agent failures are hard to reproduce from logs alone",
        "Multi-step runs hide which decision caused the incident",
        "Tool-call errors get separated from the prompt or state that triggered them",
      ],
      examples: [
        {
          title: "Root-cause analysis for a failed support agent escalation",
          summary:
            "The example shows a support agent that chose the wrong escalation path after a low-confidence retrieval step.",
          takeaway:
            "What makes the example strong is the way trace context and replay isolate the exact decision boundary instead of blaming the final output.",
          category: "Replay Debugging",
        },
        {
          title: "Tool-call timeline for a coding agent run",
          summary:
            "This example maps tool invocations, retries, and state transitions across a code-editing workflow.",
          takeaway:
            "The value comes from showing how a single bad tool result cascades into later planning errors.",
          category: "Tool-Call Observability",
        },
        {
          title: "Decision graph for a multi-agent research workflow",
          summary:
            "The example breaks a coordinator and several worker agents into a visible dependency graph with handoff points.",
          takeaway:
            "It works because the reader can see how task routing, memory, and execution timing interact.",
          category: "Multi-agent visibility",
        },
        {
          title: "Replay-assisted regression review after a prompt change",
          summary:
            "The example compares two runs side by side after a system prompt revision caused lower tool precision.",
          takeaway:
            "It shows why replay and structured diffing matter more than anecdotal QA.",
          category: "Regression analysis",
        },
      ],
      templateAngles: [
        "incident review template",
        "agent rollout checklist",
        "runbook handoff template",
        "debug trace review template",
      ],
      glossaryTerms: [
        "agent tracing",
        "decision lineage",
        "tool-call observability",
        "replay debugging",
      ],
      directoryTags: ["tracing", "replay", "debugging", "multi-agent"],
    },
    {
      name: "AI Evaluation",
      description:
        "AI evaluation covers offline and online testing methods that measure answer quality, task completion, regression risk, and agent behavior against expected outcomes.",
      summary:
        "Teams use evaluation platforms to score outputs, compare experiments, and keep new releases from degrading quality in production.",
      subcategories: [
        {
          name: "Regression Testing",
          description:
            "Evaluate whether prompt, model, or workflow changes improve or degrade task outcomes.",
          useCases: ["run regression suites", "compare prompt variants"],
        },
        {
          name: "LLM-as-Judge",
          description:
            "Use model-based scoring to evaluate quality dimensions such as relevance, completeness, or factuality.",
          useCases: ["score generations", "rank outputs"],
        },
        {
          name: "Human Review Workflows",
          description:
            "Coordinate manual annotation, review queues, and adjudication for high-stakes outputs.",
          useCases: ["review outputs", "label evaluation datasets"],
        },
      ],
      useCases: [
        "run regression suites",
        "evaluate production quality",
        "compare prompt variants",
        "review outputs with humans",
      ],
      industries: ["SaaS", "Enterprise AI", "Data platforms"],
      painPoints: [
        "Quality regressions are discovered too late",
        "Teams lack a repeatable benchmark set",
        "Manual review is expensive without prioritization",
      ],
      examples: [
        {
          title: "Prompt regression suite for a support copilot",
          summary:
            "A benchmark set catches answer-quality regressions before the new prompt reaches production.",
          takeaway:
            "It works because the examples tie evaluation criteria to a stable workflow instead of one-off anecdotes.",
        },
        {
          title: "LLM-as-judge rubric for sales call summaries",
          summary:
            "This example scores completeness, action-item extraction, and tone with a reusable rubric.",
          takeaway:
            "The useful part is the explicit scoring logic, which makes the evaluation defensible.",
        },
        {
          title: "Human review queue for agent task completions",
          summary:
            "The workflow routes borderline outputs to humans while letting obvious passes and fails move automatically.",
          takeaway:
            "It works because evaluation cost is managed instead of treating all outputs as equal.",
        },
      ],
      templateAngles: [
        "evaluation rubric template",
        "benchmark dataset template",
        "regression review checklist",
      ],
      glossaryTerms: [
        "llm-as-judge",
        "evaluation dataset",
        "prompt regression testing",
      ],
      directoryTags: ["evals", "benchmarking", "human review", "quality scoring"],
    },
    {
      name: "AI Gateway",
      description:
        "AI gateways manage routing, retries, cost controls, and request policy across one or more model providers.",
      summary:
        "Teams use gateway platforms to centralize provider access, apply controls, and improve reliability without rewriting every application client.",
      subcategories: [
        {
          name: "Provider Routing",
          description:
            "Route traffic by cost, latency, region, or fallback conditions.",
          useCases: ["route model requests", "set provider fallbacks"],
        },
        {
          name: "Usage Governance",
          description:
            "Apply quotas, keys, tenant controls, and spend policies across AI traffic.",
          useCases: ["enforce quotas", "control spend"],
        },
        {
          name: "Gateway Analytics",
          description:
            "Monitor token usage, latency, errors, and provider-level request patterns.",
          useCases: ["monitor token spend", "track provider latency"],
        },
      ],
      useCases: [
        "route model requests",
        "control spend",
        "set provider fallbacks",
        "track provider latency",
      ],
      industries: ["SaaS", "Developer tools", "Platform teams"],
      painPoints: [
        "Multi-provider traffic becomes brittle quickly",
        "Cost controls are inconsistent across apps",
        "Fallback logic is hidden inside application code",
      ],
      examples: [
        {
          title: "Fallback routing between premium and budget models",
          summary:
            "A gateway sends high-priority traffic to one provider and shifts overflow to a lower-cost model.",
          takeaway:
            "The example works because routing criteria are explicit and measurable.",
        },
        {
          title: "Team-based quota controls for internal AI apps",
          summary:
            "Each internal product gets budget and token ceilings enforced at the gateway layer.",
          takeaway:
            "It shows how governance becomes easier when controls are centralized.",
        },
        {
          title: "Latency dashboard for provider performance",
          summary:
            "Provider latency and error rates are compared before rollout decisions are made.",
          takeaway:
            "The page works because operational metrics are tied to routing choices.",
        },
      ],
      templateAngles: [
        "routing policy template",
        "gateway governance template",
        "provider fallback playbook",
      ],
      glossaryTerms: ["provider routing", "model fallback", "gateway analytics"],
      directoryTags: ["routing", "gateway", "cost control", "fallbacks"],
    },
    {
      name: "AI Guardrails",
      description:
        "AI guardrails combine policy enforcement, safety checks, monitoring, and intervention logic to keep AI systems within operational and compliance boundaries.",
      summary:
        "Teams use guardrail systems to catch risky prompts, policy violations, unsafe outputs, and privacy-sensitive data before or after generation.",
      subcategories: [
        {
          name: "Policy Enforcement",
          description:
            "Define rules for allowed content, tools, and actions in AI workflows.",
          useCases: ["enforce safety policy", "restrict tool actions"],
        },
        {
          name: "Risk Monitoring",
          description:
            "Detect jailbreaks, hallucination patterns, or sensitive-data exposure in production traffic.",
          useCases: ["monitor safety events", "flag risky outputs"],
        },
        {
          name: "Compliance Controls",
          description:
            "Apply privacy and governance checks that matter in regulated environments.",
          useCases: ["screen for PII", "support audit reviews"],
        },
      ],
      useCases: [
        "enforce safety policy",
        "screen for PII",
        "flag risky outputs",
        "support audit reviews",
      ],
      industries: ["Healthcare", "Fintech", "Enterprise SaaS"],
      painPoints: [
        "Safety checks are inconsistent across apps",
        "Teams lack clear policy evidence during audits",
        "Risk monitoring arrives too late in the release cycle",
      ],
      examples: [
        {
          title: "PII screening for outbound assistant replies",
          summary:
            "Responses are checked for sensitive data before they reach an end user.",
          takeaway:
            "The example is effective because it ties the guardrail to a clear intervention point.",
        },
        {
          title: "Tool-action policy for internal finance agents",
          summary:
            "Only approved tool calls and arguments are allowed for specific finance workflows.",
          takeaway:
            "It works because policy is mapped to actual actions, not abstract principles.",
        },
        {
          title: "Jailbreak monitoring dashboard for enterprise support bots",
          summary:
            "Operators review patterns of risky prompts and policy-triggered interventions.",
          takeaway:
            "The example is useful because it converts risk into a measurable review process.",
        },
      ],
      templateAngles: [
        "guardrail review template",
        "policy mapping template",
        "risk escalation checklist",
      ],
      glossaryTerms: ["policy engine", "ai safety monitoring", "pii screening"],
      directoryTags: ["guardrails", "policy", "risk", "compliance"],
    },
  ],
  tools: [
    {
      name: "LangSmith",
      category: "AI Agent Observability",
      description:
        "LangSmith combines tracing, evaluation, prompt iteration, and deployment workflows for teams shipping LLM and agent applications.",
      pricingModel: "Platform pricing",
      strengths: ["rich traces", "evaluation workflows", "prompt iteration"],
      weaknesses: ["broad scope can add process overhead", "teams still need category-specific rollout rules"],
      bestFor: ["LangChain-heavy stacks", "teams that want tracing plus evals"],
      useCases: ["trace agent runs", "compare prompt variants", "review production regressions"],
      integrations: ["Slack", "GitHub Actions", "OpenTelemetry"],
      supportedFileFormats: ["JSON", "CSV", "YAML", "Markdown"],
      directoryTags: ["tracing", "evals", "prompt management"],
      verifiedFacts: [
        "LangSmith is positioned as part of the LangChain platform.",
        "Its product messaging emphasizes observability, evaluation, prompt engineering, and deployment.",
      ],
      milestones: [
        "Expanded from tracing into a broader platform workflow.",
        "Added platform messaging that connects observability and deployment.",
      ],
      website: "https://www.langchain.com/langsmith",
    },
    {
      name: "AgentOps",
      category: "AI Agent Observability",
      description:
        "AgentOps focuses on agent monitoring, tracing, and operational visibility for agentic systems.",
      pricingModel: "Usage-based",
      strengths: ["agent-focused telemetry", "session monitoring", "operational visibility"],
      weaknesses: ["narrower scope than full AI platforms", "teams may need extra tooling for eval depth"],
      bestFor: ["agent-first products", "teams optimizing agent reliability"],
      useCases: ["trace agent runs", "monitor sessions", "review agent failures"],
      integrations: ["Python SDK", "OpenTelemetry"],
      supportedFileFormats: ["JSON", "CSV", "Markdown"],
      directoryTags: ["agents", "monitoring", "tracing"],
      verifiedFacts: [
        "AgentOps positions itself around observability for agentic systems.",
        "Its messaging focuses on tracing and monitoring agent behavior.",
      ],
      milestones: [
        "Established an agent-first observability message.",
        "Built product positioning around production agent visibility.",
      ],
      website: "https://www.agentops.ai",
    },
    {
      name: "Langfuse",
      category: "AI Agent Observability",
      description:
        "Langfuse covers LLM application observability, tracing, evals, prompts, and metrics with an open-source-friendly posture.",
      pricingModel: "Open source plus cloud",
      strengths: ["open-source traction", "tracing plus evals", "prompt and metrics coverage"],
      weaknesses: ["teams still need opinionated operating processes", "broad feature set can require setup discipline"],
      bestFor: ["teams that want flexible observability", "organizations mixing evals and traces"],
      useCases: ["trace agent runs", "track quality metrics", "review prompt changes"],
      integrations: ["OpenTelemetry", "Python SDK", "TypeScript SDK"],
      supportedFileFormats: ["JSON", "CSV", "YAML", "NDJSON"],
      directoryTags: ["tracing", "metrics", "open source"],
      verifiedFacts: [
        "Langfuse documentation describes observability for LLM apps.",
        "Its docs cover traces, evals, prompts, and metrics.",
      ],
      milestones: [
        "Built around LLM observability and evaluation workflows.",
        "Expanded docs to cover prompts, metrics, and OpenTelemetry patterns.",
      ],
      website: "https://langfuse.com",
    },
    {
      name: "Phoenix",
      category: "AI Agent Observability",
      description:
        "Phoenix from Arize focuses on AI observability, tracing, and evaluation workflows for LLM and agent applications.",
      pricingModel: "Open source plus enterprise",
      strengths: ["tracing", "eval workflows", "open-source entry point"],
      weaknesses: ["teams may need more product process around operational ownership", "enterprise rollout still needs integration planning"],
      bestFor: ["teams that want observability plus eval depth", "Arize-aligned data orgs"],
      useCases: ["trace agent runs", "evaluate outputs", "analyze regressions"],
      integrations: ["OpenTelemetry", "Jupyter", "Python"],
      supportedFileFormats: ["JSON", "CSV", "Parquet"],
      directoryTags: ["tracing", "evals", "open source"],
      verifiedFacts: [
        "Phoenix is positioned by Arize for AI observability and evaluation.",
        "Its messaging includes tracing for LLM and agent applications.",
      ],
      milestones: [
        "Connected observability and evals in a single workflow.",
        "Extended product positioning into LLM and agent monitoring.",
      ],
      website: "https://arize.com/phoenix",
    },
    {
      name: "Braintrust",
      category: "AI Evaluation",
      description:
        "Braintrust focuses on evaluation, experiments, datasets, and repeatable quality measurement for AI applications.",
      pricingModel: "Platform pricing",
      strengths: ["evaluation depth", "experiment workflows", "dataset-centric review"],
      weaknesses: ["buyers still need a separate observability strategy", "evaluation programs require disciplined benchmark ownership"],
      bestFor: ["quality-focused AI teams", "benchmark-driven releases"],
      useCases: ["run regression suites", "evaluate production quality", "review benchmark datasets"],
      integrations: ["GitHub Actions", "Python", "Data pipelines"],
      supportedFileFormats: ["JSON", "CSV", "Parquet"],
      directoryTags: ["evals", "datasets", "experiments"],
      verifiedFacts: [
        "Braintrust positions around evaluations and quality workflows.",
        "Its messaging connects datasets, experiments, and eval programs.",
      ],
      milestones: [
        "Built a strong evaluation-centric position in the AI tooling market.",
        "Expanded messaging around experiments and benchmark workflows.",
      ],
      website: "https://www.braintrust.dev",
    },
    {
      name: "Weights & Biases Weave",
      category: "AI Evaluation",
      description:
        "Weave is positioned for tracing, evaluation, and experimentation in AI application development.",
      pricingModel: "Platform pricing",
      strengths: ["experimentation workflows", "trace visibility", "evaluation support"],
      weaknesses: ["buyers may need category-specific operating templates", "feature breadth can require careful adoption sequencing"],
      bestFor: ["ML teams already using W&B", "experimentation-heavy workflows"],
      useCases: ["compare prompt variants", "review traces", "run evaluation loops"],
      integrations: ["Python", "Jupyter", "W&B ecosystem"],
      supportedFileFormats: ["JSON", "CSV", "Markdown"],
      directoryTags: ["experiments", "traces", "mlops"],
      verifiedFacts: [
        "W&B Weave is positioned for tracing and evaluation in AI applications.",
        "Its product story aligns with experimentation-heavy teams.",
      ],
      milestones: [
        "Extended W&B from experiment tracking into AI app workflows.",
        "Connected tracing and evaluation under the Weave product line.",
      ],
      website: "https://wandb.ai/site/weave",
    },
    {
      name: "MLflow Tracing",
      category: "AI Evaluation",
      description:
        "MLflow tracing extends the MLflow ecosystem into tracing and evaluation workflows for GenAI applications.",
      pricingModel: "Open source plus managed options",
      strengths: ["familiar MLflow ecosystem", "experiment lineage", "tracing for GenAI"],
      weaknesses: ["less opinionated product UX for some teams", "setup depends on existing MLflow maturity"],
      bestFor: ["MLflow users", "teams that want experiment lineage and tracing"],
      useCases: ["trace GenAI runs", "compare experiments", "review model changes"],
      integrations: ["Python", "Databricks", "MLflow ecosystem"],
      supportedFileFormats: ["JSON", "CSV", "Parquet"],
      directoryTags: ["mlops", "tracing", "experiments"],
      verifiedFacts: [
        "MLflow has expanded into tracing for GenAI applications.",
        "Its tracing story fits teams already standardized on MLflow workflows.",
      ],
      milestones: [
        "Extended the MLflow platform into GenAI tracing.",
        "Linked tracing to experiment lineage for applied AI teams.",
      ],
      website: "https://mlflow.org",
    },
    {
      name: "Helicone",
      category: "AI Gateway",
      description:
        "Helicone combines AI gateway workflows with logging, analytics, caching, and reliability controls for model traffic.",
      pricingModel: "Usage-based",
      strengths: ["gateway controls", "request analytics", "caching and reliability"],
      weaknesses: ["not a full replacement for deep evaluation programs", "buyers need clear routing policy design"],
      bestFor: ["multi-provider traffic", "teams optimizing spend and reliability"],
      useCases: ["route model requests", "monitor token spend", "set provider fallbacks"],
      integrations: ["OpenAI-compatible APIs", "Anthropic-compatible APIs", "webhooks"],
      supportedFileFormats: ["JSON", "NDJSON", "CSV"],
      directoryTags: ["gateway", "routing", "analytics"],
      verifiedFacts: [
        "Helicone positions itself around an AI gateway and observability workflow.",
        "Its docs emphasize logging, analytics, caching, and routing controls.",
      ],
      milestones: [
        "Built from request analytics into broader gateway operations.",
        "Expanded messaging around reliability and provider control.",
      ],
      website: "https://www.helicone.ai",
    },
    {
      name: "Portkey",
      category: "AI Gateway",
      description:
        "Portkey provides gateway, reliability, and control-plane workflows for teams managing model traffic across providers.",
      pricingModel: "Platform pricing",
      strengths: ["provider control", "reliability workflows", "centralized governance"],
      weaknesses: ["teams still need downstream observability depth", "routing policy complexity can grow"],
      bestFor: ["platform teams", "multi-provider governance"],
      useCases: ["control spend", "set provider fallbacks", "govern model access"],
      integrations: ["OpenAI-compatible APIs", "Anthropic-compatible APIs", "Azure OpenAI"],
      supportedFileFormats: ["JSON", "CSV", "YAML"],
      directoryTags: ["gateway", "governance", "routing"],
      website: "https://portkey.ai",
    },
    {
      name: "Fiddler",
      category: "AI Guardrails",
      description:
        "Fiddler covers monitoring, guardrails, and observability for AI systems, including agentic workloads.",
      pricingModel: "Enterprise pricing",
      strengths: ["monitoring depth", "guardrails", "enterprise governance"],
      weaknesses: ["enterprise rollout can be heavyweight", "buyers may need narrower workflow pages for fast adoption"],
      bestFor: ["regulated environments", "teams that need governance and monitoring together"],
      useCases: ["monitor safety events", "screen for PII", "support audit reviews"],
      integrations: ["Cloud platforms", "enterprise data stacks", "APIs"],
      supportedFileFormats: ["JSON", "CSV", "Parquet"],
      directoryTags: ["guardrails", "monitoring", "compliance"],
      verifiedFacts: [
        "Fiddler positions around agentic observability and monitoring.",
        "Its product story emphasizes governance and enterprise AI controls.",
      ],
      milestones: [
        "Expanded from model monitoring into agentic observability narratives.",
        "Strengthened enterprise positioning around governance and guardrails.",
      ],
      website: "https://www.fiddler.ai",
    },
    {
      name: "Datadog LLM Observability",
      category: "AI Guardrails",
      description:
        "Datadog extends observability workflows into LLM applications with monitoring, analytics, and operational investigation.",
      pricingModel: "Consumption-based",
      strengths: ["existing observability footprint", "operational analytics", "team-wide visibility"],
      weaknesses: ["AI-specific eval depth may need complementary tooling", "platform breadth can dilute workflow guidance"],
      bestFor: ["teams already using Datadog", "centralized operations teams"],
      useCases: ["monitor safety events", "track latency and errors", "review production incidents"],
      integrations: ["OpenTelemetry", "cloud services", "Datadog platform"],
      supportedFileFormats: ["JSON", "CSV", "NDJSON"],
      directoryTags: ["monitoring", "ops", "analytics"],
      website: "https://www.datadoghq.com",
    },
    {
      name: "Azure AI Foundry Observability",
      category: "AI Guardrails",
      description:
        "Azure AI Foundry observability ties monitoring, evaluation, and governance into Microsoft-centered AI delivery workflows.",
      pricingModel: "Cloud consumption",
      strengths: ["Microsoft ecosystem fit", "monitoring plus governance", "enterprise readiness"],
      weaknesses: ["strongest in Azure-centered stacks", "multi-cloud neutrality may be lower"],
      bestFor: ["Microsoft-centered enterprises", "governed enterprise AI rollouts"],
      useCases: ["support audit reviews", "monitor production quality", "review safety posture"],
      integrations: ["Azure", "Microsoft ecosystem", "enterprise identity"],
      supportedFileFormats: ["JSON", "CSV", "Parquet"],
      directoryTags: ["enterprise", "governance", "monitoring"],
      website: "https://azure.microsoft.com",
    },
  ],
  locations: [
    {
      name: "San Francisco",
      region: "California",
      country: "United States",
      overview:
        "San Francisco buyers usually evaluate AI infrastructure through speed of experimentation, hiring density, and the ability to support fast product iteration without operational blind spots.",
      regulations: [
        "Enterprise buyers often ask for formal security review early",
        "Vendor due diligence tends to happen before broad rollout",
      ],
      pricingNotes: [
        "Budgets are often available for premium tooling when time-to-market is critical",
        "Teams still expect clear ROI for observability or governance layers",
      ],
      trends: [
        "Multi-agent workflows are moving from prototypes into internal production use",
        "Developer tooling buyers increasingly want replay and evaluation in the same workflow",
      ],
      recommendations: [
        "Lead with engineering velocity and incident resolution benefits",
        "Show product depth quickly because buyers compare many vendors in the same week",
      ],
      industries: ["SaaS", "AI infrastructure", "Developer tools"],
    },
    {
      name: "New York",
      region: "New York",
      country: "United States",
      overview:
        "New York teams often balance product speed with governance, especially when AI workflows touch customer communications, finance, or compliance-heavy operations.",
      regulations: [
        "Security and governance reviews frequently influence buying speed",
        "Stakeholders often expect audit-friendly process documentation",
      ],
      pricingNotes: [
        "Buyers compare platform breadth against team count and business-critical use cases",
        "Enterprise plans are common when governance requirements are high",
      ],
      trends: [
        "Internal copilots and workflow automation are common entry points",
        "Evaluation and guardrail categories are easier to justify when tied to operational risk",
      ],
      recommendations: [
        "Show governance and operational evidence together",
        "Position observability as a control layer, not just a debugging tool",
      ],
      industries: ["Fintech", "Media", "Enterprise SaaS"],
    },
    {
      name: "London",
      region: "England",
      country: "United Kingdom",
      overview:
        "London AI buyers often care about enterprise readiness, cross-functional governance, and vendor durability across international teams.",
      regulations: [
        "Cross-border data handling questions come up early in review",
        "Procurement often wants explicit governance documentation",
      ],
      pricingNotes: [
        "Platform consolidation can be a strong buying argument",
        "Pricing discussions often include international team rollout scope",
      ],
      trends: [
        "Enterprise copilots are moving into production support workflows",
        "Governance categories gain traction when paired with existing observability stacks",
      ],
      recommendations: [
        "Lead with auditability and operational visibility",
        "Use enterprise workflow examples instead of startup-only examples",
      ],
      industries: ["Finance", "Enterprise software", "Consulting"],
    },
    {
      name: "Berlin",
      region: "Berlin",
      country: "Germany",
      overview:
        "Berlin teams often evaluate AI tooling through privacy sensitivity, engineering control, and open-source comfort.",
      regulations: [
        "Privacy and data handling clarity matter in vendor review",
        "Teams often prefer explicit control over deployment and data flows",
      ],
      pricingNotes: [
        "Open-source entry points can shorten initial evaluation cycles",
        "Buyers still need a clear path from self-serve testing to production support",
      ],
      trends: [
        "Open-source AI tooling has strong credibility in early-stage adoption",
        "Observability categories gain traction when they reduce operational guesswork",
      ],
      recommendations: [
        "Emphasize transparency, control, and integration flexibility",
        "Support a gradual path from experimentation to production operations",
      ],
      industries: ["Developer tools", "B2B SaaS", "Industrial software"],
    },
    {
      name: "Bangalore",
      region: "Karnataka",
      country: "India",
      overview:
        "Bangalore buyers often evaluate AI infrastructure through engineering throughput, team productivity, and the ability to standardize quickly across growing product teams.",
      regulations: [
        "Enterprise buyers still expect formal security and access-control answers",
        "Shared-service platform teams often set the architectural standards",
      ],
      pricingNotes: [
        "Price-to-coverage ratio matters alongside product depth",
        "Teams often prefer platforms that reduce custom tooling maintenance",
      ],
      trends: [
        "Internal engineering copilots and workflow agents are growing fast",
        "Evaluation and observability layers are being added after the first production incidents",
      ],
      recommendations: [
        "Tie the page to developer productivity and standardization",
        "Use examples that show scale across multiple teams or products",
      ],
      industries: ["SaaS", "IT services", "Developer platforms"],
    },
    {
      name: "Singapore",
      region: "Singapore",
      country: "Singapore",
      overview:
        "Singapore teams often look for enterprise AI tooling that can balance regional scale, governance, and operational clarity.",
      regulations: [
        "Procurement often includes security and data-governance checkpoints",
        "Regional rollout plans matter when several business units are involved",
      ],
      pricingNotes: [
        "Platform consolidation can be easier to justify than fragmented point tools",
        "Buyers want fast time-to-value but still expect controlled rollout paths",
      ],
      trends: [
        "Regional enterprise AI programs are moving from pilots to governed rollouts",
        "Operational visibility categories gain traction after internal adoption expands",
      ],
      recommendations: [
        "Lead with enterprise control and regional rollout clarity",
        "Show how the category supports multiple teams without losing visibility",
      ],
      industries: ["Enterprise software", "Financial services", "Regional HQ operations"],
    },
    {
      name: "Toronto",
      region: "Ontario",
      country: "Canada",
      overview:
        "Toronto buyers often evaluate AI tooling through enterprise practicality, team collaboration, and the ability to operationalize experimentation responsibly.",
      regulations: [
        "Enterprise review usually includes privacy and process questions",
        "Buyers often expect clear ownership and implementation guidance",
      ],
      pricingNotes: [
        "Mid-market buyers compare platform breadth against implementation simplicity",
        "Proof of value matters before larger rollouts",
      ],
      trends: [
        "Agent workflows are being tested first in customer support and internal productivity",
        "Evaluation categories gain traction when tied to release quality",
      ],
      recommendations: [
        "Use pragmatic examples and clear rollout steps",
        "Avoid over-positioning the category as research-only infrastructure",
      ],
      industries: ["SaaS", "Enterprise software", "Services"],
    },
    {
      name: "Sydney",
      region: "New South Wales",
      country: "Australia",
      overview:
        "Sydney teams often want AI tooling that can show clear operating value quickly while still satisfying enterprise review expectations.",
      regulations: [
        "Security reviews are common in enterprise accounts",
        "Operational accountability matters in buyer conversations",
      ],
      pricingNotes: [
        "Budget approval often depends on fast, visible workflow gains",
        "Consolidated tooling can be attractive when teams are lean",
      ],
      trends: [
        "AI copilots and support workflows are common first deployments",
        "Observability and evaluation become priorities after teams scale usage",
      ],
      recommendations: [
        "Lead with workflow outcomes and operational proof",
        "Use examples that show value without large implementation teams",
      ],
      industries: ["Enterprise software", "Services", "B2B SaaS"],
    },
  ],
  personas: [
    {
      name: "AI Engineer",
      role: "AI Engineer",
      description:
        "AI engineers care about debugging speed, repeatable experiments, and the ability to understand model or agent behavior without reconstructing every run manually.",
      painPoints: [
        "Hard-to-reproduce failures waste engineering time",
        "Prompt and workflow changes are difficult to compare cleanly",
        "Operational telemetry is scattered across tools",
      ],
      goals: ["ship reliable AI workflows", "reduce debugging time", "compare variants safely"],
      benefits: [
        "Faster root-cause analysis",
        "Cleaner regression review workflows",
        "Better evidence for rollout decisions",
      ],
      industries: ["SaaS", "AI infrastructure"],
      recommendedUseCases: ["trace agent runs", "run regression suites", "review prompt changes"],
    },
    {
      name: "Platform Engineer",
      role: "Platform Engineer",
      description:
        "Platform engineers evaluate categories by operational standardization, integration fit, and long-term maintainability across many internal teams.",
      painPoints: [
        "AI tooling sprawl creates governance gaps",
        "Every team reimplements monitoring and controls differently",
        "Routing and policy logic become fragmented quickly",
      ],
      goals: ["standardize infrastructure", "centralize controls", "reduce custom maintenance"],
      benefits: [
        "Shared control planes",
        "More consistent observability and policy coverage",
        "Lower long-term operational entropy",
      ],
      industries: ["Developer tools", "Enterprise platforms"],
      recommendedUseCases: ["control spend", "monitor safety events", "trace agent runs"],
    },
    {
      name: "SRE",
      role: "Site Reliability Engineer",
      description:
        "SREs look for categories that make incidents easier to investigate and that expose failure patterns early enough to protect production reliability.",
      painPoints: [
        "AI incidents lack familiar investigation workflows",
        "Production signals do not explain causal decisions",
        "Ownership is blurry when models, prompts, and tools all contribute",
      ],
      goals: ["reduce incident resolution time", "improve production visibility", "tighten escalation clarity"],
      benefits: [
        "Better production evidence",
        "Faster incident triage",
        "Stronger service review loops",
      ],
      industries: ["SaaS", "Infrastructure"],
      recommendedUseCases: ["replay failures", "review production incidents", "track provider latency"],
    },
    {
      name: "Product Manager",
      role: "Product Manager",
      description:
        "Product managers need categories that help them reason about quality, release risk, and user-visible outcomes without depending entirely on ad hoc engineering explanations.",
      painPoints: [
        "Quality tradeoffs are hard to see before release",
        "Prompt and workflow changes are difficult to explain to stakeholders",
        "Tooling is often described in technical terms only",
      ],
      goals: ["ship dependable features", "understand release risk", "justify tooling investment"],
      benefits: [
        "Clearer release quality signals",
        "Better evidence for roadmap tradeoffs",
        "Stronger cross-functional alignment",
      ],
      industries: ["SaaS", "Enterprise software"],
      recommendedUseCases: ["evaluate production quality", "compare prompt variants", "review outputs with humans"],
    },
    {
      name: "Security Lead",
      role: "Security Lead",
      description:
        "Security leads look for categories that make policy evidence, access control, and sensitive-data protection visible before audit pressure appears.",
      painPoints: [
        "AI workflows introduce unclear policy boundaries",
        "Sensitive data can move through prompts and outputs unpredictably",
        "Audit evidence is hard to assemble after the fact",
      ],
      goals: ["enforce policy", "reduce exposure risk", "prepare for audit review"],
      benefits: [
        "Clearer policy enforcement",
        "Better evidence trails",
        "Stronger safety posture",
      ],
      industries: ["Healthcare", "Fintech", "Enterprise SaaS"],
      recommendedUseCases: ["screen for PII", "support audit reviews", "flag risky outputs"],
    },
    {
      name: "Data Scientist",
      role: "Data Scientist",
      description:
        "Data scientists care about reproducibility, dataset quality, evaluation integrity, and experiment lineage across iterative AI development.",
      painPoints: [
        "Benchmark sets are inconsistent or stale",
        "Experiment comparisons lack shared criteria",
        "Operational feedback is hard to loop back into evaluation datasets",
      ],
      goals: ["improve evaluation rigor", "reuse benchmark data", "tighten experiment loops"],
      benefits: [
        "Stronger benchmark discipline",
        "Better trace-to-dataset workflows",
        "Fewer blind evaluation spots",
      ],
      industries: ["Data platforms", "Applied AI"],
      recommendedUseCases: ["run regression suites", "review benchmark datasets", "compare experiments"],
    },
  ],
  file_formats: [
    {
      name: "JSON",
      extension: ".json",
      description:
        "JSON is a structured data format commonly used for traces, API payloads, prompt configs, and evaluation records.",
      useCases: ["structured traces", "API payloads", "evaluation records"],
      supportedTools: ["LangSmith", "Langfuse", "Phoenix", "Braintrust", "Helicone"],
      conversionTargets: ["CSV", "Markdown", "YAML", "NDJSON"],
    },
    {
      name: "CSV",
      extension: ".csv",
      description:
        "CSV works well for tabular exports, manual review, lightweight reporting, and benchmark dataset handling.",
      useCases: ["tabular exports", "manual review", "benchmark datasets"],
      supportedTools: ["LangSmith", "Langfuse", "Braintrust", "MLflow Tracing"],
      conversionTargets: ["JSON", "Markdown", "Parquet"],
    },
    {
      name: "YAML",
      extension: ".yaml",
      description:
        "YAML is often used for prompt definitions, policy configs, routing rules, and workflow settings.",
      useCases: ["policy configs", "routing rules", "prompt definitions"],
      supportedTools: ["LangSmith", "Langfuse", "Portkey"],
      conversionTargets: ["JSON", "Markdown"],
    },
    {
      name: "Markdown",
      extension: ".md",
      description:
        "Markdown is useful for human-readable runbooks, prompt notes, evaluation writeups, and operational templates.",
      useCases: ["runbooks", "evaluation writeups", "template docs"],
      supportedTools: ["LangSmith", "AgentOps", "Weights & Biases Weave"],
      conversionTargets: ["JSON", "PDF", "HTML"],
    },
    {
      name: "NDJSON",
      extension: ".ndjson",
      description:
        "NDJSON is useful for event streams, high-volume logs, and append-friendly telemetry pipelines.",
      useCases: ["event streams", "high-volume logs", "telemetry exports"],
      supportedTools: ["Langfuse", "Helicone", "Datadog LLM Observability"],
      conversionTargets: ["JSON", "CSV", "Parquet"],
    },
    {
      name: "Parquet",
      extension: ".parquet",
      description:
        "Parquet is a columnar format commonly used for analytics and warehouse-friendly AI telemetry storage.",
      useCases: ["warehouse analytics", "large benchmark datasets", "offline analysis"],
      supportedTools: ["Phoenix", "Braintrust", "MLflow Tracing", "Fiddler"],
      conversionTargets: ["CSV", "JSON"],
    },
    {
      name: "PDF",
      extension: ".pdf",
      description:
        "PDF is useful for document sharing and audit-ready exports when the reader needs a fixed presentation format.",
      useCases: ["audit packs", "stakeholder sharing", "formal reviews"],
      supportedTools: ["Markdown"],
      conversionTargets: ["Markdown", "HTML"],
    },
    {
      name: "HTML",
      extension: ".html",
      description:
        "HTML works for publishing operational docs, examples, and internal reference pages in a browser-friendly format.",
      useCases: ["publishing docs", "reference portals", "playbook pages"],
      supportedTools: ["Markdown"],
      conversionTargets: ["Markdown", "PDF"],
    },
  ],
  languages: [
    {
      name: "English",
      nativeName: "English",
      locale: "en-US",
      hreflang: "en-US",
      seoNotes: [
        "Keep terminology consistent across observability, evals, and debugging pages",
        "Use intent-specific titles instead of broad category slogans",
      ],
      culturalNotes: [
        "Readers usually expect direct problem framing and concrete workflow guidance",
        "Commercial investigation pages perform better when tradeoffs are explicit",
      ],
      localizedKeywords: [
        "ai agent observability",
        "llm observability",
        "agent debugging",
      ],
      localizedHeadline: "Build English-language AI infrastructure pages around clear workflow intent.",
      localizedSummary:
        "English searchers in this market usually want practical comparisons, setup guidance, and category definitions they can act on quickly.",
      ctaLabel: "Publish English pages with clear intent mapping and operational depth.",
    },
    {
      name: "Spanish",
      nativeName: "Español",
      locale: "es-ES",
      hreflang: "es-ES",
      seoNotes: [
        "Prefer localized phrasing over literal English loanwords when the audience already has a common native term",
        "Make use-case language explicit in headings",
      ],
      culturalNotes: [
        "Examples and explanations should feel practical, not overly abstract",
        "Trust increases when terminology is explained before advanced guidance appears",
      ],
      localizedKeywords: [
        "observabilidad de agentes de ia",
        "evaluación de ia",
        "puerta de enlace de ia",
      ],
      localizedHeadline: "Localiza las páginas de infraestructura de IA con intención de búsqueda clara.",
      localizedSummary:
        "Los lectores en español suelen valorar explicaciones directas, ejemplos útiles y una estructura que facilite la evaluación de herramientas.",
      ctaLabel: "Publica páginas en español con intención clara y contexto operativo.",
    },
    {
      name: "German",
      nativeName: "Deutsch",
      locale: "de-DE",
      hreflang: "de-DE",
      seoNotes: [
        "Use precise terminology and avoid vague category language",
        "Support claims with clear process or implementation context",
      ],
      culturalNotes: [
        "Readers often expect stronger structure and implementation clarity",
        "Governance and control themes should be framed explicitly when relevant",
      ],
      localizedKeywords: [
        "ki agent observability",
        "llm observability",
        "ki evaluation",
      ],
      localizedHeadline: "Lokalisieren Sie KI-Infrastrukturseiten mit klarer Suchintention.",
      localizedSummary:
        "Deutschsprachige Leser erwarten präzise Begriffe, nachvollziehbare Abläufe und klare Unterschiede zwischen Kategorien und Werkzeugen.",
      ctaLabel: "Veröffentlichen Sie deutsche Seiten mit präziser Suchintention und klaren Abläufen.",
    },
    {
      name: "French",
      nativeName: "Français",
      locale: "fr-FR",
      hreflang: "fr-FR",
      seoNotes: [
        "Localize category vocabulary instead of reusing untranslated English labels everywhere",
        "Use examples to make technical distinctions easier to follow",
      ],
      culturalNotes: [
        "Pages should explain why the category matters before going deep into tooling",
        "A balanced tone usually works better than aggressive marketing language",
      ],
      localizedKeywords: [
        "observabilité des agents ia",
        "évaluation ia",
        "garde-fous ia",
      ],
      localizedHeadline: "Localisez les pages d'infrastructure IA avec une intention de recherche claire.",
      localizedSummary:
        "Les lecteurs francophones recherchent souvent une explication claire du problème, puis des comparaisons et des guides de mise en œuvre.",
      ctaLabel: "Publiez des pages françaises avec un cadrage clair et une vraie utilité.",
    },
  ],
  integrations: [
    {
      name: "LangSmith and Slack",
      toolA: "LangSmith",
      toolB: "Slack",
      summary:
        "This integration routes trace findings and regression alerts into a team communication workflow.",
      setupSteps: [
        "Connect LangSmith project events to a Slack destination or webhook bridge",
        "Choose which trace or evaluation events should trigger notifications",
        "Define the channel routing and escalation rules for incidents or regressions",
      ],
      useCases: [
        "send regression alerts to product and engineering teams",
        "route investigation links into incident channels",
      ],
      workflowExample:
        "After a benchmark regression fails, the system posts a summary to Slack with a link to the trace, the changed prompt version, and the owner who should review it.",
      benefits: [
        "Shorter response time for evaluation failures",
        "Clearer ownership during debugging",
      ],
    },
    {
      name: "Langfuse and OpenTelemetry",
      toolA: "Langfuse",
      toolB: "OpenTelemetry",
      summary:
        "This integration aligns LLM traces with broader system telemetry so application and AI events can be reviewed together.",
      setupSteps: [
        "Enable OpenTelemetry instrumentation in the application or middleware layer",
        "Map request or trace identifiers into Langfuse events",
        "Validate that cross-system trace context remains stable in the observability workflow",
      ],
      useCases: [
        "correlate model latency with application incidents",
        "connect ai traces to service-level telemetry",
      ],
      workflowExample:
        "An incident review starts from an application error spike, follows the shared trace identifier, and lands in the Langfuse span that shows the delayed model call and retry behavior.",
      benefits: [
        "Better cross-stack incident analysis",
        "Less context switching between observability tools",
      ],
    },
    {
      name: "Braintrust and GitHub Actions",
      toolA: "Braintrust",
      toolB: "GitHub Actions",
      summary:
        "This integration runs evaluation suites automatically as part of the release pipeline.",
      setupSteps: [
        "Configure a benchmark or evaluation job in Braintrust",
        "Trigger the evaluation from GitHub Actions on pull request or merge events",
        "Set pass or fail thresholds that determine release readiness",
      ],
      useCases: [
        "block releases when benchmark quality drops",
        "compare prompt or model changes before merge",
      ],
      workflowExample:
        "A pull request changes prompt logic, GitHub Actions triggers Braintrust, and the merge is blocked until the benchmark returns to the expected quality threshold.",
      benefits: [
        "Cleaner release gates for AI features",
        "More repeatable regression review",
      ],
    },
    {
      name: "Helicone and OpenAI-compatible APIs",
      toolA: "Helicone",
      toolB: "OpenAI-compatible APIs",
      summary:
        "This integration places a gateway and analytics layer in front of compatible model traffic.",
      setupSteps: [
        "Point model requests through the Helicone gateway endpoint",
        "Apply routing, logging, or caching policies at the gateway layer",
        "Validate provider responses, spend tracking, and fallback behavior",
      ],
      useCases: [
        "monitor token spend across apps",
        "apply caching and fallback policy to model traffic",
      ],
      workflowExample:
        "A team routes support-bot traffic through the gateway, tracks spend by tenant, and falls back to a secondary provider when the primary latency crosses a threshold.",
      benefits: [
        "Centralized traffic controls",
        "Clearer usage analytics across providers",
      ],
    },
    {
      name: "Phoenix and Jupyter",
      toolA: "Phoenix",
      toolB: "Jupyter",
      summary:
        "This integration helps data scientists move between interactive analysis and observability or evaluation workflows.",
      setupSteps: [
        "Export or access relevant traces and evaluation artifacts from Phoenix",
        "Load the data into Jupyter for exploratory analysis",
        "Publish findings back into the evaluation or monitoring workflow",
      ],
      useCases: [
        "analyze regressions interactively",
        "review trace cohorts in notebook workflows",
      ],
      workflowExample:
        "A data scientist pulls a set of failed traces into a notebook, clusters the failure patterns, and feeds the insights back into the next evaluation rubric.",
      benefits: [
        "Faster exploratory analysis",
        "Stronger trace-to-evaluation feedback loops",
      ],
    },
    {
      name: "Fiddler and Datadog",
      toolA: "Fiddler",
      toolB: "Datadog",
      summary:
        "This integration pairs AI-specific guardrail review with broader operational monitoring.",
      setupSteps: [
        "Connect safety or policy events into the existing monitoring workflow",
        "Choose which incidents should create alerts or operational tickets",
        "Review escalation paths so security and operations teams see the same evidence",
      ],
      useCases: [
        "route guardrail incidents into operations workflows",
        "combine policy evidence with production alerting",
      ],
      workflowExample:
        "A risky-output event is captured in the guardrail system and then forwarded into the monitoring platform where it is correlated with the affected service and escalation owner.",
      benefits: [
        "Better coordination between security and ops",
        "Shared evidence during incident response",
      ],
    },
  ],
  glossary_terms: [
    {
      term: "Agent Tracing",
      definition:
        "Agent tracing records the steps, prompts, tool calls, and outputs that occur during an agent run.",
      technicalDepth:
        "In practice, tracing becomes more useful when it preserves execution order, shared context, and enough metadata to compare good and bad runs without guesswork.",
      relatedTerms: ["AI Agent Observability", "Tool-Call Observability", "Replay Debugging"],
    },
    {
      term: "Decision Lineage",
      definition:
        "Decision lineage explains how an AI system moved from context and instructions to a specific action or output.",
      technicalDepth:
        "The concept matters when teams need to connect hidden state, retrieved context, or tool results to the decision that followed, especially in branching agent workflows.",
      relatedTerms: ["AI Agent Observability", "Agent Tracing", "Replay Debugging"],
    },
    {
      term: "Tool-Call Observability",
      definition:
        "Tool-call observability focuses on how agents invoke tools, what arguments they pass, and which downstream outcomes those calls create.",
      technicalDepth:
        "It matters because agent failures are often rooted in tool selection, parameter formatting, retries, or unexpected external responses rather than in the final generated message alone.",
      relatedTerms: ["Agent Tracing", "AI Agent Observability", "Decision Lineage"],
    },
    {
      term: "Replay Debugging",
      definition:
        "Replay debugging reproduces an AI run so teams can inspect the same context, decisions, and outputs that appeared during the original incident.",
      technicalDepth:
        "The approach is most useful when it preserves state, timing, inputs, and prompt versions closely enough to make comparisons meaningful.",
      relatedTerms: ["AI Agent Observability", "Decision Lineage", "Prompt Regression Testing"],
    },
    {
      term: "Prompt Regression Testing",
      definition:
        "Prompt regression testing checks whether a prompt or workflow change improves or degrades results on a benchmark set.",
      technicalDepth:
        "A reliable regression workflow usually depends on stable test cases, explicit scoring criteria, and clear thresholds for release decisions.",
      relatedTerms: ["AI Evaluation", "LLM-as-Judge", "Evaluation Dataset"],
    },
    {
      term: "Evaluation Dataset",
      definition:
        "An evaluation dataset is a curated set of inputs, expected outcomes, or scoring rules used to measure AI system quality.",
      technicalDepth:
        "It becomes operationally important when teams use the dataset to compare releases, track regressions, or prioritize human review.",
      relatedTerms: ["AI Evaluation", "Prompt Regression Testing", "LLM-as-Judge"],
    },
    {
      term: "LLM-as-Judge",
      definition:
        "LLM-as-judge uses a language model to score or rank another model's output against a rubric.",
      technicalDepth:
        "The method works best when the rubric is explicit, the judged dimension is narrow enough to score consistently, and the organization validates the scoring behavior over time.",
      relatedTerms: ["AI Evaluation", "Evaluation Dataset", "Prompt Regression Testing"],
    },
    {
      term: "Provider Routing",
      definition:
        "Provider routing determines which model provider should handle a request based on rules such as latency, cost, region, or fallback status.",
      technicalDepth:
        "A useful routing system needs explicit policy logic, reliable telemetry, and clear ownership for fallback behavior when provider conditions change.",
      relatedTerms: ["AI Gateway", "Model Fallback", "Gateway Analytics"],
    },
    {
      term: "Model Fallback",
      definition:
        "Model fallback switches traffic from one provider or model to another when cost, latency, or error conditions require it.",
      technicalDepth:
        "Fallback policy becomes a production concern when the team must protect quality and reliability without hiding the operational tradeoffs.",
      relatedTerms: ["AI Gateway", "Provider Routing", "Gateway Analytics"],
    },
    {
      term: "Policy Engine",
      definition:
        "A policy engine applies rules that determine what an AI system is allowed to do, say, or access.",
      technicalDepth:
        "It matters when policy needs to be enforced consistently across prompts, tools, users, and outputs rather than left to scattered application logic.",
      relatedTerms: ["AI Guardrails", "PII Screening", "AI Safety Monitoring"],
    },
    {
      term: "PII Screening",
      definition:
        "PII screening checks prompts, context, or outputs for personally identifiable information that requires handling controls.",
      technicalDepth:
        "Effective screening depends on where the check runs, how exceptions are handled, and whether the event can be audited later.",
      relatedTerms: ["AI Guardrails", "Policy Engine", "AI Safety Monitoring"],
    },
  ],
  profiles: [
    {
      name: "WhyOps",
      role: "Product",
      company: "WhyOps",
      summary:
        "WhyOps is positioned as a decision-aware observability product for AI agents with replay and visual debugging workflows.",
      verifiedFacts: [
        "The WhyOps site positions the product around decision-aware observability for AI agents.",
        "The site messaging highlights state tracking, production replay, and visual debugging.",
      ],
      milestones: [
        "Defined a decision-aware observability category angle.",
        "Built product messaging around replay and multi-agent visibility.",
      ],
      uniqueInsight:
        "WhyOps can differentiate by leaning harder into replay, state inspection, and debugging-first workflows instead of broad platform sprawl.",
      website: "https://whyops.com",
    },
    {
      name: "LangSmith",
      role: "Product",
      company: "LangChain",
      summary:
        "LangSmith is positioned as a LangChain platform product spanning observability, evaluation, prompt engineering, and deployment workflows.",
      verifiedFacts: [
        "LangSmith is presented as part of the LangChain platform.",
        "Its public messaging emphasizes observability, evals, prompt engineering, and deployment.",
      ],
      milestones: [
        "Expanded beyond tracing into a broader AI application platform story.",
        "Connected observability with deployment and prompt workflows.",
      ],
      uniqueInsight:
        "LangSmith competes broadly across tracing and eval workflows, which creates an opening for narrower debugging-first positioning elsewhere.",
      website: "https://www.langchain.com/langsmith",
    },
    {
      name: "Braintrust",
      role: "Product",
      company: "Braintrust",
      summary:
        "Braintrust is positioned around evaluation, experiments, and dataset-driven quality workflows for AI applications.",
      verifiedFacts: [
        "Braintrust messaging emphasizes evaluations and experiments.",
        "Its product story ties benchmark workflows to release quality.",
      ],
      milestones: [
        "Built a strong evaluation-centered product narrative.",
        "Strengthened experiment and dataset workflow positioning.",
      ],
      uniqueInsight:
        "Braintrust is strongest where benchmark discipline matters, which makes it a useful contrast against pure observability tools.",
      website: "https://www.braintrust.dev",
    },
  ],
};
