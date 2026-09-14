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
 * The homepage's short list: scholarly outputs plus the open research code
 * that is genuinely a public output of a project. Each entry keeps the label
 * its own record gives it, so nothing is promoted on the way to this list.
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
  const code: SelectedOutput[] = projects
    .filter((entry) => Boolean(entry.data.repository))
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({
      kind: entry.data.repositoryKind,
      title: entry.data.shortTitle ?? entry.data.title,
      meta: entry.data.repository!.replace('https://', ''),
      href: entry.data.repository!,
      year: Number(entry.data.period.slice(0, 4)),
      external: true,
    }));

  return [...publications, ...code].sort((a, b) => b.year - a.year);
}
