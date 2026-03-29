import type {
  CategoryInput,
  ExampleInput,
  FileFormatInput,
  GlossaryTermInput,
  IntegrationInput,
  LanguageInput,
  LocationInput,
  NormalizedCategory,
  NormalizedDataset,
  NormalizedExample,
  NormalizedFileFormat,
  NormalizedGlossaryTerm,
  NormalizedIntegration,
  NormalizedLanguage,
  NormalizedLocation,
  NormalizedPersona,
  NormalizedProfile,
  NormalizedTool,
  PersonaInput,
  ProfileInput,
  PseoDatasetInput,
  StringOr,
  SubcategoryInput,
  ToolInput,
} from "@/lib/pseo/types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toArray<T>(input: T[] | undefined): T[] {
  return Array.isArray(input) ? input : [];
}

function normalizeExample(example: StringOr<ExampleInput>): NormalizedExample {
  if (typeof example === "string") {
    return {
      title: example,
      summary: `${example} shows how teams operationalize the workflow in a production setting.`,
      takeaway: `Use ${example} as a reference when documenting scope, ownership, and success criteria.`,
    };
  }

  return {
    title: example.title,
    summary:
      example.summary ||
      `${example.title} is useful because it makes the workflow concrete and easier to evaluate.`,
    takeaway:
      example.takeaway ||
      `The strongest lesson from ${example.title} is to make the operational logic explicit before scale.`,
    category: example.category,
  };
}

function normalizeSubcategory(input: StringOr<SubcategoryInput>) {
  if (typeof input === "string") {
    return {
      name: input,
      slug: slugify(input),
      description: `${input} is a focused segment within the broader category.`,
      useCases: [],
    };
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description:
      input.description || `${input.name} is a focused segment within the broader category.`,
    useCases: dedupe(toArray(input.useCases)),
  };
}

function normalizeCategory(input: StringOr<CategoryInput>): NormalizedCategory {
  if (typeof input === "string") {
    return {
      name: input,
      slug: slugify(input),
      description: "",
      summary: "",
      useCases: [],
      industries: [],
      painPoints: [],
      examples: [],
      templateAngles: [],
      glossaryTerms: [],
      directoryTags: [],
      subcategories: [],
    };
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description || "",
    summary: input.summary || input.description || "",
    useCases: dedupe(toArray(input.useCases)),
    industries: dedupe(toArray(input.industries)),
    painPoints: dedupe(toArray(input.painPoints)),
    examples: toArray(input.examples).map(normalizeExample),
    templateAngles: dedupe(toArray(input.templateAngles)),
    glossaryTerms: dedupe(toArray(input.glossaryTerms)),
    directoryTags: dedupe(toArray(input.directoryTags)),
    subcategories: toArray(input.subcategories).map(normalizeSubcategory),
  };
}

function normalizeTool(input: StringOr<ToolInput>): NormalizedTool {
  if (typeof input === "string") {
    return {
      name: input,
      slug: slugify(input),
      category: undefined,
      subcategory: undefined,
      description: "",
      pricing: "",
      pricingModel: "",
      strengths: [],
      weaknesses: [],
      bestFor: [],
      useCases: [],
      integrations: [],
      supportedFileFormats: [],
      directoryTags: [],
      verifiedFacts: [],
      milestones: [],
      website: undefined,
    };
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    category: input.category,
    subcategory: input.subcategory,
    description: input.description || "",
    pricing: input.pricing || "",
    pricingModel: input.pricingModel || "",
    strengths: dedupe(toArray(input.strengths)),
    weaknesses: dedupe(toArray(input.weaknesses)),
    bestFor: dedupe(toArray(input.bestFor)),
    useCases: dedupe(toArray(input.useCases)),
    integrations: dedupe(toArray(input.integrations)),
    supportedFileFormats: dedupe(toArray(input.supportedFileFormats)),
    directoryTags: dedupe(toArray(input.directoryTags)),
    verifiedFacts: dedupe(toArray(input.verifiedFacts)),
    milestones: dedupe(toArray(input.milestones)),
    website: input.website,
  };
}

