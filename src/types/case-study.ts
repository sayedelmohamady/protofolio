/**
 * Shared shape for future JSON/TS-driven case studies (Hero, Problem, Process, etc.).
 * Current routes load legacy HTML from `reference/html` and scope styles under `.case-study`.
 */
export type CaseStudyMeta = {
  slug: string;
  title: string;
  description: string;
};

export type CaseStudyHeroModel = {
  eyebrow: string;
  titleHtml: string;
  meta: { label: string; value: string }[];
  dek?: string;
};

export type CaseStudyNavItem = {
  id: string;
  label: string;
};
