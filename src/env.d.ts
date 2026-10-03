/// <reference path="../.astro/types.d.ts" />
// Type definitions for Astro components
interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly SITE_TITLE: string;
  readonly SITE_DESCRIPTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    locale: string;
  }
}