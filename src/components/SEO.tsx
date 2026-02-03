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

const buildUrl = (path?: string) => {
  if (!path) {
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
  const canonicalUrl = buildUrl(canonical);
  const imageUrl = buildUrl(image);

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:type" content={type} />
      <meta name="og:url" content={canonicalUrl} />
      <meta name="og:image" content={imageUrl} />
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
