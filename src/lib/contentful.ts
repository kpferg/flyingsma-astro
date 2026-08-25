/**
 * Contentful Content Delivery API configuration.
 *
 * Single source of truth for the space, environment, and delivery token used
 * by the client-side fetches in the news, instructors, fleet, and fuel price
 * sections.
 *
 * The delivery token is read-only and safe to ship to the browser — that is
 * what the Content Delivery API is for. It is committed as a default so the
 * site builds and runs without any environment setup. To point a build at a
 * different space (a sandbox, say), set the PUBLIC_CONTENTFUL_* variables and
 * they take precedence. They must carry the PUBLIC_ prefix or Astro will not
 * expose them to client-side scripts.
 *
 * Never put a Content *Management* API token here — those are read-write and
 * must not reach the browser.
 */

const SPACE_ID = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID || 'gf6i9onr9mz0';
const ENVIRONMENT = import.meta.env.PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';

export const CONTENTFUL_ACCESS_TOKEN =
  import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN || 'hx8ZbAb984moIf6MxQ_3ZmqvbtEiENQt5tqh_E846EM';

export const CONTENTFUL_BASE = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

/** Build a Contentful CDA entries URL with the delivery token attached. */
export function contentfulEntriesUrl(params: Record<string, string>): string {
  const query = new URLSearchParams({ access_token: CONTENTFUL_ACCESS_TOKEN, ...params });
  return `${CONTENTFUL_BASE}/entries?${query}`;
}

/** Build a Contentful CDA single-entry URL with the delivery token attached. */
export function contentfulEntryUrl(entryId: string): string {
  return `${CONTENTFUL_BASE}/entries/${entryId}?access_token=${CONTENTFUL_ACCESS_TOKEN}`;
}
