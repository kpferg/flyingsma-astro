import { defineCollection, z } from 'astro:content';

// Services collection
const services = defineCollection({
  type: 'content',
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
  type: 'data',
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Hero slides collection (data type)
const heroSlides = defineCollection({
  type: 'data',
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
