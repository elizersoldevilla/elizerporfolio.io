import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const SITE_URL = 'https://elizersoldevilla.github.io';
const BASE = '/elizerporfolio.io';

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  output: 'static',
  trailingSlash: 'always',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});