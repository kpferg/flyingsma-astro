/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTENTFUL_SPACE_ID?: string;
  readonly PUBLIC_CONTENTFUL_ACCESS_TOKEN?: string;
  readonly PUBLIC_CONTENTFUL_ENVIRONMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Injected at runtime by Google Tag Manager. It is absent until GTM loads (and
 * stays absent if an ad blocker stops it), so every call site guards with
 * `typeof gtag === 'function'`.
 */
declare const gtag: ((...args: unknown[]) => void) | undefined;
