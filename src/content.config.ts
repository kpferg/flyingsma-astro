import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Services collection
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    image: z.string().optional(),
    order: z.number().default(0),
    href: z.string().optional(),
  }),
});

// FAQ collection (data type)
const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Hero slides collection (data type)
const heroSlides = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/hero-slides' }),
  schema: z.object({
    slogan: z.string(),
    subtitle: z.string(),
    buttonText: z.string(),
    buttonAction: z.string(),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  services,
  faq,
  'hero-slides': heroSlides,
};
