/**
 * Contentful CMS Client
 *
 * Fetches news, instructors, and fleet data from Contentful CMS.
 * Configure via environment variables:
 * - CONTENTFUL_SPACE_ID
 * - CONTENTFUL_ACCESS_TOKEN
 * - CONTENTFUL_ENVIRONMENT (optional, defaults to 'master')
 */

const SPACE_ID = import.meta.env.CONTENTFUL_SPACE_ID || 'gf6i9onr9mz0';
const ACCESS_TOKEN = import.meta.env.CONTENTFUL_ACCESS_TOKEN || 'hx8ZbAb984moIf6MxQ_3ZmqvbtEiENQt5tqh_E846EM';
const ENVIRONMENT = import.meta.env.CONTENTFUL_ENVIRONMENT || 'master';

// ============================================================================
// Types
// ============================================================================

export interface ContentfulNewsItem {
  id: string;
  headline: string;
  description: string;
  icon?: string;
  image?: string;
  document?: string;
  buttonText?: string;
  buttonAction?: string;
  buttonTarget?: string;
  updatedAt: Date;
}

export interface ContentfulInstructor {
  id: string;
  name: string;
  availability?: string;
  description: string;
  image: string;
  image2?: string;
  order: number;
}

export interface ContentfulAircraft {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: string;
  image2?: string;
  pricing?: string;
  order: number;
}

interface ContentfulResponse {
  items: ContentfulEntry[];
  includes?: {
    Asset?: ContentfulAsset[];
  };
}

interface ContentfulEntry {
  sys: {
    id: string;
    updatedAt: string;
  };
  fields: Record<string, unknown>;
}

interface ContentfulAsset {
  sys: { id: string };
  fields: {
    file: {
      url: string;
    };
  };
}

interface ContentfulRichTextNode {
  nodeType: string;
  content?: ContentfulRichTextContent[];
  data?: { uri?: string };
}

