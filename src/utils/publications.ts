/**
 * Build-time BibTeX pipeline.
 *
 * The .bib file stays the source of truth for every research output. It is
 * parsed here, once, during the build — no parser and no bibliography data are
 * ever shipped to the browser.
 */
import { parse } from '@retorquere/bibtex-parser';
// Inlined by the bundler at build time: the parser never reaches the browser,
// and the file is resolved without depending on the output layout.
import bibSource from '@data/publications.bib?raw';
import { profile } from '@data/profile';

export type OutputKind = 'pdf' | 'doi' | 'code' | 'data' | 'slides' | 'poster' | 'page';

export interface PublicationLink {
  readonly label: string;
  readonly href: string;
  readonly kind: OutputKind;
}

export interface Publication {
  readonly key: string;
  readonly title: string;
  readonly authors: readonly { name: string; isSelf: boolean }[];
  readonly year: number;
  readonly month: number;
  readonly kindLabel: string;
  readonly venue: string;
  readonly note?: string;
  readonly links: readonly PublicationLink[];
  readonly projectSlug?: string;
  readonly selected: boolean;
  readonly bibtex: string;
}

/**
 * The single conversion boundary for everything the .bib contributes to a page.
 *
 * The parser returns decoded Unicode with any parsed markup as inline HTML
 * tags, and it decomposes accents: "Nicolás" arrives as `a` + U+0301 (NFD).
 * Markup is stripped, whitespace collapsed and the result normalized to NFC
 * here, once, so no individual name ever needs patching downstream.
 */
const clean = (value: string) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFC');

/**
 * Reads a displayable field. BibTeX fields arrive as a string, or as a list
 * when the parser treats the field as repeatable (`organization`).
 */
function display(value: unknown): string | undefined {
  if (typeof value === 'string') return clean(value) || undefined;
  if (Array.isArray(value)) {
    const parts = value.filter((part): part is string => typeof part === 'string').map(clean);
    const joined = parts.filter(Boolean).join(', ');
    return joined || undefined;
  }
  return undefined;
}

/** Reads a link target. Kept separate: a URL is not prose and is never joined. */
function target(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

const kindLabels: Record<string, string> = {
  mastersthesis: "Master's thesis",
  phdthesis: 'Doctoral thesis',
  // The qualifier is part of the label, so no compact rendering of this entry
  // anywhere on the site can read as a published paper.
  unpublished: 'Conference presentation (unpublished)',
  article: 'Journal article',
  inproceedings: 'Conference paper',
  misc: 'Preprint',
};

function buildLinks(fields: Record<string, unknown>): PublicationLink[] {
  const get = (name: string) => target(fields[name]);

  const links: PublicationLink[] = [];
  const pdf = get('pdf');
  const doi = get('doi');
  const url = get('url');
  const code = get('code');
  const data = get('data');
  const slides = get('slides');
  const poster = get('poster');
  const website = get('website');
  const arxiv = get('arxiv');

  if (pdf) links.push({ label: 'PDF', href: pdf, kind: 'pdf' });
  if (doi) links.push({ label: 'DOI', href: `https://doi.org/${doi}`, kind: 'doi' });
  if (arxiv) links.push({ label: 'arXiv', href: `https://arxiv.org/abs/${arxiv}`, kind: 'page' });
  if (url) links.push({ label: 'Repository record', href: url, kind: 'page' });
  if (code) links.push({ label: 'Code', href: code, kind: 'code' });
  if (data) links.push({ label: 'Data', href: data, kind: 'data' });
  if (slides) links.push({ label: 'Slides', href: slides, kind: 'slides' });
  if (poster) links.push({ label: 'Poster', href: poster, kind: 'poster' });
  if (website) links.push({ label: 'Event page', href: website, kind: 'page' });
  return links;
}

function buildVenue(type: string, fields: Record<string, unknown>): string {
  const text = (name: string) => display(fields[name]) ?? '';

  if (type === 'mastersthesis' || type === 'phdthesis') {
    return [text('school'), text('address')].filter(Boolean).join(' · ');
  }
  const parts = [text('booktitle') || text('journal'), text('organization'), text('address')];
  return parts.filter(Boolean).join(' · ');
}

const self = profile.name.normalize('NFC');

let cache: Publication[] | undefined;

export function getPublications(): Publication[] {
  if (cache) return cache;

  const parsed = parse(bibSource, { sentenceCase: false });

  const publications = parsed.entries.map((entry): Publication => {
    const fields = entry.fields as unknown as Record<string, unknown>;
    const creators = Array.isArray(fields.author) ? fields.author : [];

    const authors = creators.map((creator) => {
      const record = creator as { firstName?: string; lastName?: string; name?: string };
      const last = clean(record.lastName ?? '');
      const first = clean(record.firstName ?? '');
      const literal = clean(record.name ?? '');
      const name = literal || [first, last].filter(Boolean).join(' ');
      return { name, isSelf: last === 'Acevedo Villena' || name === self };
    });

    return {
      key: entry.key,
      title: display(fields.title) ?? '',
      authors,
      year: Number(fields.year ?? 0),
      month: Number(fields.month ?? 0),
      kindLabel: display(fields.type) ?? kindLabels[entry.type] ?? 'Research output',
      venue: buildVenue(entry.type, fields),
      note: display(fields.note),
      links: buildLinks(fields),
      projectSlug: display(fields.project),
      selected: display(fields.selected) === 'true',
      // The verbatim record, so it can be copied and cited; only normalized,
      // never reflowed.
      bibtex: entry.input.trim().normalize('NFC'),
    };
  });

  publications.sort(
    (a, b) => b.year - a.year || b.month - a.month || a.title.localeCompare(b.title),
  );
  cache = publications;
  return publications;
}

/** "N. Acevedo Villena, C. Thraves and M. Varas" */
export function formatAuthors(authors: Publication['authors']): string {
  const names = authors.map((a) => {
    const parts = a.name.split(' ');
    const last = parts.slice(-1).join(' ');
    const given = parts.slice(0, -1);
    // Keep multi-word surnames intact (Acevedo Villena).
    const surname = a.isSelf ? 'Acevedo Villena' : last;
    const initials = (a.isSelf ? parts.slice(0, parts.length - 2) : given)
      .map((p) => `${p[0]}.`)
      .join(' ');
    return `${initials} ${surname}`.trim();
  });
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
