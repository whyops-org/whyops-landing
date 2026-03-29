export type PlaybookType =
  | "templates"
  | "curation"
  | "conversions"
  | "comparisons"
  | "examples"
  | "locations"
  | "personas"
  | "integrations"
  | "glossary"
  | "translations"
  | "directory"
  | "profiles";

export type StringOr<T> = string | T;

export interface ExampleInput {
  title: string;
  summary?: string;
  takeaway?: string;
  category?: string;
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
  summary?: string;
  subcategories?: Array<StringOr<SubcategoryInput>>;
  useCases?: string[];
  industries?: string[];
  painPoints?: string[];
  examples?: Array<StringOr<ExampleInput>>;
  templateAngles?: string[];
  glossaryTerms?: string[];
  directoryTags?: string[];
}

export interface SubcategoryInput {
  name: string;
  slug?: string;
  description?: string;
  useCases?: string[];
}

export interface ToolInput {
  name: string;
  slug?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  pricing?: string;
  pricingModel?: string;
  strengths?: string[];
  weaknesses?: string[];
  bestFor?: string[];
  useCases?: string[];
  integrations?: string[];
  supportedFileFormats?: string[];
  directoryTags?: string[];
  verifiedFacts?: string[];
  milestones?: string[];
  website?: string;
}

export interface LocationInput {
  name: string;
  slug?: string;
  region?: string;
  country?: string;
  overview?: string;
  regulations?: string[];
  pricingNotes?: string[];
  trends?: string[];
  recommendations?: string[];
  industries?: string[];
}

export interface PersonaInput {
  name: string;
  slug?: string;
  role?: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  benefits?: string[];
  industries?: string[];
  recommendedUseCases?: string[];
}

export interface FileFormatInput {
  name: string;
  slug?: string;
  extension?: string;
  description?: string;
  useCases?: string[];
  supportedTools?: string[];
  conversionTargets?: string[];
}

export interface LanguageInput {
  name: string;
  slug?: string;
  locale?: string;
  nativeName?: string;
  hreflang?: string;
  seoNotes?: string[];
  culturalNotes?: string[];
  localizedKeywords?: string[];
  localizedHeadline?: string;
  localizedSummary?: string;
  ctaLabel?: string;
}

export interface IntegrationInput {
  name?: string;
  slug?: string;
  toolA: string;
  toolB: string;
  summary?: string;
  setupSteps?: string[];
  useCases?: string[];
  workflowExample?: string;
  benefits?: string[];
}

export interface GlossaryTermInput {
  term: string;
  slug?: string;
  definition: string;
  technicalDepth: string;
  relatedTerms?: string[];
}

export interface ProfileInput {
  name: string;
  slug?: string;
  role?: string;
  company?: string;
  summary?: string;
  verifiedFacts?: string[];
  milestones?: string[];
  uniqueInsight?: string;
  website?: string;
}

export interface PseoDatasetInput {
  categories?: Array<StringOr<CategoryInput>>;
  tools?: Array<StringOr<ToolInput>>;
  locations?: Array<StringOr<LocationInput>>;
  personas?: Array<StringOr<PersonaInput>>;
  file_formats?: Array<StringOr<FileFormatInput>>;
  languages?: Array<StringOr<LanguageInput>>;
  integrations?: Array<StringOr<IntegrationInput>>;
  glossary_terms?: Array<StringOr<GlossaryTermInput>>;
  profiles?: Array<StringOr<ProfileInput>>;
}

export type PublicApiSource =
  | "restcountries"
  | "worldbank"
  | "github"
  | "wikidata"
  | "onet"
  | "geonames";

export interface RestCountriesSourceConfig {
  include_countries?: boolean;
  regions?: string[];
  limit?: number;
  endpoint?: string;
}

export interface WorldBankSourceConfig {
  include_countries?: boolean;
  regions?: string[];
  limit?: number;
  endpoint?: string;
}

export interface GithubSourceConfig {
  repos?: string[];
  limit?: number;
  token?: string;
}

export interface WikidataSourceConfig {
  searches?: string[];
  limit_per_search?: number;
}

export interface OnetSourceConfig {
  keyword?: string;
  limit?: number;
  username?: string;
  password?: string;
}

export interface GeoNamesSourceConfig {
  username?: string;
  country_codes?: string[];
  max_rows?: number;
  min_population?: number;
}

export interface PublicSourceConfig {
  enabled_sources?: PublicApiSource[];
  restcountries?: RestCountriesSourceConfig;
  worldbank?: WorldBankSourceConfig;
  github?: GithubSourceConfig;
  wikidata?: WikidataSourceConfig;
  onet?: OnetSourceConfig;
  geonames?: GeoNamesSourceConfig;
}

export interface NormalizedExample {
  title: string;
  summary: string;
  takeaway: string;
  category?: string;
}

export interface NormalizedCategory {
  name: string;
  slug: string;
  description: string;
  summary: string;
  useCases: string[];
  industries: string[];
  painPoints: string[];
  examples: NormalizedExample[];
  templateAngles: string[];
  glossaryTerms: string[];
  directoryTags: string[];
  subcategories: Array<{
    name: string;
    slug: string;
    description: string;
    useCases: string[];
  }>;
}

