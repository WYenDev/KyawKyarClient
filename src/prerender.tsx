/**
 * Prerender entry for vite-prerender-plugin.
 * Uses a static route -> SEO map so we avoid running React/browser-only code in Node.
 * Injects correct meta tags and title into the built HTML for each prerendered route.
 */

const DEFAULT_TITLE = 'Kyaw Kyar Car Showroom';
const DEFAULT_DESCRIPTION =
  'Discover inspected vehicles and premium buying services at Kyaw Kyar Car Showroom.';
const DEFAULT_IMAGE = '/apple-touch-icon.png';
const SITE_URL = typeof process !== 'undefined' && process.env?.VITE_CANONICAL_URL
  ? process.env.VITE_CANONICAL_URL.replace(/\/+$/, '')
  : '';

const buildUrl = (path: string) => (path ? `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`.replace(/(?<!:)\/\/+/g, '/') : SITE_URL);

/** Static SEO data for routes we prerender. Add or edit entries to match your pages. */
const ROUTE_SEO: Record<string, { title: string; description: string; canonical?: string; lang?: string; image?: string }> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: '/',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/buyCars': {
    title: 'Browse Cars for Sale in Myanmar | Kyaw Kyar Car Showroom',
    description: "Search Kyaw Kyar's curated inventory of inspected vehicles by brand, model, price, and showroom location.",
    canonical: '/buyCars',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/sellCars': {
    title: 'Sell Your Car | Kyaw Kyar Car Showroom',
    description: 'Sell your car with confidence. Get a fair offer and fast processing at Kyaw Kyar.',
    canonical: '/sellCars',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/reviews': {
    title: 'Reviews | Kyaw Kyar Car Showroom',
    description: 'Read what our customers say about buying and selling cars at Kyaw Kyar.',
    canonical: '/reviews',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/contact': {
    title: 'Contact Us | Kyaw Kyar Car Showroom',
    description: 'Get in touch with Kyaw Kyar Car Showroom for inquiries and support.',
    canonical: '/contact',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/payments': {
    title: 'Payments | Kyaw Kyar Car Showroom',
    description: 'Payment options and installment plans for your car purchase.',
    canonical: '/payments',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/why-kyawkyar/rigorous-quality-inspection': {
    title: 'Rigorous Quality Inspection | Kyaw Kyar',
    description: 'Every car is thoroughly inspected before sale. Learn about our quality standards.',
    canonical: '/why-kyawkyar/rigorous-quality-inspection',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/why-kyawkyar/swift-processing': {
    title: 'Swift Processing | Kyaw Kyar',
    description: 'Fast, transparent processing when you buy or sell with Kyaw Kyar.',
    canonical: '/why-kyawkyar/swift-processing',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/why-kyawkyar/clean-history': {
    title: 'Clean History | Kyaw Kyar',
    description: 'We verify vehicle history so you can buy with confidence.',
    canonical: '/why-kyawkyar/clean-history',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
  '/showroom-installment': {
    title: 'Showroom Installment | Kyaw Kyar',
    description: 'Flexible installment plans for your car purchase.',
    canonical: '/showroom-installment',
    lang: 'en',
    image: DEFAULT_IMAGE,
  },
};

export type PrerenderData = { url: string };

function pathFromUrl(url: string): string {
  try {
    const u = new URL(url, 'https://example.com');
    return u.pathname || '/';
  } catch {
    return url || '/';
  }
}

function buildHeadElements(seo: typeof ROUTE_SEO[string]) {
  const canonicalUrl = buildUrl(seo.canonical ?? '/');
  const imageUrl = buildUrl(seo.image ?? DEFAULT_IMAGE);
  const title = seo.title ?? DEFAULT_TITLE;
  const description = seo.description ?? DEFAULT_DESCRIPTION;
  const elements = new Set<{ type: string; props: Record<string, string> }>();
  elements.add({ type: 'meta', props: { name: 'description', content: description } });
  elements.add({ type: 'meta', props: { property: 'og:title', content: title } });
  elements.add({ type: 'meta', props: { property: 'og:description', content: description } });
  elements.add({ type: 'meta', props: { property: 'og:type', content: 'website' } });
  elements.add({ type: 'meta', props: { property: 'og:url', content: canonicalUrl } });
  elements.add({ type: 'meta', props: { property: 'og:image', content: imageUrl } });
  elements.add({ type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } });
  elements.add({ type: 'meta', props: { name: 'twitter:title', content: title } });
  elements.add({ type: 'meta', props: { name: 'twitter:description', content: description } });
  elements.add({ type: 'meta', props: { name: 'twitter:image', content: imageUrl } });
  elements.add({ type: 'meta', props: { name: 'robots', content: 'index,follow' } });
  if (canonicalUrl) {
    elements.add({ type: 'link', props: { rel: 'canonical', href: canonicalUrl } });
  }
  return { title, lang: seo.lang ?? 'en', elements };
}

export async function prerender(data: PrerenderData): Promise<{
  html: string;
  head?: { title?: string; lang?: string; elements?: Set<{ type: string; props: Record<string, string> }> };
}> {
  const path = pathFromUrl(data.url);
  const seo = ROUTE_SEO[path] ?? {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: path,
    lang: 'en',
    image: DEFAULT_IMAGE,
  };
  const head = buildHeadElements(seo);
  return {
    html: '', // Plugin injects into #root; client will hydrate into existing root.
    head,
  };
}
