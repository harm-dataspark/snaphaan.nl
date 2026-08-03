import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const teksten = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/teksten' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(['gedicht', 'gedachte', 'verhaal']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { teksten };