interface ContentfulRichTextContent {
  nodeType: string;
  value?: string;
  data?: { uri?: string };
  content?: ContentfulRichTextContent[];
  marks?: { type: string }[];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert Contentful rich text to plain text
 */
function richTextToPlainText(richText?: { content: ContentfulRichTextNode[] }): string {
  if (!richText?.content) return '';

  return richText.content
    .map((node) => {
      if (!node.content) return '';
      return node.content
        .map((item) => {
          if (item.nodeType === 'text') {
            return item.value || '';
          }
          if (item.nodeType === 'hyperlink' && item.content?.[0]) {
            return item.content[0].value || '';
          }
          return '';
        })
        .join('');
    })
    .join('\n\n');
}

/**
 * Convert Contentful rich text to HTML
 */
function richTextToHtml(richText?: { content: ContentfulRichTextNode[] }): string {
  if (!richText?.content) return '';

  return richText.content
    .map((node) => {
      if (node.nodeType === 'paragraph' && node.content) {
        const innerHtml = node.content
          .map((item) => {
            if (item.nodeType === 'text') {
              let text = item.value || '';
              // Apply marks (bold, italic, etc.)
              if (item.marks) {
                for (const mark of item.marks) {
                  if (mark.type === 'bold') {
                    text = `<strong>${text}</strong>`;
                  } else if (mark.type === 'italic') {
                    text = `<em>${text}</em>`;
                  }
                }
              }
              return text;
            }
            if (item.nodeType === 'hyperlink' && item.content?.[0] && item.data?.uri) {
              const linkText = item.content[0].value || '';
              return `<a href="${item.data.uri}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            }
            return '';
          })
          .join('');
        return `<p>${innerHtml}</p>`;
      }
      return '';
    })
    .join('');
}

/**
 * Get asset URL from Contentful includes
 */
function getAssetUrl(assetRef: { sys: { id: string } } | undefined, assets?: ContentfulAsset[]): string | undefined {
  if (!assetRef || !assets) return undefined;
  const asset = assets.find((a) => a.sys.id === assetRef.sys.id);
  return asset ? `https:${asset.fields.file.url}` : undefined;
}

/**
 * Fetch entries from Contentful
 */
async function fetchContentfulEntries(
  contentType: string,
  order: string = 'fields.order'
): Promise<ContentfulResponse> {
  const url = new URL(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries`
  );
  url.searchParams.set('access_token', ACCESS_TOKEN);
  url.searchParams.set('content_type', contentType);
  url.searchParams.set('order', order);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Fetch news/events from Contentful CMS
 */
export async function getContentfulNews(limit?: number): Promise<ContentfulNewsItem[]> {
  try {
    const data = await fetchContentfulEntries('news-events', '-sys.updatedAt');
    const assets = data.includes?.Asset;

    let items = data.items.map((item) => {
      const fields = item.fields as {
        headline?: string;
        description?: { content: ContentfulRichTextNode[] };
        icon?: string;
        image?: { sys: { id: string } };
        document?: { sys: { id: string } };
        buttonText?: string;
        buttonAction?: string;
        buttonTarget?: string;
      };

      return {
        id: item.sys.id,
        headline: fields.headline || 'Untitled',
        description: richTextToPlainText(fields.description),
        icon: fields.icon,
        image: getAssetUrl(fields.image, assets),
        document: getAssetUrl(fields.document, assets),
        buttonText: fields.buttonText,
        buttonAction: fields.buttonAction,
        buttonTarget: fields.buttonTarget,
        updatedAt: new Date(item.sys.updatedAt),
      };
    });

    if (limit) {
      items = items.slice(0, limit);
    }

    return items;
  } catch (error) {
    console.error('Failed to fetch news from Contentful:', error);
    return [];
  }
}

/**
 * Fetch instructors from Contentful CMS
 */
export async function getContentfulInstructors(): Promise<ContentfulInstructor[]> {
  try {
    const data = await fetchContentfulEntries('instructor', 'fields.order');
    const assets = data.includes?.Asset;

    return data.items.map((item) => {
      const fields = item.fields as {
        name?: string;
        availability?: string;
        description?: string;
        image?: { sys: { id: string } };
        image2?: { sys: { id: string } };
        order?: number;
      };

      return {
        id: item.sys.id,
        name: fields.name || 'Unknown',
        availability: fields.availability,
        description: fields.description || '',
        image: getAssetUrl(fields.image, assets) || '',
        image2: getAssetUrl(fields.image2, assets),
        order: fields.order || 0,
      };
    });
  } catch (error) {
    console.error('Failed to fetch instructors from Contentful:', error);
    return [];
  }
}

/**
 * Fetch fleet/aircraft from Contentful CMS
 */
export async function getContentfulFleet(): Promise<ContentfulAircraft[]> {
  try {
    const data = await fetchContentfulEntries('aircraft', 'fields.order');
    const assets = data.includes?.Asset;

    return data.items.map((item) => {
      const fields = item.fields as {
        title?: string;
        description?: { content: ContentfulRichTextNode[] };
        image?: { sys: { id: string } };
        image2?: { sys: { id: string } };
        pricing?: string;
        order?: number;
      };

      return {
        id: item.sys.id,
        title: fields.title || 'Unknown Aircraft',
        description: richTextToPlainText(fields.description),
        descriptionHtml: richTextToHtml(fields.description),
        image: getAssetUrl(fields.image, assets) || '',
        image2: getAssetUrl(fields.image2, assets),
        pricing: fields.pricing,
        order: fields.order || 0,
      };
    });
  } catch (error) {
    console.error('Failed to fetch fleet from Contentful:', error);
    return [];
  }
}

/**
 * Fuel prices from Contentful
 */
export interface ContentfulFuelPrices {
  jetAFullService: number | null;
  jetASelfService: number | null;
  avgasFullService: number | null;
  avgasSelfService: number | null;
  mogasSelfService: number | null;
  updatedAt: Date;
}

/**
 * Fetch fuel prices from Contentful CMS
 * Uses a specific entry ID for fuel prices
 */
export async function getContentfulFuelPrices(): Promise<ContentfulFuelPrices | null> {
  const FUEL_ENTRY_ID = '4lhawuLvFfPQRZ9eGC7uiH';

  try {
    const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries/${FUEL_ENTRY_ID}?access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const fields = data.fields as {
      jetAFullService?: number;
      jetASelfService?: number;
      avgasFullService?: number;
      avgasSelfService?: number;
      mogasSelfService?: number;
    };

    return {
      jetAFullService: fields.jetAFullService ?? null,
      jetASelfService: fields.jetASelfService ?? null,
      avgasFullService: fields.avgasFullService ?? null,
      avgasSelfService: fields.avgasSelfService ?? null,
      mogasSelfService: fields.mogasSelfService ?? null,
      updatedAt: new Date(data.sys.updatedAt),
    };
  } catch (error) {
    console.error('Failed to fetch fuel prices from Contentful:', error);
    return null;
  }
}

/**
 * Check if Contentful is configured
 */
export function isContentfulConfigured(): boolean {
  return !!(SPACE_ID && ACCESS_TOKEN);
}