function normalizeLocation(input: StringOr<LocationInput>): NormalizedLocation {
  if (typeof input === "string") {
    return {
      name: input,
      slug: slugify(input),
      region: "",
      country: "",
      overview: "",
      regulations: [],
      pricingNotes: [],
      trends: [],
      recommendations: [],
      industries: [],
    };
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    region: input.region || "",
    country: input.country || "",
    overview: input.overview || "",
    regulations: dedupe(toArray(input.regulations)),
    pricingNotes: dedupe(toArray(input.pricingNotes)),
    trends: dedupe(toArray(input.trends)),
    recommendations: dedupe(toArray(input.recommendations)),
    industries: dedupe(toArray(input.industries)),
  };
}

function normalizePersona(input: StringOr<PersonaInput>): NormalizedPersona {
  if (typeof input === "string") {
    return {
      name: input,
      slug: slugify(input),
      role: "",
      description: "",
      painPoints: [],
      goals: [],
      benefits: [],
      industries: [],
      recommendedUseCases: [],
    };
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    role: input.role || "",
    description: input.description || "",
    painPoints: dedupe(toArray(input.painPoints)),
    goals: dedupe(toArray(input.goals)),
    benefits: dedupe(toArray(input.benefits)),
    industries: dedupe(toArray(input.industries)),
    recommendedUseCases: dedupe(toArray(input.recommendedUseCases)),
  };
}

function normalizeFileFormat(input: StringOr<FileFormatInput>): NormalizedFileFormat {
  if (typeof input === "string") {
    return {
      name: input,
      slug: slugify(input),
      extension: "",
      description: "",
      useCases: [],
      supportedTools: [],
      conversionTargets: [],
    };
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    extension: input.extension || "",
    description: input.description || "",
    useCases: dedupe(toArray(input.useCases)),
    supportedTools: dedupe(toArray(input.supportedTools)),
    conversionTargets: dedupe(toArray(input.conversionTargets)),
  };
}

function normalizeLanguage(input: StringOr<LanguageInput>): NormalizedLanguage {
  if (typeof input === "string") {
    const slug = slugify(input);
    return {
      name: input,
      slug,
      locale: slug,
      nativeName: input,
      hreflang: slug,
      seoNotes: [],
      culturalNotes: [],
      localizedKeywords: [],
    };
  }

  const slug = input.slug || slugify(input.name);

  return {
    name: input.name,
    slug,
    locale: input.locale || slug,
    nativeName: input.nativeName || input.name,
    hreflang: input.hreflang || input.locale || slug,
    seoNotes: dedupe(toArray(input.seoNotes)),
    culturalNotes: dedupe(toArray(input.culturalNotes)),
    localizedKeywords: dedupe(toArray(input.localizedKeywords)),
    localizedHeadline: input.localizedHeadline,
    localizedSummary: input.localizedSummary,
    ctaLabel: input.ctaLabel,
  };
}

function normalizeIntegration(input: StringOr<IntegrationInput>): NormalizedIntegration {
  if (typeof input === "string") {
    const parts = input.split(/[:|-]/).map((part) => part.trim()).filter(Boolean);
    const toolA = parts[0] || input;
    const toolB = parts[1] || `${input} workflow`;
    return {
      name: `${toolA} + ${toolB}`,
      slug: slugify(`${toolA}-${toolB}`),
      toolA,
      toolB,
      summary: "",
      setupSteps: [],
      useCases: [],
      workflowExample: "",
      benefits: [],
    };
  }

  const name = input.name || `${input.toolA} + ${input.toolB}`;
  return {
    name,
    slug: input.slug || slugify(name),
    toolA: input.toolA,
    toolB: input.toolB,
    summary: input.summary || "",
    setupSteps: dedupe(toArray(input.setupSteps)),
    useCases: dedupe(toArray(input.useCases)),
    workflowExample: input.workflowExample || "",
    benefits: dedupe(toArray(input.benefits)),
  };
}

