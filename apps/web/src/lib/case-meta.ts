import type { CaseStudy } from '@metaxia/shared';

/**
 * Single source of truth for each case study's year — used for display and
 * for ordering everywhere cases are listed (landing rail, index, detail
 * prev/next). Newest year first; ties fall back to the API's order field.
 */
export const CASE_YEARS: Record<string, string> = {
  kryzotech: '2026',
  smarthrflow: '2026',
  'jakaria-finance': '2024',
  jobsyo: '2025',
  'kryzotech-solutions': '2025',
  'better-e-mart': '2025',
};

export const caseYear = (slug: string): string => CASE_YEARS[slug] ?? '2025';

export const sortCases = (items: CaseStudy[]): CaseStudy[] =>
  [...items].sort((a, b) => {
    const byYear = Number(caseYear(b.slug)) - Number(caseYear(a.slug));
    return byYear !== 0 ? byYear : a.order - b.order;
  });
