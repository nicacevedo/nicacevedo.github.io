import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const themeId = z.enum([
  'fair-reliable-prediction',
  'infrastructure-modeling',
  'scalable-optimization',
]);

/** Status labels are deliberately few and factual. */
const status = z.enum([
  'Ongoing research',
  'Ongoing public-data modeling',
  'Completed',
  'Conference presentation (unpublished)',
]);

const outputLink = z.object({
  label: z.string(),
  href: z.string(),
  kind: z
    .enum(['repository', 'paper', 'thesis', 'poster', 'slides', 'data', 'page'])
    .default('page'),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    /** One sentence: what this project claims to be about. */
    thesis: z.string(),
    /** Meta description and list summaries. */
    description: z.string(),
    researchQuestion: z.string(),
    period: z.string(),
    status,
    primaryTheme: themeId,
    secondaryThemes: z.array(themeId).default([]),
    /** Featured as a case study on the homepage. */
    featured: z.boolean().default(false),
    /** Active work versus earlier work. */
    stage: z.enum(['current', 'earlier']),
    /** Lower sorts first within its stage. */
    order: z.number(),
    /** Which built-in figure represents this project. */
    visual: z.enum(['frontier', 'network', 'convergence', 'sparse', 'observation', 'sequence']),
    visualCaption: z.string(),
    /**
     * An actual research figure, as opposed to the schematic above. Requires a
     * description and a source, so a real figure can never appear unattributed.
     */
    figure: z
      .object({
        src: z.string(),
        alt: z.string(),
        caption: z.string(),
        source: z.string(),
        sourceHref: z.string(),
      })
      .optional(),
    outputs: z.array(outputLink).default([]),
    repository: z.string().optional(),
    /**
     * What the public repository actually is. A repository is not "software"
     * merely because it contains code, so the conservative label is the
     * default and anything stronger has to be stated here.
     */
    repositoryKind: z
      .enum(['Research repository', 'Research code', 'Research software'])
      .default('Research repository'),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/updates' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
  }),
});

export const collections = { research, updates };
