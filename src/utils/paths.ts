/**
 * Path helpers for content that stores site-root-relative paths.
 *
 * Astro's `base` option makes every asset URL need a prefix (for example
 * "/elizerporfolio.io"). Concatenating `BASE_URL + 'images/x.png'` is error
 * prone because BASE_URL has no trailing slash, which silently produced
 * "/elizerporfolio.ioimages/x.png". These helpers centralise the join.
 */

/** Joins Astro's `base` with a root-relative path, tolerating missing slashes. */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * Resolves an image reference from content frontmatter to a served URL.
 * Equivalent to {@link withBase} for images; kept as a separate name so call
 * sites read clearly and so casing mismatches have one place to be handled.
 */
export function imageSrc(path: string): string {
  return withBase(path);
}