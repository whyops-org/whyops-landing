import { brand, env } from "@/lib/env";
import { attachDraftLinks } from "@/lib/pseo/link-graph";
import { dedupe, slugify } from "@/lib/pseo/normalize";
import type {
  NormalizedCategory,
  NormalizedDataset,
  NormalizedFileFormat,
  NormalizedGlossaryTerm,
  NormalizedIntegration,
  NormalizedLanguage,
  NormalizedLocation,
  NormalizedPersona,
  NormalizedProfile,
  NormalizedTool,
  PlaybookType,
  PseoBatchRequest,
  PseoBatchResponse,
  PseoPage,
} from "@/lib/pseo/types";

const BATCH_LIMIT = 100;
const UTILITY_PLAYBOOKS = new Set<PlaybookType>(["templates", "conversions", "integrations"]);
const PLAYBOOK_ORDER: PlaybookType[] = [
  "templates",
  "curation",
  "conversions",
  "comparisons",
  "examples",
  "locations",
  "personas",
  "integrations",
  "glossary",
  "translations",
  "directory",
  "profiles",
];

interface DraftPage extends PseoPage {
  topic_key: string;
  entity_keys: string[];
  intent_key: string;
  word_count: number;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function wordCount(text: string): number {
  return normalizeText(text).split(" ").filter(Boolean).length;
}

function computePageWordCount(page: PseoPage): number {
  return wordCount(
    [
      page.seo.title,
      page.seo.meta_description,
      page.content.h1,
      page.content.introduction,
      ...page.content.sections.flatMap((section) => [section.heading, section.body]),
      ...page.content.faq.flatMap((item) => [item.question, item.answer]),
      page.content.call_to_action,
    ].join(" "),
  );
}

function oxfordList(values: string[]): string {
  const filtered = dedupe(values).filter(Boolean);
  if (filtered.length === 0) {
    return "";
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  if (filtered.length === 2) {
    return `${filtered[0]} and ${filtered[1]}`;
  }
  return `${filtered.slice(0, -1).join(", ")}, and ${filtered.at(-1)}`;
}

function bullets(values: string[]): string {
  return dedupe(values)
    .filter(Boolean)
    .map((value) => `- ${value}`)
    .join("\n");
}

function joinParagraphs(values: Array<string | null | undefined>, fallback: string): string {
  const paragraphs = values.map((value) => normalizeText(value || "")).filter(Boolean);
  return paragraphs.length ? paragraphs.join("\n\n") : fallback;
}

function markdownTable(headers: string[], rows: string[][]): string {
  const headerRow = `| ${headers.join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
  return `${headerRow}\n${divider}\n${body}`;
}

function buildUrl(pathname: string, basePath = ""): string {
  const normalizedPath = `${basePath}/${pathname}`
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");

  return new URL(normalizedPath || "/", env.siteUrl).toString();
}

function lower(value?: string): string {
  return value ? slugify(value) : "";
}

function sharesAny(a: string[], b: string[]): boolean {
  const bSet = new Set(b);
  return a.some((value) => bSet.has(value));
}

function serviceSlug(service: string): string {
  return slugify(service);
}

function categoryServices(category: NormalizedCategory): string[] {
  return dedupe(category.useCases).filter(Boolean);
}

function personaServices(
  category: NormalizedCategory,
  persona: NormalizedPersona,
): string[] {
  return dedupe([...category.useCases, ...persona.recommendedUseCases]).filter(Boolean);
}

function findToolsForCategory(dataset: NormalizedDataset, category: NormalizedCategory): NormalizedTool[] {
  return dataset.tools.filter((tool) => lower(tool.category) === category.slug);
}

function findToolsForFormat(dataset: NormalizedDataset, format: NormalizedFileFormat): NormalizedTool[] {
  return dataset.tools.filter(
    (tool) =>
      tool.supportedFileFormats.map(lower).includes(format.slug) ||
      format.supportedTools.map(lower).includes(tool.slug),
  );
}

function tokens(value: string): string[] {
  return slugify(value).split("-").filter(Boolean);
}

function scoreToolForService(tool: NormalizedTool, service: string): number {
  const serviceTokens = tokens(service);
  if (!serviceTokens.length) {
    return 0;
  }

  const haystack = lower(
    [
      tool.name,
      tool.subcategory || "",
      tool.description || "",
      ...tool.bestFor,
      ...tool.useCases,
      ...tool.strengths,
      ...tool.directoryTags,
    ].join(" "),
  );

  return serviceTokens.reduce(
    (score, token) => score + (haystack.includes(token) ? 1 : 0),
    0,
  );
}

function rankToolsForService(tools: NormalizedTool[], service: string): NormalizedTool[] {
  return [...tools].sort((left, right) => {
    const scoreDelta = scoreToolForService(right, service) - scoreToolForService(left, service);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return (
      right.bestFor.length +
      right.useCases.length +
      right.strengths.length -
      (left.bestFor.length + left.useCases.length + left.strengths.length)
    );
  });
}

function shortlistToolsForService(
  tools: NormalizedTool[],
  service: string,
  limit = 5,
): NormalizedTool[] {
  const ranked = rankToolsForService(tools, service);
  const matched = ranked.filter((tool) => scoreToolForService(tool, service) > 0);
  return (matched.length ? matched : ranked).slice(0, limit);
}

function describeToolRecommendation(
  tool: NormalizedTool,
  category: NormalizedCategory,
  service?: string,
  locationName?: string,
): string {
  const fit = oxfordList(tool.bestFor.slice(0, 2)) || oxfordList(tool.useCases.slice(0, 2));
  const strengths = oxfordList(tool.strengths.slice(0, 2)) || tool.description;
  const weakness = oxfordList(tool.weaknesses.slice(0, 1));
  const serviceLine = service
    ? `For ${service}, ask the vendor to prove the workflow on a live scenario instead of a generic product tour.`
    : `Ask the vendor to prove one real workflow such as ${oxfordList(category.useCases.slice(0, 2))}.`;
  const locationLine = locationName
    ? `In ${locationName}, make the demo show how the tool fits the local budget and rollout expectations on this page.`
    : "Validate the main implementation tradeoff before you treat the shortlist as final.";

  return `${tool.name}: strongest for ${fit || "teams that need a dependable starting point"}. It stands out for ${strengths || "documented workflow fit"}. ${
    weakness ? `The main watch-out is ${weakness}.` : ""
  } ${serviceLine} ${locationLine}`;
}

function formatSearchIntent(playbook: PlaybookType): string {
  switch (playbook) {
    case "templates":
    case "conversions":
    case "integrations":
      return "utility";
    case "curation":
    case "comparisons":
    case "directory":
      return "commercial investigation";
    case "profiles":
      return "navigational and informational";
    default:
      return "informational";
  }
}

function minimumWordThreshold(playbook: PlaybookType): number {
  return UTILITY_PLAYBOOKS.has(playbook) ? 600 : 900;
}

function createPageDraft(
  page: PseoPage,
  topicKey: string,
  entityKeys: string[],
  intentKey?: string,
): DraftPage {
  const enrichedPage = ensureMinimumDepth(page);
  return {
    ...enrichedPage,
    topic_key: topicKey,
    entity_keys: dedupe(entityKeys),
    intent_key: intentKey || `${enrichedPage.playbook_type}:${slugify(enrichedPage.seo.primary_keyword)}`,
    word_count: computePageWordCount(enrichedPage),
  };
}

function buildFaq(question: string, answer: string) {
  return {
    question,
    answer,
  };
}

function buildSchema(type: string, structuredData: Record<string, unknown>) {
  return {
    type,
    structured_data: {
      "@context": "https://schema.org",
      "@type": type,
      ...structuredData,
    },
  };
}

function buildCta(primaryKeyword: string): string {
  return `Use ${brand.name} to turn ${primaryKeyword} research into an observable workflow with decision traces, replay, and implementation notes your team can actually reuse.`;
}

function ensureMinimumDepth(page: PseoPage): PseoPage {
  const minimumWords = minimumWordThreshold(page.playbook_type);
  let currentWordCount = computePageWordCount(page);

  if (currentWordCount >= minimumWords) {
    return page;
  }

  const nextSections = [...page.content.sections];
  const additions = buildDepthSections(page);

  additions.forEach((section) => {
    if (currentWordCount >= minimumWords) {
      return;
    }

    nextSections.push(section);
    currentWordCount += wordCount(`${section.heading} ${section.body}`);
  });

  if (currentWordCount < minimumWords) {
    const fallbackSections = buildFallbackDepthSections(page);

    fallbackSections.forEach((section) => {
      if (currentWordCount >= minimumWords) {
        return;
      }

      nextSections.push(section);
      currentWordCount += wordCount(`${section.heading} ${section.body}`);
    });
  }

  return {
    ...page,
    content: {
      ...page.content,
      sections: nextSections,
    },
  };
}

function buildDepthSections(page: PseoPage): Array<{ heading: string; body: string }> {
  const keyword = page.seo.primary_keyword;
  const h1 = page.content.h1;

  switch (page.playbook_type) {
    case "curation":
      return [
        {
          heading: `How to shortlist vendors after reading this ${h1} guide`,
          body: `Use the rankings to create a shortlist of two or three realistic options, then test them on one workflow that already matters to the business. Do not ask every vendor to prove everything at once. Ask each one to show how it handles the exact use case, the main integration dependency, and the weakness that would be most expensive if ignored. That makes the ${keyword} page operational instead of decorative and gives the reader a clean path from research into evaluation.`,
        },
        {
          heading: "Questions to ask during a live evaluation",
          body: `A strong buying process should ask which workflow the tool improves first, what evidence the team will see during rollout, and where the product introduces new process overhead. It should also ask what the product cannot do well yet. Those questions are more valuable than generic feature-tour prompts because they force a fit assessment grounded in operational reality rather than vendor copy.`,
        },
      ];
    case "comparisons":
      return [
        {
          heading: `Migration and switching considerations for ${h1}`,
          body: `Comparison pages should help the reader estimate switching cost, not just feature fit. Review how existing traces, datasets, workflows, or routing policies would move from one option to the other. If migration is difficult, that should influence the verdict. The best ${keyword} pages reduce decision risk by exposing the hidden implementation cost of changing platforms as well as the upside of doing it.`,
        },
        {
          heading: "How to run a fair proof of concept",
          body: `Use one constrained pilot with a stable success metric, one implementation owner, and one time-bound review window. A fair proof of concept keeps the workload symmetrical, uses the same benchmark or workflow on both sides, and captures the weaknesses that show up in day-to-day operation. That gives the comparison a credible closing step instead of leaving the reader with another unresolved research loop.`,
        },
      ];
    case "examples":
      return [
        {
          heading: `Patterns worth borrowing from these ${h1} references`,
          body: `The most reusable patterns are usually structural rather than cosmetic. Borrow the way the example clarifies ownership, handles edge cases, or frames the user decision, then adapt the specifics to your own workflow. That approach keeps the examples page useful for both inspiration and implementation because it helps the reader extract a principle instead of copying a surface-level detail.`,
        },
        {
          heading: "Common mistakes when adapting examples",
          body: `Teams often copy the visible artifact while missing the operating assumptions behind it. That leads to pages or workflows that look right but fail under real usage. Before adapting any example, note which audience it was built for, what maturity level it assumes, and what operational tradeoff it accepts. That is the simplest way to turn inspiration into a working design decision.`,
        },
      ];
    case "locations":
      return [
        {
          heading: `How to evaluate ${keyword} with local buying constraints`,
          body: `Location-specific pages are most useful when they help the reader translate local context into a shortlist and rollout order. Use the pricing notes to set budget boundaries, the regulation notes to determine what must be verified early, and the local trend signals to understand where the market is heading. This turns a location page into a practical decision aid instead of a doorway page with a city name inserted into generic copy.`,
        },
        {
          heading: "What local teams should verify before rollout",
          body: `Local buyers should confirm procurement expectations, data-handling requirements, implementation support needs, and whether the chosen workflow fits the operating maturity of the team. The page should help the reader move from regional context into a concrete next step such as a vendor shortlist, a comparison review, or a role-specific pilot.`,
        },
      ];
    case "personas":
      return [
        {
          heading: `Stakeholder alignment around ${keyword}`,
          body: `Persona pages should help the reader explain the category to colleagues who do not share the same day-to-day pressures. That means tying benefits to the persona's existing goals, clarifying what success looks like in their workflow, and naming the objections likely to appear from adjacent stakeholders. When the page does that well, it becomes useful both for self-education and for internal alignment before a tool decision is made.`,
        },
        {
          heading: "Adoption risks for this persona",
          body: `Even when the category fits the persona well, adoption can fail if the workflow is too broad, the metrics are unclear, or the new process adds more review overhead than expected. The page should warn about those risks so the persona can start with a narrower, measurable use case and expand only after the first workflow proves its value.`,
        },
      ];
    case "integrations":
      return [
        {
          heading: `Operational checks before enabling ${keyword}`,
          body: `Before enabling any integration in production, confirm ownership of failures, retry behavior, field mapping, alert routing, and the system of record for shared data. Teams often treat the setup steps as the whole job, but most production pain comes later when two tools disagree or one side changes without notice. This section keeps the integration page grounded in the real operating model rather than a one-time configuration exercise.`,
        },
        {
          heading: "How to monitor the integration after launch",
          body: `Review whether events arrive on time, whether the right people see failures, and whether the workflow still supports the business outcome it was meant to improve. Monitoring the integration after launch is what turns a successful setup into a reliable process, especially when the integration spans observability, alerting, evaluation, or governance systems.`,
        },
      ];
    case "glossary":
      return [
        {
          heading: `Common misconceptions about ${h1}`,
          body: `Glossary pages often fail when they define a term too broadly and absorb nearby concepts that deserve their own pages. A better definition page explains what the term includes, what it does not include, and why that distinction matters in practice. That prevents overlap with comparison pages, buyer guides, or implementation articles while making the definition easier to trust and reuse.`,
        },
        {
          heading: "How to use this term in implementation work",
          body: `The value of a term becomes clearer when a team must write requirements, compare tools, or explain tradeoffs across functions. Use the term consistently in architecture reviews, rollout plans, and internal docs so the page does more than satisfy a search query. It becomes a shared reference point for the decisions that follow.`,
        },
      ];
    case "translations":
      return [
        {
          heading: `Localization QA checklist for ${h1}`,
          body: `Review whether the localized title matches local search intent, whether the examples feel native to the audience, and whether the CTA makes sense in the target market. Also confirm that internal links route to language-appropriate pages and that the page avoids direct English duplication where a localized explanation would serve the reader better. These are the checks that make translated pages indexable and genuinely useful.`,
        },
        {
          heading: "When to create a separate localized page",
          body: `Create a dedicated localized page when search vocabulary, user expectations, or market examples differ enough that a simple translation would underserve the audience. If the market needs different proof points, different tradeoff framing, or a different call to action, that is a signal to build a true localized page rather than a mirrored English asset.`,
        },
      ];
    case "directory":
      return [
        {
          heading: `How to filter this ${h1} directory without wasting time`,
          body: `Start by removing any option that fails the core workflow requirement, then narrow by pricing model, integration fit, and the attributes that matter to implementation. Directory pages become more useful when they guide the narrowing process rather than expecting the reader to scan every listing manually. That also makes the internal links to comparisons and profiles more meaningful because the shortlist is already smaller and more intentional.`,
        },
        {
          heading: "How to convert a directory shortlist into a buying decision",
          body: `Once the list is narrowed, move into one comparison page, one integration page, and one profile or curation page before making a purchase decision. That sequence gives the reader a balanced view of fit, operational cost, and market context without forcing them to restart research from zero.`,
        },
      ];
    case "profiles":
      return [
        {
          heading: `How to interpret the milestones on this ${h1} page`,
          body: `A profile page should help the reader understand which milestones matter and why they matter. Some milestones show product direction, others show market expansion, and others simply reveal how the company wants to be understood. Reading them in context keeps the profile page useful for market research rather than turning it into a flat list of facts with no decision value.`,
        },
        {
          heading: "How to use this profile in broader category research",
          body: `Profiles should feed into comparison, directory, and curation pages rather than stand alone. Use the verified facts here to understand positioning and context, then switch to a workflow-specific page when you need to compare fit, cost, or implementation depth. That keeps navigational research connected to actual decision-making.`,
        },
      ];
    case "templates":
      return [
        {
          heading: `How to customize this ${h1} without breaking the workflow`,
          body: `Keep the required sections stable, adapt only the fields that truly vary by use case, and document why each optional section exists. Templates are most useful when they reduce ambiguity without forcing every team into the same unnecessary process. That balance is what makes a template reusable across several workflows rather than creating a document that only works for its original author.`,
        },
      ];
    case "conversions":
      return [
        {
          heading: `Validation steps after ${h1}`,
          body: `After conversion, inspect field integrity, schema alignment, encoding behavior, and whether the destination system still interprets the content correctly. The converted file should be tested in the workflow where it will actually be used. That is the only reliable way to catch silent breakage before the output reaches downstream users or systems.`,
        },
      ];
    default:
      return [];
  }
}

