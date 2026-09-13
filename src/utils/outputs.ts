import { getCollection } from 'astro:content';
import { getPublications, formatAuthors, type Publication } from '@utils/publications';

export interface SelectedOutput {
  readonly kind: string;
  readonly title: string;
  readonly meta: string;
  readonly href: string;
  readonly year: number;
  readonly external: boolean;
}

/**
 * The homepage's short list: formal publications plus the research software
 * that is genuinely a public output of a project.
 */
export async function getSelectedOutputs(): Promise<SelectedOutput[]> {
  const publications: SelectedOutput[] = getPublications()
    .filter((p: Publication) => p.selected)
    .map((p) => ({
      kind: p.kindLabel,
      title: p.title,
      meta: `${formatAuthors(p.authors)} · ${p.venue || 'Unpublished'}`,
      href: '/publications/',
      year: p.year,
      external: false,
    }));

  const projects = await getCollection('research');
  const software: SelectedOutput[] = projects
    .filter((entry) => Boolean(entry.data.repository))
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({
      kind: 'Research software',
      title: entry.data.shortTitle ?? entry.data.title,
      meta: entry.data.repository!.replace('https://', ''),
      href: entry.data.repository!,
      year: Number(entry.data.period.slice(0, 4)),
      external: true,
    }));

  return [...publications, ...software].sort((a, b) => b.year - a.year);
}
