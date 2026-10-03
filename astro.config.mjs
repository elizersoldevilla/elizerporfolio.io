import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const SITE_URL = 'https://elizersoldevilla.github.io';

export default defineConfig({
  site: SITE_URL,
  base: '/elizerporfolio.io',
  output: 'static',
  integrations: [
    tailwind()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});