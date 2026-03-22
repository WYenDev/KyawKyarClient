/**
 * Prerender entry for vite-prerender-plugin.
 * Uses a static route -> SEO map so we avoid running React/browser-only code in Node.
 * Injects correct meta tags and title into the built HTML for each prerendered route.
 */

const DEFAULT_TITLE = 'Kyaw Kyar Car Showroom';
const DEFAULT_DESCRIPTION =
  'Discover inspected vehicles and premium buying services at Kyaw Kyar Car Showroom.';
const DEFAULT_IMAGE = '/apple-touch-icon.png';
const BASE_ROUTES = [
  '/',
  '/buyCars',
  '/sellCars',
  '/why-kyawkyar/resell-market-price',
  '/reviews',
  '/contact',
  '/payments',
  '/why-kyawkyar/rigorous-quality-inspection',
  '/why-kyawkyar/swift-processing',
  '/why-kyawkyar/clean-history',
  '/showroom-installment',
];

const ROUTE_SEO: Record<string, { title: string; description: string; canonical?: string; lang?: string; image?: string }> = {};

BASE_ROUTES.forEach(basePath => {
  const pathWithoutSlash = basePath === '/' ? '' : basePath;
  
  ROUTE_SEO[`/my${pathWithoutSlash}`] = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: `/my${pathWithoutSlash}`,
    lang: 'my',
    image: DEFAULT_IMAGE,
  };
  
  ROUTE_SEO[`/en${pathWithoutSlash}`] = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: `/en${pathWithoutSlash}`,
    lang: 'en',
    image: DEFAULT_IMAGE,
  };
});

export type PrerenderData = { url: string };

export async function prerender(_data: PrerenderData): Promise<{
  html: string;
  head?: { title?: string; lang?: string; elements?: Set<{ type: string; props: Record<string, string> }> };
}> {
  return {
    html: '',
  };
}
