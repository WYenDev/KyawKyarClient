import { Helmet } from 'react-helmet-async';

export const SITE_URL = (() => {
  const envUrl = import.meta.env.VITE_CANONICAL_URL || import.meta.env.VITE_SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
})();

const buildUrl = (path?: any) => {
  if (!path || typeof path !== 'string') {
    return SITE_URL;
  }
  const normalizedPath = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  return normalizedPath.replace(/(?<!:)\/\/+/g, '/');
};

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  lang?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  alternates?: Array<{ hrefLang: string; href: string }>;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_TITLE = 'Kyaw Kyar Car Showroom';
const DEFAULT_DESCRIPTION = 'Discover inspected vehicles and premium buying services at Kyaw Kyar Car Showroom.';
const DEFAULT_IMAGE = '/apple-touch-icon.png';
const DEFAULT_SITE_NAME = 'Kyaw Kyar Car Showroom';

/** Maps lang (e.g. en, my) to Open Graph locale (e.g. en_US, my_MM). Used by Facebook and Viber link previews. */
const langToOgLocale = (lang: string): string => (lang === 'my' ? 'my_MM' : 'en_US');

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  lang = 'en',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  alternates,
  structuredData,
}: SEOProps) => {
  const canonicalUrl =
    canonical != null && typeof canonical === 'string' ? buildUrl(canonical) : null;
  const imageUrl = buildUrl(image);
  const ogLocale = langToOgLocale(lang);

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Open Graph: used by Facebook, Viber, and other apps for link previews */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonicalUrl != null && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:locale" content={ogLocale} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {alternates?.map(({ href, hrefLang }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={buildUrl(href)} />
      ))}
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}
      {structuredData ? (
        Array.isArray(structuredData) ? (
          structuredData.map((schema, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        )
      ) : null}
    </Helmet>
  );
};

export default SEO;