function buildFallbackDepthSections(
  page: PseoPage,
): Array<{ heading: string; body: string }> {
  return [
    {
      heading: `How to turn ${page.content.h1} into a real next step`,
      body: `Do not treat this page as the finish line. Use it to choose the next decision that needs proof: the first workflow to pilot, the main implementation risk to surface, and the owner who should carry the evaluation forward.\n\n${bullets([
        `Write down why ${page.seo.primary_keyword} matters now rather than later.`,
        "Pick one workflow that should improve first so success stays measurable.",
        "Name the biggest risk that could make the rollout harder than the upside is worth.",
        "Choose the next comparison, setup guide, or role-specific page to review before anyone buys or ships.",
      ])}`,
    },
    {
      heading: "Mistakes that waste time after the first read",
      body: `Most teams lose time by expanding the scope too early. They ask vendors to solve every edge case in one demo, copy a workflow without checking local constraints, or skip the validation step because the category story sounds convincing. A better approach is to narrow the decision, prove one workflow, and force the tradeoff discussion before the rollout gets bigger.`,
    },
    {
      heading: "What to ask the team before you move forward",
      body: `Before anyone commits budget or implementation time, ask who owns the workflow, which existing process this replaces or improves, and what evidence would count as a successful outcome. That internal alignment usually matters more than another top-level product walkthrough because it reveals whether the team is actually ready to act on what they learned here.`,
    },
    {
      heading: "Signals that the decision is getting clearer",
      body: `The page is doing its job when the shortlist gets smaller, the team can explain the tradeoff in plain language, and the next evaluation step is obvious. If reading still leaves the team with a broad set of interchangeable options, go one level deeper into the comparison, location, persona, or implementation path that narrows the choice properly.`,
    },
    {
      heading: "How to decide what to read next",
      body: `If the open question is which vendor fits best, move into a comparison or shortlist page. If the question is whether the workflow works in your market or team shape, move into a location or persona page. If the blocker is terminology or implementation detail, switch into the glossary or setup path. The right next page is the one that removes the biggest remaining uncertainty, not the one with the broadest keyword.`,
    },
  ];
}

function buildGlossaryPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  return dataset.glossaryTerms
    .filter((term) => term.definition && term.technicalDepth && term.relatedTerms.length >= 2)
    .map((term) => {
      const title = `What Is ${term.term}? Definition, Technical Context, and Related Terms`;
      const primaryKeyword = `what is ${term.term}`;
      const secondaryKeywords = dedupe([
        `${term.term} definition`,
        `${term.term} meaning`,
        ...term.relatedTerms.slice(0, 3).map((related) => `${related} vs ${term.term}`),
      ]);

      const sections = [
        {
          heading: `What ${term.term} means in plain language`,
          body: `${term.definition}\n\nA strong definition page should remove ambiguity before it adds jargon. In practice, teams usually search for ${term.term} when they need a clean explanation they can use in documentation, stakeholder alignment, or implementation planning. This page stays beginner-friendly by naming the problem ${term.term} solves, the operating context where it shows up, and the decision points that usually matter first.`,
        },
        {
          heading: `How ${term.term} works in a technical environment`,
          body: `${term.technicalDepth}\n\nTechnical teams evaluate ${term.term} through interfaces, dependencies, failure modes, and ownership boundaries. That is why a useful glossary page should go beyond a dictionary sentence and spell out how the term changes architecture, observability, workflows, or delivery expectations once it moves from concept to production use.`,
        },
        {
          heading: `When the term becomes operationally important`,
          body: `The term matters most when teams need to standardize implementation choices, document shared expectations, or compare tools in the same category. Instead of treating ${term.term} as a vague buzzword, document the trigger conditions, the systems it touches, and the tradeoffs it introduces. That makes the definition easier to reuse across onboarding docs, architecture reviews, and vendor evaluations.`,
        },
        {
          heading: `Related terms worth reviewing next`,
          body: `Use the related vocabulary around ${term.term} to reduce confusion and avoid overlapping pages that target the same intent.\n\n${bullets(
            term.relatedTerms.map(
              (related) =>
                `${related}: review the boundary between ${related} and ${term.term} before you create comparison or glossary content.`,
            ),
          )}`,
        },
      ];

      const page = createPageDraft(
        {
          url: buildUrl(`/glossary/${term.slug}`, basePath),
          playbook_type: "glossary",
          seo: {
            title,
            meta_description: `Learn what ${term.term} means, how it works in practice, and which related concepts to review next.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: secondaryKeywords,
            search_intent: formatSearchIntent("glossary"),
          },
          content: {
            h1: `What Is ${term.term}?`,
            introduction: `${term.term} matters because teams use the phrase to describe a specific operating concept, not a vague trend. This page explains the term in plain language first, then adds the technical depth needed for implementation and evaluation work. You will also find related terms that help you branch into comparison, directory, and persona-driven pages without duplicating intent.`,
            sections,
            faq: [
              buildFaq(
                `Is ${term.term} only relevant to technical teams?`,
                `No. The technical details matter most during implementation, but non-technical stakeholders still need a usable definition so they can evaluate vendors, understand project scope, and align success criteria without relying on inconsistent shorthand.`,
              ),
              buildFaq(
                `How is ${term.term} different from related concepts?`,
                `The fastest way to separate the term is to review where the responsibility boundary changes. If another concept changes ownership, tooling, or measurement, it deserves its own page rather than being folded into the same definition.`,
              ),
              buildFaq(
                `When should a glossary page link out to deeper content?`,
                `As soon as the reader needs a workflow, setup guide, comparison, or location-specific recommendation. A glossary page should resolve the definition, then route the reader to the next page type that matches their task.`,
              ),
            ],
            call_to_action: buildCta(primaryKeyword),
          },
          schema: buildSchema("DefinedTerm", {
            name: term.term,
            description: term.definition,
            inDefinedTermSet: buildUrl("/glossary", basePath),
          }),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "glossary_terms[].definition",
            "glossary_terms[].technicalDepth",
            "glossary_terms[].relatedTerms",
          ],
        },
        term.slug,
        [term.slug, ...term.relatedTerms.map(slugify)],
      );

      return page;
    });
}

function buildTemplatePages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.categories.forEach((category) => {
    dataset.fileFormats.forEach((format) => {
      const tools = findToolsForFormat(dataset, format)
        .filter((tool) => !tool.category || lower(tool.category) === category.slug)
        .slice(0, 4);

      if (
        !category.description ||
        category.useCases.length < 2 ||
        (!format.description && !format.extension)
      ) {
        return;
      }

      const variations = dedupe([
        ...category.templateAngles,
        ...category.useCases.map((useCase) => `${useCase} workflow`),
        ...category.subcategories.slice(0, 2).map((subcategory) => `${subcategory.name} variant`),
      ]).slice(0, 4);

      if (variations.length < 3) {
        return;
      }

      const primaryKeyword = `${category.name} ${format.name} template`;
      const supportingTools = tools.map((tool) => tool.name);
      const rows = variations.map((variation, index) => [
        variation,
        category.useCases[index % category.useCases.length] || category.summary || category.name,
        supportingTools[index % Math.max(supportingTools.length, 1)] || "Manual workflow",
      ]);

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/templates/${category.slug}-${format.slug}-template`, basePath),
            playbook_type: "templates",
            seo: {
              title: `${category.name} ${format.name} Template With Implementation Guide`,
              meta_description: `Use this ${category.name} ${format.name} template to structure workflows, document requirements, and ship a format your team can reuse.`,
              primary_keyword: primaryKeyword,
              secondary_keywords: dedupe([
                `${category.name} template`,
                `${format.name} template`,
                `${category.name} workflow template`,
                `${category.name} ${format.extension || format.name} example`,
              ]),
              search_intent: formatSearchIntent("templates"),
            },
            content: {
              h1: `${category.name} ${format.name} Template`,
              introduction: `A good ${primaryKeyword} should do more than provide a shell. It should tell the reader what belongs in the template, how to adapt it for real operating conditions, and which variations fit common use cases. This page uses the category and format data in your dataset to outline a reusable structure, explain when each variation makes sense, and show how teams can turn a blank document into a repeatable workflow.`,
              sections: [
                {
                  heading: `When to use a ${format.name} template for ${category.name}`,
                  body: `${category.description}\n\n${format.description || `${format.name} is useful when teams need a portable format that can be reviewed, versioned, or shared without rework.`} The format works best when the workflow needs explicit scope, ownership, and acceptance criteria. For ${category.name}, that usually means capturing ${oxfordList(
                    category.useCases.slice(0, 3),
                  )} in a format the wider team can actually act on.`,
                },
                {
                  heading: "Recommended template structure",
                  body: `Use the template as an operating asset, not just a document.\n\n${bullets([
                    "Start with purpose, owner, and decision deadline so the reader knows why the asset exists.",
                    ...category.useCases
                      .slice(0, 3)
                      .map((useCase) => `Add a dedicated section for ${useCase} so execution details do not collapse into vague notes.`),
                    "Close with review criteria and next actions to keep the template useful after the first draft.",
                  ])}`,
                },
                {
                  heading: "Template variations",
                  body: `Different teams need different levels of detail. Use the variation that matches the workflow maturity, reviewer expectations, and handoff pattern.\n\n${markdownTable(
                    ["Variation", "Best used for", "Suggested tooling"],
                    rows,
                  )}`,
                },
                {
                  heading: "How to implement the template without creating busywork",
                  body: `The fastest way to ruin a template is to make it exhaustive but unused. Keep the core structure stable, make optional sections explicit, and only add fields that affect review decisions or downstream execution. If the workflow touches tools like ${oxfordList(
                    supportingTools,
                  )}, document the fields that need to stay consistent across systems so the template can support automation later.`,
                },
                {
                  heading: "Usage instructions and rollout guidance",
                  body: `Roll the template out in three passes. First, complete a live example so contributors see the expected depth. Second, mark required versus optional fields based on the use case. Third, collect feedback after the first few runs and remove fields that do not change decisions. That keeps the ${primaryKeyword} practical instead of ceremonial.`,
                },
              ],
              faq: [
                buildFaq(
                  `What should a ${primaryKeyword} include first?`,
                  `Start with the fields that determine scope, owner, timing, and review criteria. Those fields make the template actionable before you add supporting detail.`,
                ),
                buildFaq(
                  `How many versions of the template should a team keep?`,
                  `Usually one base version with two or three approved variants is enough. More than that tends to create governance problems unless each variation clearly serves a different workflow.`,
                ),
                buildFaq(
                  `How do I keep the template from becoming stale?`,
                  `Review it after real usage, not during abstract planning. Remove sections nobody fills in, tighten the fields that cause review delays, and add examples where contributors still guess.`,
                ),
              ],
              call_to_action: buildCta(primaryKeyword),
            },
            schema: buildSchema("CreativeWork", {
              name: `${category.name} ${format.name} Template`,
              about: category.name,
              encodingFormat: format.extension || format.name,
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].description",
              "categories[].useCases",
              "categories[].templateAngles",
              "file_formats[].description",
              "file_formats[].extension",
              "tools[].supportedFileFormats",
            ],
          },
          category.slug,
          [category.slug, format.slug, ...supportingTools.map(slugify)],
        ),
      );
    });
  });

  return pages;
}

function buildCurationPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.categories.forEach((category) => {
    const tools = findToolsForCategory(dataset, category).filter(
      (tool) => tool.strengths.length >= 2 && tool.weaknesses.length >= 1,
    );

    if (tools.length < 3 || !category.description) {
      return;
    }

    const ranked = [...tools]
      .sort(
        (left, right) =>
          right.bestFor.length +
          right.useCases.length -
          (left.bestFor.length + left.useCases.length),
      )
      .slice(0, 5);

    const primaryKeyword = `best ${category.name} tools`;
    const rows = ranked.map((tool) => [
      tool.name,
      tool.bestFor[0] || tool.description || "Flexible team workflow",
      oxfordList(tool.strengths.slice(0, 2)),
      oxfordList(tool.weaknesses.slice(0, 1)) || "No material weakness provided",
    ]);

    pages.push(
      createPageDraft(
        {
          url: buildUrl(`/best/${category.slug}-tools`, basePath),
          playbook_type: "curation",
          seo: {
            title: `Best ${category.name} Tools Ranked by Fit, Workflow, and Tradeoffs`,
            meta_description: `Review the best ${category.name} tools with ranking criteria, strengths, weaknesses, and recommendations by use case.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: dedupe([
              `${category.name} software`,
              `${category.name} tool comparison`,
              `${category.name} buyer guide`,
            ]),
            search_intent: formatSearchIntent("curation"),
          },
          content: {
            h1: `Best ${category.name} Tools`,
            introduction: `Buyers comparing ${category.name} tools usually need three things quickly: a shortlist, the tradeoffs that change the decision, and a clearer sense of which product deserves a live evaluation first. This guide is built around those questions. It ranks the category by workflow fit, operational strengths, implementation friction, and downside risk so the reader can move from broad research into a real buying process.`,
            sections: [
              {
                heading: "Ranking criteria",
                body: `Each tool was assessed against the same buying questions: how well it supports ${oxfordList(
                  category.useCases.slice(0, 3),
                )}, how clearly its strengths map to real workflows, how costly the weaknesses are in practice, and whether the product looks durable enough for the teams considering it. This makes the ranking more useful than a generic best-of post because the criteria are visible and reusable.`,
              },
              {
                heading: "Comparison summary",
                body: markdownTable(
                  ["Tool", "Best for", "Pros", "Cons"],
                  rows,
                ),
              },
              {
                heading: "Pros and cons by buyer profile",
                body: ranked
                  .map(
                    (tool) =>
                      `### ${tool.name}\n\nPros:\n${bullets(
                        tool.strengths.slice(0, 3),
                      )}\n\nCons:\n${bullets(
                        tool.weaknesses.slice(0, 2),
                      )}\n\n${tool.bestFor.length ? `${tool.name} is strongest when the team cares most about ${oxfordList(tool.bestFor.slice(0, 2))}.` : tool.description}`,
                  )
                  .join("\n\n"),
              },
              {
                heading: "Which tool to choose for specific use cases",
                body: category.useCases
                  .slice(0, 3)
                  .map((useCase, index) => {
                    const tool = ranked[index % ranked.length];
                    return `${useCase}: Start with ${tool.name} when this workflow is your priority, because its documented strengths line up most closely with the required operating model. Review the listed weakness before rollout so you know where implementation friction is likely to appear.`;
                  })
                  .join("\n\n"),
              },
              {
                heading: "Verdict",
                body: `There is no universal winner in ${category.name}. The right pick depends on whether the team values speed, control, breadth of integrations, or a narrower workflow fit. Use the ranking to shortlist tools, then validate the decision against one concrete use case and one known weakness before you treat the category decision as final.`,
              },
            ],
            faq: [
              buildFaq(
                `How should I use a best ${category.name} tools page during evaluation?`,
                `Use it to narrow a long list into a short list. After that, switch to comparison pages and implementation pages so you can verify fit at the workflow level.`,
              ),
              buildFaq(
                "Why publish the ranking criteria instead of only the rankings?",
                `Because buyers need to know what drove the order. Transparent criteria make the page easier to trust and easier to adapt to a different operating context.`,
              ),
              buildFaq(
                "How often should curation pages be refreshed?",
                `Refresh them whenever product positioning, pricing, integrations, or the category buying criteria changes enough to alter the shortlist.`,
              ),
            ],
            call_to_action: buildCta(primaryKeyword),
          },
          schema: buildSchema("CollectionPage", {
            name: `Best ${category.name} Tools`,
            about: category.name,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: ranked.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.name,
              })),
            },
          }),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "categories[].description",
            "categories[].useCases",
            "tools[].category",
            "tools[].strengths",
            "tools[].weaknesses",
            "tools[].bestFor",
          ],
        },
          category.slug,
          [category.slug, ...ranked.map((tool) => tool.slug)],
        ),
      );

    categoryServices(category).forEach((service) => {
      const serviceTools = shortlistToolsForService(tools, service, 5);
      if (serviceTools.length < 3) {
        return;
      }

      const serviceKeyword = `best ${category.name} tools for ${service}`;
      const serviceRows = serviceTools.map((tool) => [
        tool.name,
        oxfordList(tool.bestFor.slice(0, 2)) || tool.description || "General fit",
        oxfordList(tool.strengths.slice(0, 2)) || "See product fit",
        oxfordList(tool.weaknesses.slice(0, 1)) || "No material weakness supplied",
      ]);

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/best/${category.slug}-tools/for-${serviceSlug(service)}`, basePath),
            playbook_type: "curation",
            seo: {
              title: `Best ${category.name} Tools for ${service}`,
              meta_description: `Compare the best ${category.name} tools for ${service}, with workflow-specific tradeoffs, shortlist advice, and demo questions.`,
              primary_keyword: serviceKeyword,
              secondary_keywords: dedupe([
                `${category.name} ${service} tools`,
                `${service} ${category.name} software`,
                `${category.name} for ${service}`,
              ]),
              search_intent: formatSearchIntent("curation"),
            },
            content: {
              h1: `Best ${category.name} Tools for ${service}`,
              introduction: `This guide narrows the category to one concrete job: ${service}. That matters because teams usually do not buy a category in the abstract. They buy a tool to improve one workflow first, then decide whether the rest of the platform is worth the operational tradeoffs. The shortlist below is organized around that narrower buying decision.`,
              sections: [
                {
                  heading: `Why ${service} changes the shortlist`,
                  body: `${category.description}\n\nWhen the real job is ${service}, the shortlist should favor tools that can prove that workflow live, not just tools with broad category coverage. Start by checking how each option handles ${oxfordList(
                    category.useCases.filter((useCase) => useCase !== service).slice(0, 2),
                  ) || category.summary || category.name} once ${service} is working, because that is where long-term fit usually becomes clear.`,
                },
                {
                  heading: "Workflow-specific comparison summary",
                  body: markdownTable(
                    ["Tool", "Best fit", "Why it stands out", "Watch-out"],
                    serviceRows,
                  ),
                },
                {
                  heading: `Recommended picks for teams evaluating ${service}`,
                  body: serviceTools
                    .map((tool) => describeToolRecommendation(tool, category, service))
                    .join("\n\n"),
                },
                {
                  heading: `Questions to ask in a demo about ${service}`,
                  body: bullets([
                    `Ask each vendor to show ${service} on a realistic workflow instead of a generic tour.`,
                    `Probe how the product handles ${oxfordList(category.useCases.filter((useCase) => useCase !== service).slice(0, 2)) || "the next workflow on your roadmap"} once the first use case is live.`,
                    "Make the team call out the main implementation risk before they move into procurement.",
                  ]),
                },
                {
                  heading: `What proof to ask for before you buy a tool for ${service}`,
                  body: `A confident vendor story is not enough. Ask to see the workflow run on a representative input, ask where the product still needs human judgment, and ask what setup work the team will own in the first thirty days. Buyers usually re-rank the shortlist after those answers because the true cost of supporting ${service} becomes clearer once the product has to handle a realistic scenario.`,
                },
                {
                  heading: "Shortlist summary",
                  body: `Use this page to reduce the field to two or three realistic options. Once that list is set, the next move should be one live comparison or one implementation review on ${service}, not another round of broad category browsing.`,
                },
                {
                  heading: `How to move from ${service} research into a final decision`,
                  body: `Once the shortlist is down to a few tools, assign one owner, one proof-of-concept workflow, and one explicit review deadline. Use that pilot to answer whether the product makes ${service} easier to run, easier to debug, and easier to scale. If it cannot clear those three checks, the team should re-rank rather than forcing the purchase through.`,
                },
              ],
              faq: [
                buildFaq(
                  `Why create a best ${category.name} tools page for ${service}?`,
                  `Because workflow-specific buyers usually need a narrower answer than a broad category ranking can provide.`,
                ),
                buildFaq(
                  `What should a team validate first for ${service}?`,
                  `Validate that the product can support the exact workflow shape you care about and expose the main tradeoff before rollout.`,
                ),
                buildFaq(
                  "What should this guide link to next?",
                  `It should connect to comparison, persona, and location pages that keep the same ${service} decision moving forward.`,
                ),
              ],
              call_to_action: buildCta(serviceKeyword),
            },
            schema: buildSchema("CollectionPage", {
              name: `Best ${category.name} Tools for ${service}`,
              about: [category.name, service],
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].description",
              "categories[].useCases",
              "tools[].category",
              "tools[].strengths",
              "tools[].weaknesses",
              "tools[].bestFor",
              "tools[].useCases",
            ],
          },
          category.slug,
          [category.slug, serviceSlug(service), ...serviceTools.map((tool) => tool.slug)],
        ),
      );
    });

    dataset.locations.forEach((location) => {
      if (!location.overview || !location.pricingNotes.length || !location.trends.length) {
        return;
      }

      const locationKeyword = `best ${category.name} tools in ${location.name}`;
      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/best/${category.slug}-tools/${location.slug}`, basePath),
            playbook_type: "locations",
            seo: {
              title: `Best ${category.name} Tools in ${location.name}`,
              meta_description: `Review the best ${category.name} tools in ${location.name} with local buying context, tradeoffs, and shortlist guidance.`,
              primary_keyword: locationKeyword,
              secondary_keywords: dedupe([
                `${category.name} ${location.name}`,
                `${category.name} software in ${location.name}`,
                `${location.name} ${category.name} tools`,
              ]),
              search_intent: formatSearchIntent("curation"),
            },
            content: {
              h1: `Best ${category.name} Tools in ${location.name}`,
              introduction: `Buyers in ${location.name} usually need more than a global vendor list. The better question is which ${category.name} tools still make sense once local budgets, rollout maturity, support expectations, and team shape are taken seriously. Start here if you are trying to build a shortlist that would actually survive a real buying conversation in ${location.name}.`,
              sections: [
                {
                  heading: `What buyers in ${location.name} should prioritize`,
                  body: `${location.overview}\n\nUse the market context in ${location.name} to tighten the shortlist before demos start.\n\n${bullets([
                    `Keep the first shortlist tied to the workflows that matter most, especially ${oxfordList(category.useCases.slice(0, 2))}.`,
                    ...location.pricingNotes
                      .slice(0, 2)
                      .map((note) => `Budget signal: ${note}`),
                    ...location.trends
                      .slice(0, 2)
                      .map((trend) => `Market signal: ${trend}`),
                  ])}\n\nThat keeps the page useful for buyers who need to decide what is realistic in ${location.name}, not just what looks strongest in a global ranking.`,
                },
                {
                  heading: "Local shortlist",
                  body: markdownTable(
                    ["Tool", "Best for", "Pros", "Cons"],
                    rows,
                  ),
                },
                {
                  heading: "How local pricing and market trends change the shortlist",
                  body: `${bullets(location.pricingNotes)}\n\n${bullets(location.trends)}\n\nUse those signals to pressure-test whether the shortlist should optimize for speed, control, cost discipline, or rollout support in ${location.name}.`,
                },
                {
                  heading: `Where buyers in ${location.name} usually over-scope the evaluation`,
                  body: `Most teams create extra work by asking every vendor to prove every possible workflow at once. In ${location.name}, that usually leads to long demos, vague note-taking, and a shortlist that still feels interchangeable. A better approach is to pick the first workflow that matters, decide the budget ceiling early, and use the local market context on this page to eliminate products that are unrealistic before the deeper evaluation starts.`,
                },
                {
                  heading: "Recommended picks by local buying profile",
                  body: joinParagraphs(
                    ranked.map((tool) =>
                      describeToolRecommendation(tool, category, undefined, location.name),
                    ),
                    `Use this section to sort the shortlist by buying profile in ${location.name}: one option for teams that need fast rollout, one for buyers who care most about control, and one for teams that need the safest operating baseline before they widen scope.`,
                  ),
                },
                {
                  heading: `Questions to ask vendors about rollout in ${location.name}`,
                  body: bullets([
                    `Ask what the first successful deployment in ${location.name} should look like and how long it usually takes.`,
                    "Probe where local budget pressure, procurement friction, or team maturity usually slows adoption.",
                    `Have each vendor show how the product supports ${oxfordList(category.useCases.slice(0, 2))} in the environment buyers in ${location.name} actually operate.`,
                  ]),
                },
                {
                  heading: "How to move from this local guide to a final shortlist",
                  body: `The goal is to leave with a smaller, more realistic field. Once that happens, switch into one head-to-head comparison or one role-specific page that stays anchored in ${location.name}. That is usually where teams separate products that sound strong in global research from products that are actually realistic in the local buying environment.`,
                },
                {
                  heading: `What a successful pilot in ${location.name} should prove`,
                  body: `A strong pilot should prove three things. First, the product can support the workflow that matters most in ${location.name} without a large amount of custom process. Second, the pricing and support model still look reasonable once the team sees the real setup work. Third, the tool gives the buyer enough confidence to expand beyond the first use case. If those signals do not show up in the pilot, the safest move is to re-rank the shortlist before rollout expands.`,
                },
              ],
              faq: [
                buildFaq(
                  `Why does a best ${category.name} tools page need a ${location.name} version?`,
                  `Because local budget pressure, rollout expectations, and market maturity can change which shortlist is realistic.`,
                ),
                buildFaq(
                  `Should buyers in ${location.name} use the same shortlist as global buyers?`,
                  `Not automatically. The global shortlist is a starting point; the local page helps narrow it using regional context.`,
                ),
                buildFaq(
                  "What should this page link to next?",
                  `It should connect to location pages, comparison pages, and persona pages so the buyer can keep narrowing the decision.`,
                ),
              ],
              call_to_action: buildCta(locationKeyword),
            },
            schema: buildSchema("CollectionPage", {
              name: `Best ${category.name} Tools in ${location.name}`,
              about: [category.name, location.name],
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].description",
              "tools[].category",
              "tools[].strengths",
              "tools[].weaknesses",
              "locations[].overview",
              "locations[].pricingNotes",
              "locations[].trends",
            ],
          },
          category.slug,
          [category.slug, location.slug, ...ranked.map((tool) => tool.slug)],
        ),
      );
    });
  });

  return pages;
}

function buildConversionPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.fileFormats.forEach((source) => {
    dataset.fileFormats.forEach((target) => {
      if (source.slug === target.slug) {
        return;
      }

      const directTargets = source.conversionTargets.map(lower);
      const compatibleTools = dataset.tools.filter((tool) => {
        const formats = tool.supportedFileFormats.map(lower);
        return formats.includes(source.slug) && formats.includes(target.slug);
      });

      if (
        compatibleTools.length < 1 &&
        !directTargets.includes(target.slug) &&
        !source.useCases.length &&
        !target.useCases.length
      ) {
        return;
      }

      const primaryKeyword = `${source.name} to ${target.name}`;
      const examples = dedupe([
        `${source.name} records transformed into ${target.name} columns for reporting`,
        `${source.name} exports converted into ${target.name} for downstream tooling`,
        `${source.name} payloads normalized into ${target.name} for manual review`,
      ]);

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/conversions/${source.slug}-to-${target.slug}`, basePath),
            playbook_type: "conversions",
            seo: {
              title: `${source.name} to ${target.name}: How to Convert Without Breaking Structure`,
              meta_description: `Convert ${source.name} to ${target.name} with clear logic, tooling options, and examples that preserve structure and downstream usability.`,
              primary_keyword: primaryKeyword,
              secondary_keywords: dedupe([
                `${source.name} ${target.name} converter`,
                `convert ${source.name} to ${target.name}`,
                `${source.name} export to ${target.name}`,
              ]),
              search_intent: formatSearchIntent("conversions"),
            },
            content: {
              h1: `${source.name} to ${target.name}`,
              introduction: `If you need to convert ${source.name} to ${target.name}, the hard part is rarely the export button. The real work is preserving structure, deciding how fields map, and catching the places where the destination format changes meaning or drops context. This guide focuses on those practical conversion decisions so the output is still usable in the workflow that comes next.`,
              sections: [
                {
                  heading: `What changes when you convert ${source.name} to ${target.name}`,
                  body: `${source.description || `${source.name} carries data in its own structure.`} ${target.description || `${target.name} expects its own rules for layout and consumption.`}\n\nDuring conversion, the real work is not the file rename. It is translating structure, preserving field meaning, and deciding what to do with data that does not map cleanly. Teams should check schema alignment, formatting rules, nested content, and downstream consumers before treating the output as production-ready.`,
                },
                {
                  heading: "Conversion logic",
                  body: `Treat the conversion as a three-step process.\n\n${bullets([
                    `Inspect the source for repeated patterns, nested values, or formatting decisions that ${target.name} handles differently.`,
                    `Map each source field into a target structure and document the exceptions before you run the export.`,
                    `Validate the converted output in the destination workflow instead of assuming the file is correct because the conversion completed.`,
                  ])}`,
                },
                {
                  heading: "Example conversions",
                  body: bullets(examples),
                },
                {
                  heading: "Recommended tooling",
                  body: compatibleTools.length
                    ? `These tools already advertise or imply support for both formats, which makes them strong starting points for the conversion workflow.\n\n${bullets(
                        compatibleTools.map(
                          (tool) =>
                            `${tool.name}: best when you need ${oxfordList(tool.bestFor.slice(0, 2)) || "a reusable conversion flow"} and want to keep the process repeatable.`,
                        ),
                      )}`
                    : `No explicit dual-format tooling was provided in the dataset, so treat this as a workflow design problem. The safest path is to define the field mapping, run a sample conversion, and verify the destination system before scaling the job.`,
                },
                {
                  heading: "Related converter suggestions",
                  body: `If this conversion sits inside a larger workflow, the next likely pages are adjacent converters that keep the same destination or the same source. That is why internal links should connect ${primaryKeyword} to sibling converter pages instead of isolating it as a one-off utility.`,
                },
              ],
              faq: [
                buildFaq(
                  `What is the biggest risk in ${primaryKeyword} conversions?`,
                  `The biggest risk is silent structure loss: fields may technically convert while meaning, hierarchy, or formatting assumptions are lost.`,
                ),
                buildFaq(
                  "Should the converted output be validated manually?",
                  `Yes. Even when tooling automates the conversion, the destination workflow still needs a sample validation step.`,
                ),
                buildFaq(
                  "When is it better to redesign the workflow instead of converting?",
                  `If the team repeatedly converts back and forth, it is usually better to standardize upstream on the format that best fits the downstream system.`,
                ),
              ],
              call_to_action: buildCta(primaryKeyword),
            },
            schema: buildSchema("HowTo", {
              name: `${source.name} to ${target.name}`,
              supply: compatibleTools.map((tool) => tool.name),
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "file_formats[].description",
              "file_formats[].conversionTargets",
              "tools[].supportedFileFormats",
            ],
          },
          `${source.slug}-${target.slug}`,
          [source.slug, target.slug, ...compatibleTools.map((tool) => tool.slug)],
        ),
      );
    });
  });

  return pages;
}

function buildComparisonPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];
  const grouped = new Map<string, NormalizedTool[]>();

  dataset.tools.forEach((tool) => {
    if (!tool.category) {
      return;
    }
    const key = lower(tool.category);
    const existing = grouped.get(key) || [];
    existing.push(tool);
    grouped.set(key, existing);
  });

  grouped.forEach((tools, categorySlug) => {
    for (let index = 0; index < tools.length; index += 1) {
      for (let compareIndex = index + 1; compareIndex < tools.length; compareIndex += 1) {
        const left = tools[index];
        const right = tools[compareIndex];

        if (
          left.strengths.length < 1 ||
          right.strengths.length < 1 ||
          left.bestFor.length < 1 ||
          right.bestFor.length < 1
        ) {
          continue;
        }

        const primaryKeyword = `${left.name} vs ${right.name}`;

        pages.push(
          createPageDraft(
            {
              url: buildUrl(`/compare/${left.slug}-vs-${right.slug}`, basePath),
              playbook_type: "comparisons",
              seo: {
                title: `${left.name} vs ${right.name}: Features, Fit, and Verdict`,
                meta_description: `Compare ${left.name} and ${right.name} across features, workflow fit, tradeoffs, and the teams each tool suits best.`,
                primary_keyword: primaryKeyword,
                secondary_keywords: dedupe([
                  `${left.name} comparison`,
                  `${right.name} comparison`,
                  `${left.name} or ${right.name}`,
                ]),
                search_intent: formatSearchIntent("comparisons"),
              },
              content: {
                h1: `${left.name} vs ${right.name}`,
                introduction: `${primaryKeyword} pages only help when they move beyond brand repetition and clarify decision tradeoffs. This comparison focuses on feature coverage, use-case fit, operational tradeoffs, and the practical reasons a team would choose one product over the other. The goal is not to declare a generic winner. It is to help the reader reach a defensible decision for a specific workflow.`,
                sections: [
                  {
                    heading: "Feature matrix",
                    body: markdownTable(
                      ["Area", left.name, right.name],
                      [
                        [
                          "Primary strengths",
                          oxfordList(left.strengths.slice(0, 2)),
                          oxfordList(right.strengths.slice(0, 2)),
                        ],
                        [
                          "Best for",
                          oxfordList(left.bestFor.slice(0, 2)),
                          oxfordList(right.bestFor.slice(0, 2)),
                        ],
                        [
                          "Known weaknesses",
                          oxfordList(left.weaknesses.slice(0, 2)) || "No weaknesses supplied",
                          oxfordList(right.weaknesses.slice(0, 2)) || "No weaknesses supplied",
                        ],
                        [
                          "Pricing",
                          left.pricing || left.pricingModel || "Not supplied",
                          right.pricing || right.pricingModel || "Not supplied",
                        ],
                      ],
                    ),
                  },
                  {
                    heading: "Where each tool wins",
                    body: `${left.name} is the stronger choice when the team prioritizes ${oxfordList(
                      left.bestFor.slice(0, 2),
                    )}. ${right.name} is stronger when the workflow depends on ${oxfordList(
                      right.bestFor.slice(0, 2),
                    )}. Looking at strengths this way keeps the verdict tied to use-case fit instead of generic product marketing language.`,
                  },
                  {
                    heading: "Use-case recommendations",
                    body: dedupe([
                      ...left.useCases.slice(0, 2).map(
                        (useCase) =>
                          `${useCase}: lean toward ${left.name} if you need its documented strengths to show up early in rollout.`,
                      ),
                      ...right.useCases.slice(0, 2).map(
                        (useCase) =>
                          `${useCase}: lean toward ${right.name} if the workflow depends on the scenarios it is already optimized for.`,
                      ),
                    ]).join("\n\n"),
                  },
                  {
                    heading: "Verdict summary",
                    body: `Choose ${left.name} when the team values ${oxfordList(
                      left.strengths.slice(0, 2),
                    )} more than it fears ${oxfordList(
                      left.weaknesses.slice(0, 1),
                    )}. Choose ${right.name} when the workflow makes ${oxfordList(
                      right.strengths.slice(0, 2),
                    )} more valuable. If the buyer still feels undecided, the next step should be a constrained pilot on one real use case rather than another round of feature-table reading.`,
                  },
                ],
                faq: [
                  buildFaq(
                    `How should a team decide between ${left.name} and ${right.name}?`,
                    `Start with the workflow that matters most, then test which product handles that workflow with the least friction and the clearest downside tradeoff.`,
                  ),
                  buildFaq(
                    "Is pricing enough to pick a winner?",
                    `No. Pricing only matters after the team knows which product actually fits the operating model and implementation requirements.`,
                  ),
                  buildFaq(
                    "What should the comparison page link to next?",
                    `It should link to curation, integration, directory, and persona pages that help the reader validate the tool decision from different angles.`,
                  ),
                ],
                call_to_action: buildCta(primaryKeyword),
              },
              schema: buildSchema("TechArticle", {
                headline: `${left.name} vs ${right.name}`,
                about: [left.name, right.name, categorySlug],
              }),
              internal_links: [],
              related_pages: [],
              data_requirements_used: [
                "tools[].category",
                "tools[].strengths",
                "tools[].weaknesses",
                "tools[].bestFor",
                "tools[].pricing",
              ],
            },
            categorySlug,
            [categorySlug, left.slug, right.slug],
          ),
        );
      }
    }
  });

  return pages;
}

function buildExamplePages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.categories.forEach((category) => {
    const examples = category.examples;
    if (examples.length < 3 || !category.description) {
      return;
    }

    const primaryKeyword = `${category.name} examples`;

    pages.push(
      createPageDraft(
        {
          url: buildUrl(`/examples/${category.slug}`, basePath),
          playbook_type: "examples",
          seo: {
            title: `${category.name} Examples With Analysis and Filters`,
            meta_description: `Review real ${category.name} examples, why they work, and how to filter them by use case or operational goal.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: dedupe([
              `${category.name} inspiration`,
              `${category.name} examples list`,
              `${category.name} best practices`,
            ]),
            search_intent: formatSearchIntent("examples"),
          },
          content: {
            h1: `${category.name} Examples`,
            introduction: `The best ${primaryKeyword} pages do not dump screenshots or names into a gallery. They explain what the example is trying to achieve, which design or operational decisions make it effective, and how a reader should filter examples based on their own constraints. This page uses the examples attached to the category data so the content stays tied to real use cases instead of generic inspiration.`,
            sections: [
              {
                heading: "How to evaluate examples",
                body: `Use examples to study decisions, not aesthetics. Start by asking what user problem the example solves, what tradeoff it makes, and which part of the workflow it improves. For ${category.name}, the most useful examples usually clarify ${oxfordList(
                  category.useCases.slice(0, 3),
                )} while avoiding unnecessary complexity.`,
              },
              {
                heading: "Categorization filters",
                body: `Filter the examples by intent before copying anything.\n\n${bullets([
                  ...category.useCases.slice(0, 3).map((useCase) => `Use case: ${useCase}`),
                  ...category.industries.slice(0, 2).map((industry) => `Industry: ${industry}`),
                  "Complexity: lightweight example versus enterprise-ready example",
                ])}`,
              },
              {
                heading: "Real-world examples and why they work",
                body: examples
                  .slice(0, 5)
                  .map(
                    (example) =>
                      `### ${example.title}\n\n${example.summary}\n\nWhy it works: ${example.takeaway}`,
                  )
                  .join("\n\n"),
              },
              {
                heading: "How to adapt the examples without copying blindly",
                body: `Strong examples transfer principles, not exact implementation details. Pull the operating logic from each example, check which assumptions depend on team size or workflow maturity, and rewrite the structure for your own constraints. That process keeps the page useful for discovery while protecting it from becoming a thin gallery built around repetitive captions.`,
              },
            ],
            faq: [
              buildFaq(
                `What makes a strong ${category.name} example page?`,
                `Each example should teach a reusable decision, not just show a surface-level asset or brand name.`,
              ),
              buildFaq(
                "How many filters should an example page include?",
                `Enough to help the reader narrow by use case, audience, or complexity, but not so many that the page becomes a faceted-search dead end.`,
              ),
              buildFaq(
                "Should example pages recommend related formats or tools?",
                `Yes. Readers often move from examples into templates, comparisons, or directory pages once they decide what pattern they want to replicate.`,
              ),
            ],
            call_to_action: buildCta(primaryKeyword),
          },
          schema: buildSchema("CollectionPage", {
            name: `${category.name} Examples`,
            about: category.name,
            numberOfItems: examples.length,
          }),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "categories[].examples",
            "categories[].useCases",
            "categories[].industries",
          ],
        },
        category.slug,
        [category.slug, ...examples.map((example) => slugify(example.title))],
      ),
    );

    categoryServices(category).forEach((service) => {
      const serviceKeyword = `${category.name} ${service} examples`;
      const serviceExamples = examples.slice(0, 4);

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/examples/${category.slug}/${serviceSlug(service)}`, basePath),
            playbook_type: "examples",
            seo: {
              title: `${category.name} ${service} Examples`,
              meta_description: `Study ${category.name} examples for ${service}, with analysis of what works and how to adapt each pattern.`,
              primary_keyword: serviceKeyword,
              secondary_keywords: dedupe([
                `${category.name} ${service} inspiration`,
                `${service} examples`,
                `${category.name} workflow examples`,
              ]),
              search_intent: formatSearchIntent("examples"),
            },
            content: {
              h1: `${category.name} Examples for ${service}`,
              introduction: `If you are researching ${service}, broad example galleries get noisy fast. This page keeps the reference set focused on that workflow so you can see which patterns are worth borrowing, why they work, and what to ignore before you build your own version.`,
              sections: [
                {
                  heading: `How to filter examples for ${service}`,
                  body: `Use ${service} as the first filter, then narrow by team maturity, implementation complexity, and the environment where the workflow has to run. That keeps the examples grounded in a specific job instead of turning them into generic inspiration.`,
                },
                {
                  heading: `Examples worth studying for ${service}`,
                  body: serviceExamples
                    .map(
                      (example) =>
                        `### ${example.title}\n\n${example.summary}\n\nWhy it matters for ${service}: ${example.takeaway}`,
                    )
                    .join("\n\n"),
                },
                {
                  heading: "Patterns to borrow first",
                  body: bullets([
                    `Borrow the structural decisions that make ${service} easier to execute or review.`,
                    "Check which assumptions only work for larger teams or more mature workflows before you copy anything.",
                    "Keep the next step measurable so the pattern becomes a working implementation rather than a static reference.",
                  ]),
                },
                {
                  heading: `Mistakes to avoid when adapting ${service} examples`,
                  body: `The most common mistake is copying the visible artifact without copying the operating logic behind it. For ${service}, note who owns the workflow, what evidence the example surfaces, and which tradeoff the original team accepted. Those are the details that determine whether the pattern survives real use.`,
                },
              ],
              faq: [
                buildFaq(
                  `Why create example pages for ${service}?`,
                  `Because readers searching for a named workflow usually need more specific reference material than a broad examples page can give them.`,
                ),
                buildFaq(
                  `How should I use examples for ${service}?`,
                  `Use them to identify patterns worth adapting, then test those patterns against your own workflow constraints before implementation.`,
                ),
                buildFaq(
                  "What should I read after this examples page?",
                  `Move into templates, comparisons, or persona pages once you know which pattern you want to adapt.`,
                ),
              ],
              call_to_action: buildCta(serviceKeyword),
            },
            schema: buildSchema("CollectionPage", {
              name: `${category.name} Examples for ${service}`,
              about: [category.name, service],
              numberOfItems: serviceExamples.length,
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].examples",
              "categories[].useCases",
              "categories[].industries",
            ],
          },
          category.slug,
          [category.slug, serviceSlug(service), ...serviceExamples.map((example) => slugify(example.title))],
        ),
      );
    });
  });

  return pages;
}

function buildLocationPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.categories.forEach((category) => {
    const tools = findToolsForCategory(dataset, category).slice(0, 4);
    dataset.locations.forEach((location) => {
      if (
        !location.overview ||
        location.regulations.length < 1 ||
        location.pricingNotes.length < 1 ||
        location.trends.length < 1 ||
        !category.description
      ) {
        return;
      }

      const primaryKeyword = `${category.name} in ${location.name}`;

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/locations/${location.slug}/${category.slug}`, basePath),
            playbook_type: "locations",
            seo: {
              title: `${category.name} in ${location.name}: Trends, Pricing, and Local Recommendations`,
              meta_description: `Explore ${category.name} in ${location.name} with local trends, pricing context, regulation notes, and recommendations.`,
              primary_keyword: primaryKeyword,
              secondary_keywords: dedupe([
                `${category.name} ${location.name}`,
                `${category.name} providers in ${location.name}`,
                `${location.name} ${category.name} market`,
            ]),
            search_intent: formatSearchIntent("locations"),
          },
          content: {
            h1: `${category.name} in ${location.name}`,
            introduction: `The market for ${category.name} in ${location.name} is shaped by more than product features. Buyers usually need to understand pricing pressure, regulatory drag, rollout maturity, and which workflows are realistic first. Read this guide when the question is not just which tool is strong in general, but which approach actually fits ${location.name}.`,
              sections: [
                {
                  heading: `What is different about ${category.name} in ${location.name}`,
                  body: `${location.overview}\n\nThe local story matters because geography changes buying constraints, compliance requirements, cost expectations, and adoption speed. For ${category.name}, that means the right strategy in ${location.name} should be evaluated against the local decision environment rather than a global average.`,
                },
                {
                  heading: "Local pricing and budget considerations",
                  body: bullets(
                    location.pricingNotes.map(
                      (note) =>
                        `${note}. Use this pricing context to set a realistic shortlist before deeper evaluation.`,
                    ),
                  ),
                },
                {
                  heading: "Regulation and operational risk",
                  body: bullets(
                    location.regulations.map(
                      (regulation) =>
                        `${regulation}. If this rule shapes procurement or implementation, surface it early so the page helps the reader qualify fit instead of creating false certainty.`,
                    ),
                  ),
                },
                {
                  heading: "Local trends influencing the market",
                  body: bullets(location.trends),
                },
                {
                  heading: "Local recommendations",
                  body: joinParagraphs(
                    tools.map(
                      (tool) =>
                        `${tool.name}: relevant in ${location.name} when the team needs ${oxfordList(
                          tool.bestFor.slice(0, 2),
                        ) || tool.description}. Review pricing and regulatory fit before rollout.`,
                    ),
                    `No category-specific tools were provided for ${category.name}, so the safest recommendation is to shortlist providers or products that can document compliance, fit the local pricing model, and support the most important use cases first.`,
                  ),
                },
              ],
              faq: [
                buildFaq(
                  `Why does a location page for ${category.name} need pricing context?`,
                  `Because local pricing changes shortlist quality. Without that context, users still need another search before they can act.`,
                ),
                buildFaq(
                  "Should location pages mention regulation even when rules are evolving?",
                  `Yes, as long as the page explains the operational implication and avoids pretending the rule is static when it is not.`,
                ),
                buildFaq(
                  "How should location pages connect to the rest of the site?",
                  `They should link into directory, comparison, and persona pages so readers can move from local context into product or workflow evaluation.`,
                ),
              ],
              call_to_action: buildCta(primaryKeyword),
            },
            schema: buildSchema("Article", {
              headline: `${category.name} in ${location.name}`,
              contentLocation: {
                "@type": "Place",
                name: location.name,
              },
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].description",
              "locations[].overview",
              "locations[].regulations",
              "locations[].pricingNotes",
              "locations[].trends",
              "tools[].category",
            ],
          },
          category.slug,
          [category.slug, location.slug, ...tools.map((tool) => tool.slug)],
        ),
      );

      categoryServices(category).forEach((service) => {
        const serviceTools = shortlistToolsForService(tools, service, 4);
        const primaryKeyword = `${category.name} in ${location.name} ${service}`;
        pages.push(
          createPageDraft(
            {
              url: buildUrl(
                `/locations/${location.slug}/${category.slug}/${serviceSlug(service)}`,
                basePath,
              ),
              playbook_type: "locations",
              seo: {
                title: `${category.name} in ${location.name} for ${service}`,
                meta_description: `Explore ${category.name} in ${location.name} for ${service}, with local context, workflow fit, and rollout guidance.`,
                primary_keyword: primaryKeyword,
                secondary_keywords: dedupe([
                  `${category.name} ${location.name} ${service}`,
                  `${service} in ${location.name}`,
                  `${location.name} ${category.name} workflow`,
              ]),
              search_intent: formatSearchIntent("locations"),
            },
            content: {
              h1: `${category.name} in ${location.name} for ${service}`,
              introduction: `If the real job is ${service}, the shortlist in ${location.name} usually changes fast. Some tools still look strong, others stop making sense once local budgets, support needs, or rollout complexity are taken seriously. Use this guide to judge ${service} in the context of how teams in ${location.name} actually buy and implement the category.`,
                sections: [
                  {
                    heading: `Why ${service} changes the local evaluation in ${location.name}`,
                    body: `${location.overview}\n\n${service} should be treated as a concrete operating job. In ${location.name}, that means the reader should evaluate local procurement expectations, budget constraints, and team maturity in the context of the exact workflow they want to improve first.`,
                  },
                  {
                    heading: "Local pricing, risk, and trend signals",
                    body: `${bullets(location.pricingNotes)}\n\n${bullets(location.trends)}`,
                  },
                  {
                    heading: "How to roll out this service locally",
                    body: bullets([
                      `Start with a narrow version of ${service} so the team in ${location.name} can measure operational improvement clearly.`,
                      "Check local procurement or data-handling expectations before scaling the workflow.",
                      "Use one owner, one success metric, and one review loop before broadening rollout.",
                    ]),
                  },
                  {
                  heading: "Category and tool recommendations",
                    body: joinParagraphs(
                      serviceTools.map((tool) =>
                        describeToolRecommendation(tool, category, service, location.name),
                      ),
                      `If no category-specific tools are provided, use this page to define the local workflow criteria before moving into shortlist and comparison pages.`,
                    ),
                  },
                ],
                faq: [
                  buildFaq(
                    `Why create a ${service} page for ${location.name}?`,
                    `Because users searching for a specific workflow in a local market usually need more than a broad category page can provide.`,
                  ),
                  buildFaq(
                    `What should buyers in ${location.name} validate first for ${service}?`,
                    `Validate the one local operational constraint that could block rollout and the one measurable outcome the workflow should improve.`,
                  ),
                  buildFaq(
                    "What should this page link to next?",
                    `It should connect to persona, comparison, and translated workflow pages that continue the same specific service intent.`,
                  ),
                ],
                call_to_action: buildCta(primaryKeyword),
              },
              schema: buildSchema("Article", {
                headline: `${category.name} in ${location.name} for ${service}`,
                about: [category.name, location.name, service],
              }),
              internal_links: [],
              related_pages: [],
              data_requirements_used: [
                "categories[].description",
                "categories[].useCases",
                "locations[].overview",
                "locations[].pricingNotes",
                "locations[].trends",
              ],
            },
            category.slug,
            [
              category.slug,
              location.slug,
              serviceSlug(service),
              ...serviceTools.map((tool) => tool.slug),
            ],
          ),
        );
      });

      dataset.personas.forEach((persona) => {
        if (persona.painPoints.length < 2 || persona.recommendedUseCases.length < 1) {
          return;
        }

        const personaKeyword = `${category.name} in ${location.name} for ${persona.name}`;
        pages.push(
          createPageDraft(
            {
              url: buildUrl(
                `/locations/${location.slug}/${category.slug}/for-${persona.slug}`,
                basePath,
              ),
              playbook_type: "locations",
              seo: {
                title: `${category.name} in ${location.name} for ${persona.name}`,
                meta_description: `Learn how ${category.name} in ${location.name} maps to ${persona.name} pain points, local buying context, and use-case fit.`,
                primary_keyword: personaKeyword,
                secondary_keywords: dedupe([
                  `${category.name} ${location.name} ${persona.name}`,
                  `${category.name} for ${persona.name} in ${location.name}`,
                  `${location.name} ${persona.name} ${category.name}`,
              ]),
              search_intent: formatSearchIntent("locations"),
            },
            content: {
              h1: `${category.name} in ${location.name} for ${persona.name}`,
              introduction: `${persona.name} in ${location.name} is rarely evaluating ${category.name} in the abstract. The role, the team shape, and the local buying environment all change what a good choice looks like. Use this guide when you need to see how role-specific priorities hold up inside the market realities of ${location.name}.`,
                sections: [
                  {
                    heading: `Why ${location.name} changes the decision for ${persona.name}`,
                    body: `${location.overview}\n\nFor ${persona.name}, local context matters when procurement expectations, team maturity, or operational constraints influence which use cases can be adopted first. This section helps the reader understand how the market environment in ${location.name} affects role-level decision making.`,
                  },
                  {
                    heading: `${persona.name} pain points in this market`,
                    body: `${persona.description || `${persona.name} evaluates the category through practical workflow pressure.`}\n\n${bullets(
                      persona.painPoints,
                    )}`,
                  },
                  {
                    heading: `Use cases that fit ${persona.name} in ${location.name}`,
                    body: bullets(
                      dedupe([
                        ...persona.recommendedUseCases,
                        ...category.useCases.slice(0, 3),
                      ]).map(
                        (useCase) =>
                          `${useCase}. Prioritize this use case if it reduces one of the main pain points while fitting the local market conditions described above.`,
                      ),
                    ),
                  },
                  {
                    heading: "Local recommendations by tool and workflow",
                    body: joinParagraphs(
                      tools.map(
                        (tool) =>
                          `${tool.name}: a strong fit for ${persona.name} in ${location.name} when the team needs ${oxfordList(
                            tool.bestFor.slice(0, 2),
                          ) || tool.description} and wants to align with the local buying considerations on this page.`,
                      ),
                      `If no category-specific tools are supplied, use this page to shortlist vendors that fit the local market and the persona's highest-priority use case before moving into deeper comparisons.`,
                    ),
                  },
                ],
                faq: [
                  buildFaq(
                    `Why combine ${location.name} and ${persona.name} on one ${category.name} page?`,
                    `Because local buying constraints and role-specific workflow priorities often influence the shortlist together rather than separately.`,
                  ),
                  buildFaq(
                    `What should ${persona.name} validate first in ${location.name}?`,
                    `Validate the one use case that removes a real pain point and still fits the local budget, procurement, and rollout environment.`,
                  ),
                  buildFaq(
                    "What should this page connect to next?",
                    `It should link to curation, directory, and comparison pages so the reader can move from role-and-location fit into vendor selection.`,
                  ),
                ],
                call_to_action: buildCta(personaKeyword),
              },
              schema: buildSchema("Article", {
                headline: `${category.name} in ${location.name} for ${persona.name}`,
                audience: {
                  "@type": "Audience",
                  audienceType: persona.role || persona.name,
                },
                contentLocation: {
                  "@type": "Place",
                  name: location.name,
                },
              }),
              internal_links: [],
              related_pages: [],
              data_requirements_used: [
                "categories[].description",
                "categories[].useCases",
                "locations[].overview",
                "personas[].painPoints",
                "personas[].recommendedUseCases",
                "tools[].category",
              ],
            },
            category.slug,
            [category.slug, location.slug, persona.slug, ...tools.map((tool) => tool.slug)],
          ),
        );

        personaServices(category, persona).forEach((service) => {
          const serviceTools = shortlistToolsForService(tools, service, 4);
          const personaKeyword = `${category.name} in ${location.name} for ${persona.name} ${service}`;
          pages.push(
            createPageDraft(
              {
                url: buildUrl(
                  `/locations/${location.slug}/${category.slug}/for-${persona.slug}/${serviceSlug(
                    service,
                  )}`,
                  basePath,
                ),
                playbook_type: "locations",
                seo: {
                  title: `${category.name} in ${location.name} for ${persona.name}: ${service}`,
                  meta_description: `See how ${category.name} in ${location.name} supports ${persona.name} for ${service}, with local and role-specific guidance.`,
                  primary_keyword: personaKeyword,
                  secondary_keywords: dedupe([
                    `${category.name} ${location.name} ${persona.name} ${service}`,
                    `${service} for ${persona.name} in ${location.name}`,
                    `${location.name} ${persona.name} ${category.name} ${service}`,
                ]),
                search_intent: formatSearchIntent("locations"),
              },
              content: {
                h1: `${category.name} in ${location.name} for ${persona.name}: ${service}`,
                  introduction: `Some searches are already narrow by the time they happen. If ${persona.name} in ${location.name} is trying to improve ${service}, a broad category guide is noise. This page focuses on the tradeoffs that matter first, what has to be proven in a live evaluation, and where the shortlist should get tighter before rollout starts.`,
                  sections: [
                    {
                      heading: `Why ${service} matters to ${persona.name} in ${location.name}`,
                      body: `${location.overview}\n\n${persona.description || `${persona.name} evaluates the workflow through practical operational pressure.`}\n\nUse this section to decide whether ${service} is the right first workflow for this role in this market, and what has to be validated before broader adoption.`,
                    },
                    {
                      heading: "Role-specific local pain points",
                      body: bullets(persona.painPoints),
                    },
                    {
                      heading: "Implementation guidance for this exact combination",
                      body: bullets([
                        `Use ${service} as a narrow pilot for ${persona.name} in ${location.name}.`,
                        "Map the pilot to one measurable workflow outcome and one review owner.",
                        "Check local budget, procurement, and governance constraints before scale.",
                      ]),
                    },
                    {
                    heading: "Relevant tools and next steps",
                      body: joinParagraphs(
                        serviceTools.map((tool) =>
                          describeToolRecommendation(tool, category, service, location.name),
                        ),
                        `If no category-specific tools are available, use this page to define the shortlist criteria and then move into comparison or directory pages.`,
                      ),
                    },
                  ],
                  faq: [
                    buildFaq(
                      `Why combine ${location.name}, ${persona.name}, and ${service} on one page?`,
                      `Because the searcher usually has a narrow workflow need, and combining those filters answers a different intent than a broad category page.`,
                    ),
                    buildFaq(
                      `What should ${persona.name} in ${location.name} validate first for ${service}?`,
                      `Validate whether the workflow solves a real local pain point and whether the operating constraints in that market allow a clean rollout.`,
                    ),
                    buildFaq(
                      "What should this page connect to next?",
                      `It should connect to translated workflow pages, best-tool pages, and comparison pages that stay aligned with the same service intent.`,
                    ),
                  ],
                  call_to_action: buildCta(personaKeyword),
                },
                schema: buildSchema("Article", {
                  headline: `${category.name} in ${location.name} for ${persona.name}: ${service}`,
                  audience: {
                    "@type": "Audience",
                    audienceType: persona.role || persona.name,
                  },
                  about: [category.name, location.name, persona.name, service],
                }),
                internal_links: [],
                related_pages: [],
                data_requirements_used: [
                  "categories[].useCases",
                  "locations[].overview",
                  "personas[].painPoints",
                  "personas[].recommendedUseCases",
                ],
              },
              category.slug,
              [
                category.slug,
                location.slug,
                persona.slug,
                serviceSlug(service),
                ...serviceTools.map((tool) => tool.slug),
              ],
            ),
          );
        });
      });
    });
  });

  return pages;
}

function buildPersonaPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.categories.forEach((category) => {
    const tools = findToolsForCategory(dataset, category).slice(0, 4);
    dataset.personas.forEach((persona) => {
      if (
        !category.description ||
        persona.painPoints.length < 2 ||
        persona.recommendedUseCases.length < 1
      ) {
        return;
      }

      const primaryKeyword = `${category.name} for ${persona.name}`;

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/${category.slug}/for-${persona.slug}`, basePath),
            playbook_type: "personas",
            seo: {
              title: `${category.name} for ${persona.name}: Benefits, Use Cases, and Fit`,
              meta_description: `Learn how ${category.name} helps ${persona.name} solve specific pain points with the right use cases, benefits, and tool guidance.`,
              primary_keyword: primaryKeyword,
              secondary_keywords: dedupe([
                `${persona.name} ${category.name}`,
                `${category.name} buyer guide for ${persona.name}`,
                `${category.name} use cases for ${persona.name}`,
              ]),
              search_intent: formatSearchIntent("personas"),
            },
            content: {
              h1: `${category.name} for ${persona.name}`,
              introduction: `${primaryKeyword} pages should sound like the persona’s actual workflow, not a category page with one label swapped. This page uses the persona’s documented pain points, goals, and recommended use cases to explain where the category helps, where it creates more work, and which benefits matter enough to justify change.`,
              sections: [
                {
                  heading: `${persona.name}'s core pain points`,
                  body: `${persona.description || `${persona.name} evaluates the category through practical delivery pressure, not abstract feature lists.`}\n\n${bullets(
                    persona.painPoints,
                  )}`,
                },
                {
                  heading: `Where ${category.name} helps`,
                  body: category.useCases
                    .slice(0, 3)
                    .map(
                      (useCase) =>
                        `${useCase}: this becomes relevant for ${persona.name} when the workflow directly reduces one of the documented pain points or helps the team hit an explicit operational goal.`,
                    )
                    .join("\n\n"),
                },
                {
                  heading: "Persona-specific benefits",
                  body: bullets(
                    dedupe([
                      ...persona.benefits,
                      ...persona.goals.map(
                        (goal) =>
                          `Support the goal "${goal}" with a workflow that can be measured and reviewed.`,
                      ),
                    ]),
                  ),
                },
                {
                  heading: "Recommended use-case starting points",
                  body: bullets(
                    persona.recommendedUseCases.map(
                      (useCase) =>
                        `${useCase}. Start here before you attempt a broad rollout so the persona can judge fit on real work.`,
                    ),
                  ),
                },
                {
                  heading: "Tool options that fit this persona",
                  body: tools.length
                    ? tools
                        .map(
                          (tool) =>
                            `${tool.name}: useful when ${persona.name} needs ${oxfordList(
                              tool.bestFor.slice(0, 2),
                            ) || tool.description}. Watch for ${oxfordList(tool.weaknesses.slice(0, 1)) || "the implementation tradeoffs documented in your evaluation process"}.`,
                        )
                        .join("\n\n")
                    : `No category-specific tools were provided, so the page should send the reader toward curation and comparison content before a buying decision.`,
                },
              ],
              faq: [
                buildFaq(
                  `What makes ${category.name} a fit for ${persona.name}?`,
                  `The category is a fit when it removes a pain point the persona already feels and supports a workflow they already own.`,
                ),
                buildFaq(
                  "Should persona pages talk about benefits or features?",
                  `Benefits first, then features only when they explain how the benefit becomes real in the persona's workflow.`,
                ),
                buildFaq(
                  "What should a persona page link to next?",
                  `It should link to comparisons, integrations, and location-specific pages so the reader can keep narrowing from role fit into implementation fit.`,
                ),
              ],
              call_to_action: buildCta(primaryKeyword),
            },
            schema: buildSchema("Article", {
              headline: `${category.name} for ${persona.name}`,
              audience: {
                "@type": "Audience",
                audienceType: persona.role || persona.name,
              },
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].description",
              "categories[].useCases",
              "personas[].painPoints",
              "personas[].goals",
              "personas[].benefits",
              "personas[].recommendedUseCases",
            ],
          },
          category.slug,
          [category.slug, persona.slug, ...tools.map((tool) => tool.slug)],
        ),
      );

      personaServices(category, persona).forEach((service) => {
        const serviceTools = shortlistToolsForService(tools, service, 4);
        const primaryKeyword = `${category.name} for ${persona.name} ${service}`;
        pages.push(
          createPageDraft(
            {
              url: buildUrl(
                `/${category.slug}/for-${persona.slug}/${serviceSlug(service)}`,
                basePath,
              ),
              playbook_type: "personas",
              seo: {
                title: `${category.name} for ${persona.name}: ${service}`,
                meta_description: `See how ${category.name} helps ${persona.name} with ${service}, including role-specific workflow fit and implementation guidance.`,
                primary_keyword: primaryKeyword,
                secondary_keywords: dedupe([
                  `${category.name} ${persona.name} ${service}`,
                  `${service} for ${persona.name}`,
                  `${category.name} workflow for ${persona.name}`,
                ]),
                search_intent: formatSearchIntent("personas"),
              },
              content: {
                h1: `${category.name} for ${persona.name}: ${service}`,
                introduction: `If ${persona.name} is evaluating ${service}, the question is not whether ${category.name} sounds useful in general. It is whether this workflow removes a real bottleneck, what has to be proven first, and which tradeoff could make adoption stall after the pilot. That is the lens this page uses.`,
                sections: [
                  {
                    heading: `${persona.name} pain points around ${service}`,
                    body: `${persona.description || `${persona.name} evaluates the workflow through practical delivery pressure.`}\n\n${bullets(
                      persona.painPoints,
                    )}`,
                  },
                  {
                    heading: `Why ${service} matters inside ${category.name}`,
                    body: `${category.description}\n\nTreat ${service} as a concrete operational job rather than a vague category promise. This page should help ${persona.name} decide whether ${service} is the right entry point for adopting ${category.name}, what evidence to collect, and which implementation risks deserve attention first.`,
                  },
                  {
                    heading: "Benefits, guardrails, and rollout guidance",
                    body: bullets(
                      dedupe([
                        ...persona.benefits,
                        `Start with a narrow version of ${service} so the team can measure whether the workflow actually improves.`,
                        "Document the success metric and review owner before expanding the rollout.",
                      ]),
                    ),
                  },
                  {
                    heading: "Relevant tool options",
                    body: joinParagraphs(
                      serviceTools.map((tool) =>
                        describeToolRecommendation(tool, category, service),
                      ),
                      `If no category-specific tools are provided, use this page to shortlist the workflow criteria first and then move into comparison and directory pages.`,
                    ),
                  },
                ],
                faq: [
                  buildFaq(
                    `Why publish a ${service} page for ${persona.name} instead of only a broad category page?`,
                    `Because users searching for a named workflow usually want a more specific answer than a general category overview.`,
                  ),
                  buildFaq(
                    `What should ${persona.name} validate first for ${service}?`,
                    `Validate the one measurable outcome that ${service} should improve, plus the main implementation risk that could offset the benefit.`,
                  ),
                  buildFaq(
                    "What should this page link to next?",
                    `It should connect to local-market, translation, and comparison pages that continue the same workflow-specific journey.`,
                  ),
                ],
                call_to_action: buildCta(primaryKeyword),
              },
              schema: buildSchema("Article", {
                headline: `${category.name} for ${persona.name}: ${service}`,
                audience: {
                  "@type": "Audience",
                  audienceType: persona.role || persona.name,
                },
                about: [category.name, service],
              }),
              internal_links: [],
              related_pages: [],
              data_requirements_used: [
                "categories[].description",
                "categories[].useCases",
                "personas[].painPoints",
                "personas[].benefits",
                "personas[].recommendedUseCases",
              ],
            },
            category.slug,
            [
              category.slug,
              persona.slug,
              serviceSlug(service),
              ...serviceTools.map((tool) => tool.slug),
            ],
          ),
        );
      });
    });
  });

  return pages;
}

function buildIntegrationPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  return dataset.integrations
    .map((integration) => {
      if (
        integration.setupSteps.length < 3 ||
        integration.useCases.length < 2 ||
        !integration.workflowExample
      ) {
        return null;
      }

      const primaryKeyword = `${integration.toolA} ${integration.toolB} integration`;

      return createPageDraft(
        {
          url: buildUrl(`/integrations/${integration.slug}`, basePath),
          playbook_type: "integrations",
          seo: {
            title: `${integration.toolA} and ${integration.toolB} Integration Guide`,
            meta_description: `Set up the ${integration.toolA} and ${integration.toolB} integration with clear steps, workflow examples, and use-case guidance.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: dedupe([
              `${integration.toolA} ${integration.toolB} setup`,
              `${integration.toolA} ${integration.toolB} workflow`,
              `${integration.toolA} ${integration.toolB} automation`,
            ]),
            search_intent: formatSearchIntent("integrations"),
          },
          content: {
            h1: `${integration.toolA} and ${integration.toolB} Integration`,
            introduction: `A useful integration page has to resolve setup intent fast while still teaching the reader how the connection should be used. This page covers the steps, the workflow logic behind them, the operating benefits of the integration, and an example sequence that teams can adapt instead of rebuilding from scratch.`,
            sections: [
              {
                heading: "What the integration is for",
                body: `${integration.summary || `${integration.toolA} and ${integration.toolB} are most useful together when the workflow needs a clear handoff between systems.`}\n\nThe key is to describe the business or operational job the integration performs, not just the API connection itself. Readers looking for this page already know the tools. They need to know whether connecting them solves a concrete process problem.`,
              },
              {
                heading: "Setup steps",
                body: bullets(
                  integration.setupSteps.map(
                    (step, index) => `Step ${index + 1}: ${step}`,
                  ),
                ),
              },
              {
                heading: "Recommended use cases",
                body: bullets(
                  integration.useCases.map(
                    (useCase) =>
                      `${useCase}. Treat this as a tested workflow shape rather than a generic possibility.`,
                  ),
                ),
              },
              {
                heading: "Workflow example",
                body: `${integration.workflowExample}\n\nUse the example to verify event flow, ownership, and success criteria before you automate at full scale. That is the difference between a page that only lists steps and one that actually helps implementation teams ship cleanly.`,
              },
              {
                heading: "Benefits and guardrails",
                body: bullets(
                  dedupe([
                    ...integration.benefits,
                    "Document the failure mode when one system updates before the other.",
                    "Decide which tool is the system of record before rollout.",
                  ]),
                ),
              },
            ],
            faq: [
              buildFaq(
                `What should I verify before enabling the ${primaryKeyword}?`,
                `Verify field mapping, ownership, retry behavior, and which system is considered the source of truth.`,
              ),
              buildFaq(
                "Why include a workflow example on an integration page?",
                `Because setup alone does not tell the reader whether the integration is worth maintaining in production.`,
              ),
              buildFaq(
                "What should this page link to next?",
                `It should link to comparison pages for either tool, related workflow examples, and adjacent integrations that serve the same process.`,
              ),
            ],
            call_to_action: buildCta(primaryKeyword),
          },
          schema: buildSchema("HowTo", {
            name: `${integration.toolA} and ${integration.toolB} Integration`,
            tool: [integration.toolA, integration.toolB],
          }),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "integrations[].setupSteps",
            "integrations[].useCases",
            "integrations[].workflowExample",
            "integrations[].benefits",
          ],
        },
        slugify(`${integration.toolA}-${integration.toolB}`),
        [slugify(integration.toolA), slugify(integration.toolB), integration.slug],
      );
    })
    .filter((page): page is DraftPage => Boolean(page));
}

function buildTranslationPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.languages.forEach((language) => {
    dataset.categories.forEach((category) => {
      if (
        !language.localizedHeadline ||
        !language.localizedSummary ||
        language.localizedKeywords.length < 1 ||
        language.seoNotes.length < 1 ||
        language.culturalNotes.length < 1 ||
        !category.description
      ) {
        return;
      }

      const primaryKeyword = `${category.name} in ${language.name}`;

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/${language.slug}/${category.slug}`, basePath),
            playbook_type: "translations",
            seo: {
              title: `${category.name} in ${language.nativeName}: Localized SEO Guide`,
              meta_description: `Publish ${category.name} content for ${language.nativeName} searchers with localized keyword targeting, cultural framing, and hreflang guidance.`,
              primary_keyword: primaryKeyword,
              secondary_keywords: dedupe([
                ...language.localizedKeywords.slice(0, 3),
                `${category.name} ${language.nativeName}`,
              ]),
              search_intent: formatSearchIntent("translations"),
            },
            content: {
              h1: `${category.name} for ${language.nativeName} Searchers`,
              introduction: `${language.localizedHeadline}\n\n${language.localizedSummary}\n\nA strong translation page does more than translate strings. It aligns keyword targeting, expectations, examples, and CTA framing to the audience reading in ${language.nativeName}. This page explains how to localize the topic without flattening it into duplicate English content on a different URL.`,
              sections: [
                {
                  heading: "Native-language keyword targeting",
                  body: `Prioritize the phrases real searchers use in ${language.nativeName}, not literal word-for-word translations.\n\n${bullets(
                    language.localizedKeywords.map(
                      (keyword) =>
                        `${keyword}: include this when it matches the page intent and local search vocabulary.`,
                    ),
                  )}`,
                },
                {
                  heading: "Cultural localization guidance",
                  body: bullets(language.culturalNotes),
                },
                {
                  heading: "On-page SEO notes",
                  body: bullets(language.seoNotes),
                },
                {
                  heading: "Hreflang implementation map",
                  body: markdownTable(
                    ["Locale", "URL", "Purpose"],
                    [
                      [language.hreflang, buildUrl(`/${language.slug}/${category.slug}`, basePath), "Localized page"],
                      ["en", buildUrl(`/glossary/${category.slug}`, basePath), "English reference page"],
                    ],
                  ),
                },
              ],
              faq: [
                buildFaq(
                  "Why is literal translation not enough for SEO?",
                  `Because search vocabulary, expectations, and examples vary by market even when the topic appears identical.`,
                ),
                buildFaq(
                  "What should be localized besides the headline?",
                  `The supporting examples, CTA framing, terminology, and internal links should all reflect the local audience context.`,
                ),
                buildFaq(
                  "When should hreflang be added?",
                  `As soon as parallel language versions exist and the URLs are intended to rank independently for different language audiences.`,
                ),
              ],
              call_to_action:
                language.ctaLabel ||
                `Localize ${category.name} pages with consistent metadata, intent mapping, and observable rollout tracking.`,
            },
            schema: buildSchema("Article", {
              headline: `${category.name} in ${language.nativeName}`,
              inLanguage: language.hreflang,
              isPartOf: buildUrl("/", basePath),
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "languages[].localizedHeadline",
              "languages[].localizedSummary",
              "languages[].localizedKeywords",
              "languages[].seoNotes",
              "languages[].culturalNotes",
              "languages[].hreflang",
            ],
          },
          category.slug,
          [category.slug, language.slug],
        ),
      );

      categoryServices(category).forEach((service) => {
        const primaryKeyword = `${category.name} ${service} in ${language.name}`;
        pages.push(
          createPageDraft(
            {
              url: buildUrl(`/${language.slug}/${category.slug}/${serviceSlug(service)}`, basePath),
              playbook_type: "translations",
              seo: {
                title: `${category.name} ${service} in ${language.nativeName}`,
                meta_description: `Localize ${category.name} content for ${service} in ${language.nativeName} with native-language SEO and cultural context.`,
                primary_keyword: primaryKeyword,
                secondary_keywords: dedupe([
                  ...language.localizedKeywords.slice(0, 3),
                  `${service} ${language.nativeName}`,
                  `${category.name} ${service}`,
                ]),
                search_intent: formatSearchIntent("translations"),
              },
                content: {
                  h1: `${category.name} for ${service} in ${language.nativeName}`,
                introduction: `${language.localizedHeadline}\n\nReaders searching in ${language.nativeName} for ${service} usually need more than a translated category explainer. They need vocabulary that sounds native, examples that fit the market, and a CTA that matches how evaluation conversations actually happen in this language.`,
                sections: [
                  {
                    heading: "Native-language workflow targeting",
                    body: `${language.localizedSummary}\n\nLocalize the service framing as well as the category framing. The page should explain why ${service} matters, which terminology is native to the audience, and how the user should evaluate the workflow in the local language.`,
                  },
                  {
                    heading: "Localized SEO notes for this service page",
                    body: `${bullets(language.seoNotes)}\n\n${bullets(language.culturalNotes)}`,
                  },
                  {
                    heading: "How to localize the examples and CTA",
                    body: bullets([
                      `Use examples that make ${service} concrete for ${language.nativeName} readers.`,
                      "Adapt the CTA to the local evaluation style instead of translating it literally.",
                      "Keep internal links aligned with same-language pages for the next step in the journey.",
                    ]),
                  },
                  {
                    heading: "Hreflang and related-page guidance",
                    body: markdownTable(
                      ["Locale", "URL", "Purpose"],
                      [
                        [
                          language.hreflang,
                          buildUrl(`/${language.slug}/${category.slug}/${serviceSlug(service)}`, basePath),
                          "Localized service page",
                        ],
                        ["en", buildUrl(`/glossary/${category.slug}`, basePath), "English reference page"],
                      ],
                    ),
                  },
                ],
                faq: [
                  buildFaq(
                    `Why localize ${service} pages separately from broad category pages?`,
                    `Because a service-specific query usually needs more tailored examples, terminology, and conversion framing than a general category overview.`,
                  ),
                  buildFaq(
                    `What should change besides the headline on a localized ${service} page?`,
                    `The examples, CTA, keyword phrasing, and internal-link destinations should all reflect the local-language journey.`,
                  ),
                  buildFaq(
                    "What should this page link to next?",
                    `It should connect to localized persona, location, and comparison pages that preserve the same workflow intent.`,
                  ),
                ],
                call_to_action:
                  language.ctaLabel ||
                  `Localize ${service} pages with clear native-language intent and observable rollout quality.`,
              },
              schema: buildSchema("Article", {
                headline: `${category.name} ${service} in ${language.nativeName}`,
                inLanguage: language.hreflang,
                about: [category.name, service],
              }),
              internal_links: [],
              related_pages: [],
              data_requirements_used: [
                "languages[].localizedKeywords",
                "languages[].seoNotes",
                "languages[].culturalNotes",
                "categories[].useCases",
              ],
            },
            category.slug,
            [category.slug, language.slug, serviceSlug(service)],
          ),
        );
      });

      dataset.personas.forEach((persona) => {
        personaServices(category, persona).forEach((service) => {
          const primaryKeyword = `${category.name} ${service} for ${persona.name} in ${language.name}`;
          pages.push(
            createPageDraft(
              {
                url: buildUrl(
                  `/${language.slug}/${category.slug}/for-${persona.slug}/${serviceSlug(service)}`,
                  basePath,
                ),
                playbook_type: "translations",
                seo: {
                  title: `${category.name} ${service} for ${persona.name} in ${language.nativeName}`,
                  meta_description: `Localize ${category.name} content for ${persona.name} and ${service} in ${language.nativeName}.`,
                  primary_keyword: primaryKeyword,
                  secondary_keywords: dedupe([
                    `${category.name} ${persona.name} ${service}`,
                    `${service} ${persona.name} ${language.nativeName}`,
                    ...language.localizedKeywords.slice(0, 2),
                  ]),
                  search_intent: formatSearchIntent("translations"),
                },
                content: {
                  h1: `${category.name} for ${persona.name}: ${service} in ${language.nativeName}`,
                  introduction: `${language.nativeName} readers looking at ${service} through the lens of ${persona.name} need more than a translated headline. They need role-specific language, examples that feel native, and guidance that keeps the workflow clear instead of sounding like English copy passed through localization.`,
                  sections: [
                    {
                      heading: `Role and workflow localization for ${persona.name}`,
                      body: `${persona.description || `${persona.name} evaluates the workflow through practical operational pressure.`}\n\nUse localized wording to explain why ${service} matters for this role and what success should look like in practice.`,
                    },
                    {
                      heading: "Localized SEO and editorial guidance",
                      body: `${bullets(language.seoNotes)}\n\n${bullets(language.culturalNotes)}`,
                    },
                    {
                      heading: "How to adapt examples, benefits, and CTA",
                      body: bullets([
                        `Use examples that make ${service} concrete for ${persona.name}.`,
                        "Explain benefits in role-specific terms before introducing deeper product detail.",
                        "Keep the CTA native to the local-language evaluation style.",
                      ]),
                    },
                    {
                      heading: "Related localized pages",
                      body: `This page should link to localized service pages, local-market pages, and comparison pages so the reader can stay in the same language while narrowing the workflow decision.`,
                    },
                  ],
                  faq: [
                    buildFaq(
                      `Why localize ${persona.name} + ${service} pages separately?`,
                      `Because the combination creates a different intent from a broad translated category page and deserves different examples and framing.`,
                    ),
                    buildFaq(
                      "What should stay consistent across localized role pages?",
                      `The core workflow meaning should stay consistent, but keyword phrasing, examples, and CTA framing should adapt to the language and market.`,
                    ),
                    buildFaq(
                      "What should this page connect to next?",
                      `It should connect to localized location and comparison pages that continue the same role-specific workflow journey.`,
                    ),
                  ],
                  call_to_action:
                    language.ctaLabel ||
                    `Publish localized role-specific workflow pages with clear intent and editorial control.`,
                },
                schema: buildSchema("Article", {
                  headline: `${category.name} for ${persona.name}: ${service} in ${language.nativeName}`,
                  inLanguage: language.hreflang,
                  audience: {
                    "@type": "Audience",
                    audienceType: persona.role || persona.name,
                  },
                }),
                internal_links: [],
                related_pages: [],
                data_requirements_used: [
                  "languages[].localizedKeywords",
                  "languages[].seoNotes",
                  "languages[].culturalNotes",
                  "personas[].recommendedUseCases",
                  "categories[].useCases",
                ],
              },
              category.slug,
              [category.slug, language.slug, persona.slug, serviceSlug(service)],
            ),
          );
        });
      });

      dataset.locations.forEach((location) => {
        categoryServices(category).forEach((service) => {
          const primaryKeyword = `${category.name} ${service} in ${location.name} ${language.name}`;
          pages.push(
            createPageDraft(
              {
                url: buildUrl(
                  `/${language.slug}/${location.slug}/${category.slug}/${serviceSlug(service)}`,
                  basePath,
                ),
                playbook_type: "translations",
                seo: {
                  title: `${category.name} ${service} in ${location.name} in ${language.nativeName}`,
                  meta_description: `Localized ${category.name} content for ${service} in ${location.name}, written for ${language.nativeName} readers.`,
                  primary_keyword: primaryKeyword,
                  secondary_keywords: dedupe([
                    `${category.name} ${location.name} ${service}`,
                    `${service} ${location.name} ${language.nativeName}`,
                    ...language.localizedKeywords.slice(0, 2),
                  ]),
                  search_intent: formatSearchIntent("translations"),
                },
                content: {
                  h1: `${category.name} in ${location.name} for ${service} in ${language.nativeName}`,
                  introduction: `Some searches stack three constraints at once: market, language, and workflow. If the job is ${service} in ${location.name} for ${language.nativeName} readers, the guidance has to respect local buying context and use language that feels written for the audience, not translated after the fact.`,
                  sections: [
                    {
                      heading: `Local context for ${service} in ${location.name}`,
                      body: `${location.overview}\n\nUse the local context to explain how the workflow should be evaluated in ${location.name}, and use the language layer to keep the examples and CTA native to ${language.nativeName} readers.`,
                    },
                    {
                      heading: "Localization and market guidance",
                      body: `${bullets(language.seoNotes)}\n\n${bullets(location.pricingNotes)}\n\n${bullets(location.trends)}`,
                    },
                    {
                      heading: "How to localize workflow examples for this market",
                      body: bullets([
                        `Use examples that make ${service} concrete in ${location.name}.`,
                        "Adapt the examples, proof points, and CTA to the language and the local buying environment.",
                        "Link to same-language follow-up pages so the user journey stays coherent.",
                      ]),
                    },
                    {
                      heading: "Suggested next pages",
                      body: `Readers landing here should move to localized persona pages, comparison pages, or broader market pages that still preserve the same workflow intent and language context.`,
                    },
                  ],
                  faq: [
                    buildFaq(
                      `Why create a localized ${location.name} + ${service} page?`,
                      `Because location, language, and workflow can combine into a search intent that broad pages do not satisfy cleanly.`,
                    ),
                    buildFaq(
                      `What should be localized beyond metadata?`,
                      `Examples, CTA framing, benefit language, and related-page routing should all be localized for the market and language.`,
                    ),
                    buildFaq(
                      "What should this page connect to next?",
                      `It should connect to same-language persona and vendor-selection pages for the same workflow.`,
                    ),
                  ],
                  call_to_action:
                    language.ctaLabel ||
                    `Publish market-specific localized workflow pages with clear search intent.`,
                },
                schema: buildSchema("Article", {
                  headline: `${category.name} in ${location.name} for ${service} in ${language.nativeName}`,
                  inLanguage: language.hreflang,
                  contentLocation: {
                    "@type": "Place",
                    name: location.name,
                  },
                }),
                internal_links: [],
                related_pages: [],
                data_requirements_used: [
                  "locations[].overview",
                  "locations[].pricingNotes",
                  "locations[].trends",
                  "languages[].localizedKeywords",
                  "languages[].seoNotes",
                ],
              },
              category.slug,
              [category.slug, language.slug, location.slug, serviceSlug(service)],
            ),
          );
        });
      });
    });
  });

  return pages;
}