export interface NormalizedTool {
  name: string;
  slug: string;
  category?: string;
  subcategory?: string;
  description: string;
  pricing: string;
  pricingModel: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  useCases: string[];
  integrations: string[];
  supportedFileFormats: string[];
  directoryTags: string[];
  verifiedFacts: string[];
  milestones: string[];
  website?: string;
}

export interface NormalizedLocation {
  name: string;
  slug: string;
  region: string;
  country: string;
  overview: string;
  regulations: string[];
  pricingNotes: string[];
  trends: string[];
  recommendations: string[];
  industries: string[];
}

export interface NormalizedPersona {
  name: string;
  slug: string;
  role: string;
  description: string;
  painPoints: string[];
  goals: string[];
  benefits: string[];
  industries: string[];
  recommendedUseCases: string[];
}

export interface NormalizedFileFormat {
  name: string;
  slug: string;
  extension: string;
  description: string;
  useCases: string[];
  supportedTools: string[];
  conversionTargets: string[];
}

export interface NormalizedLanguage {
  name: string;
  slug: string;
  locale: string;
  nativeName: string;
  hreflang: string;
  seoNotes: string[];
  culturalNotes: string[];
  localizedKeywords: string[];
  localizedHeadline?: string;
  localizedSummary?: string;
  ctaLabel?: string;
}

export interface NormalizedIntegration {
  name: string;
  slug: string;
  toolA: string;
  toolB: string;
  summary: string;
  setupSteps: string[];
  useCases: string[];
  workflowExample: string;
  benefits: string[];
}

export interface NormalizedGlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  technicalDepth: string;
  relatedTerms: string[];
}

export interface NormalizedProfile {
  name: string;
  slug: string;
  role: string;
  company: string;
  summary: string;
  verifiedFacts: string[];
  milestones: string[];
  uniqueInsight: string;
  website?: string;
}

export interface NormalizedDataset {
  categories: NormalizedCategory[];
  tools: NormalizedTool[];
  locations: NormalizedLocation[];
  personas: NormalizedPersona[];
  fileFormats: NormalizedFileFormat[];
  languages: NormalizedLanguage[];
  integrations: NormalizedIntegration[];
  glossaryTerms: NormalizedGlossaryTerm[];
  profiles: NormalizedProfile[];
}

export interface PseoPage {
  url: string;
  playbook_type: PlaybookType;
  seo: {
    title: string;
    meta_description: string;
    primary_keyword: string;
    secondary_keywords: string[];
    search_intent: string;
  };
  content: {
    h1: string;
    introduction: string;
    sections: Array<{
      heading: string;
      body: string;
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
    call_to_action: string;
  };
  schema: {
    type: string;
    structured_data: Record<string, unknown>;
  };
  internal_links: Array<{
    url: string;
    anchor: string;
    relation: "parent" | "sibling" | "cross-playbook";
  }>;
  related_pages: Array<{
    url: string;
    title: string;
    reason: string;
  }>;
  data_requirements_used: string[];
}

export interface PseoBatchRequest {
  dataset?: PseoDatasetInput;
  batchSize?: number;
  cursor?: number;
  basePath?: string;
  includePlaybooks?: PlaybookType[];
  targetPages?: number;
  source_config?: PublicSourceConfig;
}

export interface PseoBatchResponse {
  status: "OK" | "SKIPPED";
  reason?: string;
  pages?: PseoPage[];
  next_cursor?: number | null;
  stats?: {
    requested_batch_size: number;
    returned_pages: number;
    total_candidate_pages: number;
    total_valid_pages: number;
    unique_playbooks: PlaybookType[];
    rejected_pages: number;
    meets_target_pages?: boolean;
    target_pages?: number;
    playbook_counts: Partial<Record<PlaybookType, number>>;
    generation_diagnostics?: {
      raw: Partial<Record<PlaybookType, number>>;
      linked: Partial<Record<PlaybookType, number>>;
      valid: Partial<Record<PlaybookType, number>>;
      rejection_reasons: Record<string, number>;
    };
  };
}

export interface SourceExpansionSummary {
  enabled_sources: PublicApiSource[];
  fetched_sources: PublicApiSource[];
  missing_credentials: PublicApiSource[];
  source_errors: Array<{
    source: PublicApiSource;
    message: string;
  }>;
}

export type PseoShardKind =
  | "global-utility"
  | "category-core"
  | "category-location"
  | "category-translation-core"
  | "category-translation-location";

export type PseoShardOwnershipScope =
  | "playbooks"
  | "location-scoped"
  | "translations-core"
  | "translations-location";

export interface PseoManifestOptions {
  locationShardSize?: number;
  languageShardSize?: number;
}

export interface PseoManifestShard {
  id: string;
  kind: PseoShardKind;
  category_slug?: string;
  category_name?: string;
  playbooks: PlaybookType[];
  owned_playbooks: PlaybookType[];
  ownership_scope: PseoShardOwnershipScope;
  location_offset?: number;
  location_limit?: number;
  language_offset?: number;
  language_limit?: number;
  estimated_pages: number;
  estimated_context_pages?: number;
}

export interface PseoManifest {
  total_estimated_pages: number;
  shard_count: number;
  options: Required<PseoManifestOptions>;
  shards: PseoManifestShard[];
}
