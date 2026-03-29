import Link from "next/link";
import { commonClasses } from "@/design-system";
import { content } from "@/design-system/content";
import { PseoRichText } from "@/components/pseo/PseoRichText";
import { env } from "@/lib/env";
import type { PlaybookType, PseoPage } from "@/lib/pseo/types";

type PseoArticleProps = {
  page: PseoPage;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
};

function pathFromUrl(url: string): string {
  return new URL(url).pathname;
}

function headingId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasRenderableBody(body?: string): boolean {
  return typeof body === "string" && body.replace(/\s+/g, " ").trim().length > 0;
}

function buildGuideUses(playbook: PlaybookType): string[] {
  switch (playbook) {
    case "curation":
      return [
        "Cut a broad vendor list down to a shortlist you would actually demo.",
        "See where the top options differ before you involve procurement or engineering.",
        "Carry sharper questions into a live evaluation instead of repeating feature-tour requests.",
      ];
    case "locations":
      return [
        "Adjust the decision for local pricing, regulation, and market maturity.",
        "See which rollout risks matter in this market before you commit to a vendor.",
        "Move from local context into the next comparison, shortlist, or pilot plan.",
      ];
    case "personas":
      return [
        "Map the category to the role's real pain points instead of abstract feature lists.",
        "Find the best first workflow to pilot for this team or stakeholder.",
        "Carry role-specific objections and success criteria into the next evaluation step.",
      ];
    case "comparisons":
      return [
        "Compare the options on workflow fit, not just feature-count symmetry.",
        "Spot which tradeoffs matter before you commit engineering time to a proof of concept.",
        "Leave with a clearer default choice and a sharper pilot plan.",
      ];
    case "examples":
      return [
        "Study real examples for patterns worth borrowing, not surface-level inspiration.",
        "Filter examples by use case so the reference set stays relevant.",
        "Translate good ideas into a working implementation plan for your team.",
      ];
    case "templates":
      return [
        "Start from a reusable structure instead of a blank document or checklist.",
        "See which template variation fits the workflow you are running now.",
        "Roll the template out without turning it into governance busywork.",
      ];
    case "conversions":
      return [
        "Understand what changes during the conversion before you trust the output.",
        "Choose tooling and validation steps that preserve downstream usability.",
        "Move quickly into adjacent converters when this task sits inside a larger workflow.",
      ];
    case "integrations":
      return [
        "Get the setup done without missing the operational checks that cause pain later.",
        "See which workflows justify the integration and which owner should monitor it.",
        "Leave with a cleaner idea of how to support the connection in production.",
      ];
    case "glossary":
      return [
        "Get a beginner-friendly explanation before the technical depth starts.",
        "Understand where the term matters in architecture, evaluation, or rollout work.",
        "Move into the next definition, comparison, or buyer guide without mixing intents.",
      ];
    case "translations":
      return [
        "Localize the topic for searchers who need native-language examples and vocabulary.",
        "Check that wording, examples, and CTA framing fit the market instead of mirroring English.",
        "Stay on a coherent same-language path into adjacent guides and workflow pages.",
      ];
    case "directory":
      return [
        "Browse the category with filters that narrow the shortlist quickly.",
        "Use listing attributes and tags to eliminate weak fits before deeper research.",
        "Move from discovery into comparisons, profiles, and implementation research.",
      ];
    case "profiles":
      return [
        "Get factual context without reading a loose company bio or timeline dump.",
        "Understand which milestones matter for buyers, operators, or market watchers.",
        "Carry the profile context into the comparison or category decision that follows.",
      ];
    default:
      return [
        "Get the important context quickly.",
        "See what matters before taking the next step.",
        "Leave with a narrower, more actionable decision path.",
      ];
  }
}

function buildAudienceSummary(playbook: PlaybookType): string {
  switch (playbook) {
    case "curation":
      return "Built for buyers, operators, and engineering teams that are comparing vendors and want a defensible shortlist before they book demos.";
    case "locations":
      return "Built for teams whose shortlist changes once local pricing, regulation, and rollout realities are taken seriously.";
    case "personas":
      return "Built for readers who need role-specific guidance instead of another broad category explainer.";
    case "comparisons":
      return "Built for teams choosing between live options and trying to avoid another round of vague feature-table research.";
    case "examples":
      return "Built for readers who want working patterns they can adapt, not a gallery they scroll once and forget.";
    case "templates":
      return "Built for teams that want a reusable starting point and enough guidance to keep the template in real use.";
    case "conversions":
      return "Built for operators who need the conversion to work inside the destination workflow, not just complete without an error.";
    case "integrations":
      return "Built for implementation owners who need setup clarity plus a realistic view of production support work.";
    case "glossary":
      return "Built for readers who want the term explained clearly first and then connected to real implementation decisions.";
    case "translations":
      return "Built for teams publishing localized content that needs to feel native to the reader, not mirrored from English.";
    case "directory":
      return "Built for discovery-stage research when the job is to narrow options quickly without losing important context.";
    case "profiles":
      return "Built for readers who need factual context on a company, product, or public figure before they compare or buy.";
    default:
      return "Built for readers who want useful context before they commit to the next step.";
  }
}