function normalizeGlossaryTerm(
  input: StringOr<GlossaryTermInput>,
): NormalizedGlossaryTerm | null {
  if (typeof input === "string") {
    return null;
  }

  return {
    term: input.term,
    slug: input.slug || slugify(input.term),
    definition: input.definition,
    technicalDepth: input.technicalDepth,
    relatedTerms: dedupe(toArray(input.relatedTerms)),
  };
}

function normalizeProfile(input: StringOr<ProfileInput>): NormalizedProfile | null {
  if (typeof input === "string") {
    return null;
  }

  if (!input.verifiedFacts?.length || !input.milestones?.length) {
    return null;
  }

  return {
    name: input.name,
    slug: input.slug || slugify(input.name),
    role: input.role || "",
    company: input.company || "",
    summary: input.summary || "",
    verifiedFacts: dedupe(toArray(input.verifiedFacts)),
    milestones: dedupe(toArray(input.milestones)),
    uniqueInsight: input.uniqueInsight || "",
    website: input.website,
  };
}

export function normalizeDataset(dataset: PseoDatasetInput): NormalizedDataset {
  const categories = toArray(dataset.categories).map(normalizeCategory);
  const tools = toArray(dataset.tools).map(normalizeTool);
  const locations = toArray(dataset.locations).map(normalizeLocation);
  const personas = toArray(dataset.personas).map(normalizePersona);
  const fileFormats = toArray(dataset.file_formats).map(normalizeFileFormat);
  const languages = toArray(dataset.languages).map(normalizeLanguage);
  const integrations = toArray(dataset.integrations).map(normalizeIntegration);

  const derivedGlossaryTerms: NormalizedGlossaryTerm[] = categories
    .filter((category) => category.description)
    .map((category) => ({
      term: category.name,
      slug: category.slug,
      definition: category.description,
      technicalDepth:
        category.summary ||
        `Teams evaluate ${category.name} by the systems it touches, the operational rigor it needs, and the risks it introduces when scaled.`,
      relatedTerms: dedupe([
        ...category.glossaryTerms,
        ...category.subcategories.map((subcategory) => subcategory.name),
      ]),
    }));

  const glossaryTerms = dedupeBySlug(
    [
      ...toArray(dataset.glossary_terms)
        .map(normalizeGlossaryTerm)
        .filter((item): item is NormalizedGlossaryTerm => Boolean(item)),
      ...derivedGlossaryTerms,
    ],
    (item) => item.slug,
  );

  const derivedProfiles: NormalizedProfile[] = tools
    .filter((tool) => tool.verifiedFacts.length >= 2 && tool.milestones.length >= 2)
    .map((tool) => ({
      name: tool.name,
      slug: tool.slug,
      role: "Product",
      company: tool.name,
      summary: tool.description,
      verifiedFacts: tool.verifiedFacts,
      milestones: tool.milestones,
      uniqueInsight: tool.bestFor[0] || tool.useCases[0] || "",
      website: tool.website,
    }));

  const profiles = dedupeBySlug(
    [
      ...toArray(dataset.profiles)
        .map(normalizeProfile)
        .filter((item): item is NormalizedProfile => Boolean(item)),
      ...derivedProfiles,
    ],
    (item) => item.slug,
  );

  return {
    categories,
    tools,
    locations,
    personas,
    fileFormats,
    languages,
    integrations,
    glossaryTerms,
    profiles,
  };
}

function dedupeBySlug<T>(items: T[], getSlug: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const slug = getSlug(item);
    if (seen.has(slug)) {
      return false;
    }
    seen.add(slug);
    return true;
  });
}
