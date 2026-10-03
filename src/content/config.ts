import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    image: z.string(),
    images: z.array(z.string()).optional(),
    category: z.enum(['web', 'mobile', 'desktop', 'system', 'seminar', 'other']),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    projectUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
    highlights: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    outcomes: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    achievements: z.array(z.string()),
    technologies: z.array(z.string()),
    type: z.enum(['full-time', 'part-time', 'internship', 'freelance', 'volunteer']),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    updatedDate: z.string().optional(),
    tags: z.array(z.string()),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, experience, blog };