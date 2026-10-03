import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://elizersoldevilla.github.io';

/**
 * Emits sitemap.xml.
 *
 * Written by hand rather than using @astrojs/sitemap, which threw a
 * `Cannot read properties of undefined (reading 'reduce')` error under this
 * project's `base` + static configuration.
 */
export const GET: APIRoute = async () => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const projects = await getCollection('projects');

  const urls = [
    { loc: `${SITE}${base}/`, priority: '1.0', changefreq: 'monthly' },
    ...projects.map((p) => ({
      loc: `${SITE}${base}/project/${p.slug}/`,
      lastmod: new Date(p.data.endDate ?? p.data.startDate).toISOString().slice(0, 10),
      priority: p.data.featured ? '0.8' : '0.6',
      changefreq: 'yearly',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${'lastmod' in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};