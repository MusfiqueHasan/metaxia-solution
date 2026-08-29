/** Presentation metadata for the service pages — plain-language promises
 *  and body parsing shared by the index and detail views. */

export const SERVICE_PROMISES: Record<string, string> = {
  'ai-integration': 'We put AI to work inside your product — grounded in your data, not bolted on.',
  'cloud-architecture': 'We design, migrate, and run your cloud — fast, safe, and cost-aware.',
  'web-development': 'We build production web apps your customers can rely on.',
  'data-security': 'We find the holes before attackers do, then harden everything.',
  'mobile-apps': 'We ship iOS and Android apps your users keep coming back to.',
  'seo-optimization': 'We make sure the right people actually find you on search.',
};

/** First bullets under "## What we deliver", trimmed to fit a card. */
export function deliverables(body: string, limit = 4, maxLength = 88): string[] {
  const section = body.split(/##\s*What we deliver/i)[1];
  if (!section) return [];
  const items: string[] = [];
  for (const line of section.split('\n')) {
    const match = line.match(/^\s*-\s+(.*)/);
    if (match) {
      const text = match[1].replace(/[*_`]/g, '').trim();
      items.push(
        text.length > maxLength ? `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…` : text,
      );
      if (items.length === limit) break;
    } else if (items.length > 0 && /^##/.test(line)) {
      break;
    }
  }
  return items;
}

export interface ServiceBodySection {
  heading: string;
  content: string;
}

/** Split a markdown body into the intro (before the first ##) and its
 *  ##-headed sections, for custom section chrome around plain markdown. */
export function parseServiceBody(body: string): {
  intro: string;
  sections: ServiceBodySection[];
} {
  const parts = body.split(/^##\s+(.+)$/m);
  const intro = parts[0]?.trim() ?? '';
  const sections: ServiceBodySection[] = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    sections.push({ heading: parts[i].trim(), content: parts[i + 1]?.trim() ?? '' });
  }
  return { intro, sections };
}