function buildDirectoryPages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  const pages: DraftPage[] = [];

  dataset.categories.forEach((category) => {
    const tools = findToolsForCategory(dataset, category).filter(
      (tool) => tool.description && tool.directoryTags.length >= 1,
    );

    if (tools.length < 3) {
      return;
    }

    const primaryKeyword = `${category.name} tool directory`;

    pages.push(
      createPageDraft(
        {
          url: buildUrl(`/directory/${category.slug}`, basePath),
          playbook_type: "directory",
          seo: {
            title: `${category.name} Tool Directory With Filters and Attributes`,
            meta_description: `Browse a structured ${category.name} directory with filtering metadata, listing attributes, and category tags.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: dedupe([
              `${category.name} tools`,
              `${category.name} software directory`,
              `${category.name} vendor directory`,
            ]),
            search_intent: formatSearchIntent("directory"),
          },
          content: {
            h1: `${category.name} Tool Directory`,
            introduction: `A directory page should help a reader narrow choices quickly without collapsing into a low-value list. This page organizes ${category.name} tools using listing attributes, category tags, and filter logic pulled from the dataset so the result is easier to scan, compare, and route into deeper evaluation pages.`,
            sections: [
              {
                heading: "How to use the directory",
                body: `Start with the filters that change shortlist quality fastest: workflow fit, pricing model, supported integrations, and the tags that reveal where the product is most likely to work. A directory page is useful when it reduces search time and routes the reader into comparisons or profiles before commitment.`,
              },
              {
                heading: "Filtering metadata",
                body: bullets([
                  ...category.directoryTags.slice(0, 3).map((tag) => `Category tag: ${tag}`),
                  "Pricing model",
                  "Supported file formats",
                  "Integration footprint",
                ]),
              },
              {
                heading: "Listings",
                body: tools
                  .slice(0, 8)
                  .map(
                    (tool) =>
                      `### ${tool.name}\n\nAttributes: ${oxfordList(
                        dedupe([
                          ...tool.directoryTags.slice(0, 3),
                          tool.pricing || tool.pricingModel || "",
                          ...tool.supportedFileFormats.slice(0, 2),
                        ]).filter(Boolean),
                      )}\n\nSummary: ${tool.description}`,
                  )
                  .join("\n\n"),
              },
              {
                heading: "Categorization tags",
                body: bullets(
                  dedupe([
                    ...category.directoryTags,
                    ...tools.flatMap((tool) => tool.directoryTags),
                  ]).slice(0, 10),
                ),
              },
              {
                heading: "How to turn a directory view into a shortlist",
                body: `Once the list is down to a manageable set, move into one ranked guide, one comparison, and one profile or integration page. That sequence gives the reader a stronger buying view than staying inside a long listing page.`,
              },
            ],
            faq: [
              buildFaq(
                "What filters matter most on a directory page?",
                `Filters should reflect buying or implementation decisions, not cosmetic tags. Pricing, workflow fit, integrations, and format support are usually stronger than vague labels.`,
              ),
              buildFaq(
                "How is a directory page different from a best-tools page?",
                `A directory is for discovery and narrowing. A best-tools page adds a ranked point of view.`,
              ),
              buildFaq(
                "What should directory pages link to next?",
                `Profiles, comparisons, and integrations are usually the best next steps because they keep the reader moving toward a decision.`,
              ),
            ],
            call_to_action: buildCta(primaryKeyword),
          },
          schema: buildSchema("ItemList", {
            name: `${category.name} Tool Directory`,
            numberOfItems: tools.length,
          }),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "categories[].directoryTags",
            "tools[].directoryTags",
            "tools[].description",
            "tools[].pricing",
            "tools[].supportedFileFormats",
          ],
        },
        category.slug,
        [category.slug, ...tools.map((tool) => tool.slug)],
      ),
    );

    categoryServices(category).forEach((service) => {
      const serviceTools = shortlistToolsForService(tools, service, 8);
      if (serviceTools.length < 3) {
        return;
      }

      const serviceKeyword = `${category.name} ${service} tool directory`;

      pages.push(
        createPageDraft(
          {
            url: buildUrl(`/directory/${category.slug}/${serviceSlug(service)}`, basePath),
            playbook_type: "directory",
            seo: {
              title: `${category.name} Tool Directory for ${service}`,
              meta_description: `Browse ${category.name} tools for ${service} with filtering metadata, listing attributes, and workflow-specific tags.`,
              primary_keyword: serviceKeyword,
              secondary_keywords: dedupe([
                `${category.name} ${service} tools`,
                `${service} tool directory`,
                `${category.name} workflow directory`,
              ]),
              search_intent: formatSearchIntent("directory"),
            },
            content: {
              h1: `${category.name} Tool Directory for ${service}`,
              introduction: `This directory narrows the category to one workflow: ${service}. That makes it faster to scan because the listing attributes and tags are organized around the job the buyer is actually trying to improve first.`,
              sections: [
                {
                  heading: `What matters when the search is really about ${service}`,
                  body: `Start with workflow fit, then narrow by pricing model, integrations, and the tags that reveal how the tool supports ${service}. The goal is to remove weak fits quickly so deeper comparisons happen on a better shortlist.`,
                },
                {
                  heading: "Filtering metadata for this workflow",
                  body: bullets([
                    `Workflow fit for ${service}`,
                    "Pricing model",
                    "Integration footprint",
                    "File-format support where relevant",
                  ]),
                },
                {
                  heading: "Listings most relevant to this workflow",
                  body: joinParagraphs(
                    serviceTools.map(
                      (tool) =>
                        `### ${tool.name}\n\nAttributes: ${oxfordList(
                          dedupe([
                            ...tool.directoryTags.slice(0, 3),
                            tool.pricing || tool.pricingModel || "",
                            ...tool.supportedFileFormats.slice(0, 2),
                          ]).filter(Boolean),
                        )}\n\nSummary: ${describeToolRecommendation(tool, category, service)}`,
                    ),
                    `No tool profiles cleared the workflow-specific threshold for ${service}, so use the filters on this page to define the shortlist rules before you move into a ranked guide or direct comparison.`,
                  ),
                },
                {
                  heading: "Tags to use while narrowing",
                  body: bullets(
                    dedupe([
                      ...category.directoryTags,
                      ...serviceTools.flatMap((tool) => tool.directoryTags),
                    ]).slice(0, 10),
                  ),
                },
                {
                  heading: "Best next evaluation step",
                  body: `After this directory view, move into one ranked guide or one head-to-head comparison focused on ${service}. That is usually the fastest way to turn discovery into a defensible shortlist.`,
                },
              ],
              faq: [
                buildFaq(
                  `Why create a directory page for ${service}?`,
                  `Because buyers searching for a named workflow usually want to narrow by that workflow before they read a broader category list.`,
                ),
                buildFaq(
                  `How should I use a ${service} directory page?`,
                  `Use it to remove weak fits quickly, then move into comparison or curation pages for the final shortlist work.`,
                ),
                buildFaq(
                  "What should this page connect to next?",
                  `It should connect to ranked guides, comparisons, and persona pages that keep the same workflow intent intact.`,
                ),
              ],
              call_to_action: buildCta(serviceKeyword),
            },
            schema: buildSchema("ItemList", {
              name: `${category.name} Tool Directory for ${service}`,
              about: [category.name, service],
              numberOfItems: serviceTools.length,
            }),
            internal_links: [],
            related_pages: [],
            data_requirements_used: [
              "categories[].directoryTags",
              "categories[].useCases",
              "tools[].directoryTags",
              "tools[].description",
              "tools[].pricing",
              "tools[].supportedFileFormats",
              "tools[].useCases",
            ],
          },
          category.slug,
          [category.slug, serviceSlug(service), ...serviceTools.map((tool) => tool.slug)],
        ),
      );
    });
  });

  return pages;
}

function buildProfilePages(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  return dataset.profiles
    .map((profile) => {
      if (profile.verifiedFacts.length < 2 || profile.milestones.length < 2) {
        return null;
      }

      const primaryKeyword = profile.name;

      return createPageDraft(
        {
          url: buildUrl(`/profiles/${profile.slug}`, basePath),
          playbook_type: "profiles",
          seo: {
            title: `${profile.name} Profile: Facts, Milestones, and Operating Context`,
            meta_description: `Read a fact-based profile of ${profile.name} with verified details, milestones, and a concise insight summary.`,
            primary_keyword: primaryKeyword,
            secondary_keywords: dedupe([
              `${profile.name} profile`,
              `${profile.name} overview`,
              `${profile.name} milestones`,
            ]),
            search_intent: formatSearchIntent("profiles"),
          },
          content: {
            h1: `${profile.name} Profile`,
            introduction: `A strong profile page should earn trust by being factual first. This page focuses on verified data points, a milestone timeline, and one concise interpretive summary that helps the reader understand why the profile matters. That structure keeps the page useful for navigational searches while still creating enough depth to support related comparison, directory, and category pages.`,
            sections: [
              {
                heading: "Verified factual data",
                body: bullets(profile.verifiedFacts),
              },
              {
                heading: "Timeline and milestones",
                body: profile.milestones
                  .map((milestone, index) => `${index + 1}. ${milestone}`)
                  .join("\n"),
              },
              {
                heading: "Unique insight summary",
                body: profile.uniqueInsight ||
                  `${profile.name} matters because its documented milestones and factual signals show how it has positioned itself within its market or operating category.`,
              },
              {
                heading: "Why this profile matters to buyers and operators",
                body: `Readers usually land on a profile page because they need context quickly. The page should therefore answer what the entity is, which milestones actually matter, and how the facts connect to broader category decisions. If the reader needs more than that, the next click should be into comparison, directory, or integration content rather than another thin profile page.`,
              },
            ],
            faq: [
              buildFaq(
                "What belongs on a profile page?",
                `Verified facts, meaningful milestones, and a short interpretive summary. Anything speculative should be removed or clearly separated.`,
              ),
              buildFaq(
                "Why include a timeline on profile pages?",
                `Because milestones help readers place the entity in context without reading an unstructured biography.`,
              ),
              buildFaq(
                "What should a profile page link to next?",
                `It should route users to comparisons, directories, or category pages where the profile becomes relevant to an actual decision.`,
              ),
            ],
            call_to_action: buildCta(primaryKeyword),
          },
          schema: buildSchema("ProfilePage", {
            mainEntity: {
              "@type": profile.role === "Product" ? "SoftwareApplication" : "Person",
              name: profile.name,
              description: profile.summary,
              url: profile.website,
            },
          }),
          internal_links: [],
          related_pages: [],
          data_requirements_used: [
            "profiles[].verifiedFacts",
            "profiles[].milestones",
            "profiles[].uniqueInsight",
          ],
        },
        profile.slug,
        [profile.slug, slugify(profile.company)],
      );
    })
    .filter((page): page is DraftPage => Boolean(page));
}

function buildAllCandidates(dataset: NormalizedDataset, basePath: string): DraftPage[] {
  return [
    ...buildTemplatePages(dataset, basePath),
    ...buildCurationPages(dataset, basePath),
    ...buildConversionPages(dataset, basePath),
    ...buildComparisonPages(dataset, basePath),
    ...buildExamplePages(dataset, basePath),
    ...buildLocationPages(dataset, basePath),
    ...buildPersonaPages(dataset, basePath),
    ...buildIntegrationPages(dataset, basePath),
    ...buildGlossaryPages(dataset, basePath),
    ...buildTranslationPages(dataset, basePath),
    ...buildDirectoryPages(dataset, basePath),
    ...buildProfilePages(dataset, basePath),
  ];
}

function attachLinks(pages: DraftPage[]): DraftPage[] {
  return attachDraftLinks(pages);
}

function validateCandidates(pages: DraftPage[]): {
  validPages: DraftPage[];
  rejectionReasons: Record<string, number>;
} {
  const usedUrls = new Set<string>();
  const usedKeywords = new Set<string>();
  const usedIntentKeys = new Set<string>();
  const rejectionReasons: Record<string, number> = {};
  const validPages = pages.filter((page) => {
    let reason = "";

    if (usedUrls.has(page.url)) {
      reason = "duplicate_url";
    }

    const keywordKey = slugify(page.seo.primary_keyword);
    if (!reason && (usedKeywords.has(keywordKey) || usedIntentKeys.has(page.intent_key))) {
      reason = "duplicate_intent_or_keyword";
    }

    if (!reason && page.word_count < minimumWordThreshold(page.playbook_type)) {
      reason = "below_minimum_word_threshold";
    }

    if (!reason && page.content.faq.length < 3) {
      reason = "insufficient_faqs";
    }

    if (!reason && (page.internal_links.length < 5 || page.related_pages.length < 2)) {
      reason = "insufficient_link_graph";
    }

    if (reason) {
      rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1;
      return false;
    }

    usedUrls.add(page.url);
    usedKeywords.add(keywordKey);
    usedIntentKeys.add(page.intent_key);
    return true;
  });

  return {
    validPages,
    rejectionReasons,
  };
}

function stabilizeLinkedCandidates(pages: DraftPage[]) {
  let current = pages;
  let rejectionReasons: Record<string, number> = {};

  for (let iteration = 0; iteration < 5; iteration += 1) {
    const linked = attachLinks(current);
    const validationResult = validateCandidates(linked);

    rejectionReasons = validationResult.rejectionReasons;

    if (validationResult.validPages.length === current.length) {
      return {
        linkedCandidates: linked,
        validCandidates: validationResult.validPages,
        rejectionReasons,
      };
    }

    current = validationResult.validPages;

    if (!current.length) {
      break;
    }
  }

  const linkedCandidates = attachLinks(current);
  const validationResult = validateCandidates(linkedCandidates);

  return {
    linkedCandidates,
    validCandidates: validationResult.validPages,
    rejectionReasons: validationResult.rejectionReasons,
  };
}

function orderBatch(pages: DraftPage[]): DraftPage[] {
  const groups = new Map<PlaybookType, DraftPage[]>();
  PLAYBOOK_ORDER.forEach((playbook) => groups.set(playbook, []));

  pages.forEach((page) => {
    const existing = groups.get(page.playbook_type);
    if (existing) {
      existing.push(page);
    }
  });

  groups.forEach((group) => group.sort((left, right) => left.url.localeCompare(right.url)));

  const ordered: DraftPage[] = [];
  let added = true;

  while (added) {
    added = false;

    PLAYBOOK_ORDER.forEach((playbook) => {
      const group = groups.get(playbook) || [];
      if (group.length) {
        ordered.push(group.shift() as DraftPage);
        added = true;
      }
    });
  }

  return ordered;
}

export function generatePseoValidatedSet(
  dataset: NormalizedDataset,
  request: Pick<PseoBatchRequest, "basePath" | "includePlaybooks" | "targetPages">,
): {
  status: "OK" | "SKIPPED";
  reason?: string;
  pages?: PseoPage[];
  stats?: NonNullable<PseoBatchResponse["stats"]>;
} {
  const basePath = request.basePath || "";
  const targetPages = request.targetPages;
  const includedPlaybooks = request.includePlaybooks
    ? new Set(request.includePlaybooks)
    : null;

  const rawCandidates = buildAllCandidates(dataset, basePath).filter((candidate) =>
    includedPlaybooks ? includedPlaybooks.has(candidate.playbook_type) : true,
  );

  if (rawCandidates.length === 0) {
    return {
      status: "SKIPPED",
      reason: "No valid page candidates could be generated from the provided dataset.",
    };
  }

  const stabilizationResult = stabilizeLinkedCandidates(rawCandidates);
  const linkedCandidates = stabilizationResult.linkedCandidates;
  const validCandidates = stabilizationResult.validCandidates;
  const ordered = orderBatch(validCandidates);
  const uniquePlaybooks = dedupe(ordered.map((page) => page.playbook_type)) as PlaybookType[];

  if (ordered.length === 0) {
    return {
      status: "SKIPPED",
      reason:
        "Pages were generated, but none passed uniqueness, content depth, and internal-link validation.",
    };
  }

  if (uniquePlaybooks.length < 2) {
    return {
      status: "SKIPPED",
      reason:
        "The dataset did not support a mixed-playbook batch after validation. Add richer inputs across more than one playbook.",
    };
  }

  return {
    status: "OK",
    pages: ordered.map(stripDraftFields),
    stats: {
      requested_batch_size: BATCH_LIMIT,
      returned_pages: ordered.length,
      total_candidate_pages: rawCandidates.length,
      total_valid_pages: ordered.length,
      unique_playbooks: uniquePlaybooks,
      rejected_pages: rawCandidates.length - ordered.length,
      meets_target_pages: typeof targetPages === "number" ? ordered.length >= targetPages : undefined,
      target_pages: targetPages,
      playbook_counts: countPlaybooks(ordered),
      generation_diagnostics: {
        raw: countPlaybooks(rawCandidates),
        linked: countPlaybooks(linkedCandidates),
        valid: countPlaybooks(ordered),
        rejection_reasons: stabilizationResult.rejectionReasons,
      },
    },
  };
}

export function generatePseoBatch(
  dataset: NormalizedDataset,
  request: PseoBatchRequest,
): PseoBatchResponse {
  const requestedBatchSize = Math.min(Math.max(request.batchSize || BATCH_LIMIT, 1), BATCH_LIMIT);
  const cursor = Math.max(request.cursor || 0, 0);
  const validated = generatePseoValidatedSet(dataset, request);

  if (validated.status === "SKIPPED" || !validated.pages || !validated.stats) {
    return validated;
  }

  const pages = validated.pages.slice(cursor, cursor + requestedBatchSize);

  if (pages.length === 0) {
    return {
      status: "SKIPPED",
      reason: "The requested cursor is beyond the available validated page set.",
    };
  }

  return {
    status: "OK",
    pages,
    next_cursor:
      cursor + pages.length < validated.stats.total_valid_pages ? cursor + pages.length : null,
    stats: {
      ...validated.stats,
      requested_batch_size: requestedBatchSize,
      returned_pages: pages.length,
    },
  };
}

function countPlaybooks(
  pages: Array<Pick<DraftPage, "playbook_type">>,
): Partial<Record<PlaybookType, number>> {
  return pages.reduce<Partial<Record<PlaybookType, number>>>((accumulator, page) => {
    accumulator[page.playbook_type] = (accumulator[page.playbook_type] || 0) + 1;
    return accumulator;
  }, {});
}

function stripDraftFields(page: DraftPage): PseoPage {
  const { topic_key, entity_keys, intent_key, word_count, ...rest } = page;
  void topic_key;
  void entity_keys;
  void intent_key;
  void word_count;
  return rest;
}