function describeLinkRelation(
  relation: "parent" | "sibling" | "cross-playbook",
): string {
  switch (relation) {
    case "parent":
      return "Broader guide";
    case "sibling":
      return "Adjacent page";
    case "cross-playbook":
      return "Different angle on the same topic";
    default:
      return "Related page";
  }
}

export function PseoArticle({ page, breadcrumbs }: PseoArticleProps) {
  const resolvedBreadcrumbs = breadcrumbs || [
    { label: "Home", href: "/" },
    { label: page.content.h1 },
  ];
  const guideUses = buildGuideUses(page.playbook_type);
  const internalLinks = page.internal_links.slice(0, 5);
  const relatedPages = page.related_pages.slice(0, 3);
  const visibleSections = page.content.sections.filter((section) => hasRenderableBody(section.body));
  const primaryLinks = internalLinks.slice(0, 3);
  const secondaryLinks = internalLinks.slice(3, 5);
  const sectionLinks = visibleSections.map((section) => ({
    id: headingId(section.heading),
    heading: section.heading,
  }));

  return (
    <>
      <section className="border-t border-dashed border-ds-border dark:border-ds-dark-border">
        <div className={commonClasses.container}>
          <div className="px-3 py-12 md:px-10 md:py-16">
            <div className="max-w-6xl">
              <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 text-xs text-ds-textSecondary [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:text-ds-dark-textTertiary sm:flex-wrap sm:overflow-visible sm:whitespace-normal sm:pb-0 sm:text-sm">
                {resolvedBreadcrumbs.map((item, index) => (
                  <span
                    key={item.href || item.label}
                    className={`flex items-center gap-2 ${item.href ? "shrink-0" : "hidden sm:flex"}`}
                  >
                    {index > 0 ? (
                      <span className="text-ds-textTertiary dark:text-ds-dark-textTertiary">
                        ›
                      </span>
                    ) : null}
                    {item.href ? (
                      <Link href={item.href} className="transition-opacity hover:opacity-70">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-ds-text-primary dark:text-ds-dark-text-primary">
                        {item.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>

              <h1 className="mt-6 max-w-5xl font-f37stout text-4xl leading-tight text-ds-text-primary dark:text-ds-dark-text-primary md:text-6xl">
                {page.content.h1}
              </h1>

              <p className="mt-6 max-w-[72ch] text-lg leading-8 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                {page.content.introduction}
              </p>

              <div className="mt-10 border-t border-dashed border-ds-border pt-8 dark:border-ds-dark-border">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div>
                    <h2 className="font-f37stout text-2xl text-ds-text-primary dark:text-ds-dark-text-primary">
                      Who should read this
                    </h2>
                    <p className="mt-4 max-w-[60ch] text-base leading-7 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                      {buildAudienceSummary(page.playbook_type)}
                    </p>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                      <a
                        href={content.appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={commonClasses.buttonPrimary}
                      >
                        {content.cta.primary}
                      </a>
                      <a
                        href={env.schedulingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={commonClasses.buttonSecondary}
                      >
                        {content.cta.tertiary}
                      </a>
                    </div>
                  </div>

                  <div className={`${commonClasses.card} p-6`}>
                    <h2 className="font-f37stout text-2xl text-ds-text-primary dark:text-ds-dark-text-primary">
                      What you should leave with
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                      {guideUses.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 text-ds-text-primary dark:text-ds-dark-text-primary">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {sectionLinks.length || primaryLinks.length || secondaryLinks.length ? (
                <div className="mt-10 grid gap-8 border-t border-dashed border-ds-border pt-8 dark:border-ds-dark-border lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div>
                    {sectionLinks.length ? (
                      <>
                        <h2 className="font-f37stout text-2xl text-ds-text-primary dark:text-ds-dark-text-primary">
                          Use this guide in order
                        </h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {sectionLinks.slice(0, 6).map((section, index) => (
                            <a
                              key={section.id}
                              href={`#${section.id}`}
                              className="block rounded-sm border border-ds-border px-4 py-3 text-sm leading-6 text-ds-textSecondary transition-colors hover:bg-ds-backgroundSecondary dark:border-ds-dark-border dark:text-ds-dark-textTertiary dark:hover:bg-ds-dark-backgroundTertiary"
                            >
                              <span className="mr-2 text-ds-textTertiary dark:text-ds-dark-textTertiary">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {section.heading}
                            </a>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>

                  {primaryLinks.length || secondaryLinks.length ? (
                    <div>
                      <h2 className="font-f37stout text-2xl text-ds-text-primary dark:text-ds-dark-text-primary">
                        Open next
                      </h2>
                      <div className="mt-4 space-y-3">
                        {primaryLinks.map((link) => (
                          <Link
                            key={link.url}
                            href={pathFromUrl(link.url)}
                            className="block rounded-sm border border-ds-border px-4 py-3 text-sm leading-6 text-ds-textSecondary transition-colors hover:bg-ds-backgroundSecondary dark:border-ds-dark-border dark:text-ds-dark-textTertiary dark:hover:bg-ds-dark-backgroundTertiary"
                          >
                            <span className="block text-ds-text-primary dark:text-ds-dark-text-primary">
                              {link.anchor}
                            </span>
                            <span className="mt-1 block text-xs text-ds-textTertiary dark:text-ds-dark-textTertiary">
                              {describeLinkRelation(link.relation)}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {secondaryLinks.length ? (
                        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm leading-6 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                          {secondaryLinks.map((link) => (
                            <Link
                              key={link.url}
                              href={pathFromUrl(link.url)}
                              className="transition-opacity hover:opacity-70"
                            >
                              {link.anchor}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className={commonClasses.section}>
        <div className={commonClasses.container}>
          <div className="px-3 py-12 md:px-10 md:py-14">
            <div className="max-w-6xl">
              {visibleSections.map((section, index) => (
                <article
                  key={section.heading}
                  id={headingId(section.heading)}
                  className={
                    index === 0
                      ? "pb-10"
                      : "border-t border-dashed border-ds-border py-10 dark:border-ds-dark-border"
                  }
                >
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-10">
                    <div>
                      <h2 className="font-f37stout text-2xl leading-tight text-ds-text-primary dark:text-ds-dark-text-primary md:text-4xl">
                        {section.heading}
                      </h2>
                    </div>
                    <div className="max-w-[72ch]">
                      <PseoRichText body={section.body} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedPages.length ? (
        <section className={commonClasses.section}>
          <div className={commonClasses.container}>
            <div className="px-3 py-12 md:px-10 md:py-14">
              <div className="max-w-6xl">
                <h2 className="font-f37stout text-3xl text-ds-text-primary dark:text-ds-dark-text-primary md:text-4xl">
                  Keep going
                </h2>
                <p className="mt-4 max-w-[70ch] text-base leading-7 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                  If the shortlist is getting clearer, these are the next pages worth opening.
                </p>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {relatedPages.map((relatedPage) => (
                  <Link
                    key={relatedPage.url}
                    href={pathFromUrl(relatedPage.url)}
                    className={`${commonClasses.card} block p-5 transition-colors hover:bg-ds-backgroundSecondary dark:hover:bg-ds-dark-backgroundTertiary`}
                  >
                    <span className="block font-medium text-ds-text-primary dark:text-ds-dark-text-primary">
                      {relatedPage.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                      {relatedPage.reason}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={commonClasses.section}>
        <div className={commonClasses.container}>
          <div className="px-3 py-12 md:px-10 md:py-16">
            <div className="max-w-5xl">
              <h2 className="font-f37stout text-3xl text-ds-text-primary dark:text-ds-dark-text-primary md:text-5xl">
                Questions buyers usually ask next
              </h2>
              <p className="mt-4 text-base leading-7 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                Clear answers for the practical questions that come up after the first pass through the guide.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {page.content.faq.map((item) => (
                <details key={item.question} className={`${commonClasses.card} group p-6`}>
                  <summary className="cursor-pointer list-none pr-8 text-base font-medium text-ds-text-primary marker:hidden dark:text-ds-dark-text-primary">
                    {item.question}
                  </summary>
                  <p className="mt-4 max-w-[70ch] text-sm leading-6 text-ds-textSecondary dark:text-ds-dark-textTertiary">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={commonClasses.section}>
        <div className={commonClasses.container}>
          <div className="px-3 py-12 md:px-10 md:py-16">
            <div className={`${commonClasses.card} p-8 md:p-10`}>
              <h2 className="max-w-5xl font-f37stout text-3xl leading-tight text-ds-text-primary dark:text-ds-dark-text-primary md:text-5xl">
                {page.content.call_to_action}
              </h2>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href={content.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={commonClasses.buttonPrimary}
                >
                  {content.cta.primary}
                </a>
                <a
                  href={env.schedulingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={commonClasses.buttonSecondary}
                >
                  {content.cta.tertiary}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
