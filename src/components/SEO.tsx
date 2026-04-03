import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Kyaw Kyar Car Showroom';

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

const generateHreflangAlternates = (canonicalPath: string): Array<{ href: string; hrefLang: string }> => {
  const basePath = canonicalPath?.replace(/^\/(en|my)/, '')?.replace(/\/$/, '') || '';
  return [
    { href: `/my${basePath}`, hrefLang: 'my' },
    { href: `/en${basePath}`, hrefLang: 'en' },
  ];
};

const detectLang = (lang?: string, canonical?: string) => {
  if (lang === 'my' || lang === 'en') {
    return lang;
  }

  if (canonical?.startsWith('/my')) {
    return 'my';
  }

  if (canonical?.startsWith('/en')) {
    return 'en';
  }

  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/my')) {
      return 'my';
    }

    if (window.location.pathname.startsWith('/en')) {
      return 'en';
    }
  }

  return 'en';
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

const DEFAULT_TITLE = SITE_NAME;
const DEFAULT_DESCRIPTION = 'Discover inspected vehicles and premium buying services at Kyaw Kyar Car Showroom.';
const DEFAULT_IMAGE = '/apple-touch-icon.png';

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  lang,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  alternates,
  structuredData,
}: SEOProps) => {
  const canonicalUrl = buildUrl(canonical);
  const imageUrl = buildUrl(image);
  const pageLang = detectLang(lang, canonical);

  return (
    <Helmet htmlAttributes={{ lang: pageLang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta name="og:site_name" content={SITE_NAME} />
      <meta name="og:description" content={description} />
      <meta name="og:type" content={type} />
      <meta name="og:url" content={canonicalUrl} />
      <meta name="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl || SITE_URL} />
      <link rel="alternate" hrefLang="en" href={buildUrl(canonical?.replace(/^\/(en|my)/, '') ? `/en${canonical?.replace(/^\/(en|my)/, '')}` : '/en')} />
      <link rel="alternate" hrefLang="my" href={buildUrl(canonical?.replace(/^\/(en|my)/, '') ? `/my${canonical?.replace(/^\/(en|my)/, '')}` : '/my')} />
      {canonical && (
        <>
          <link rel="alternate" hrefLang="x-default" href={buildUrl(canonical)} />
          {generateHreflangAlternates(canonical).map(({ href, hrefLang }) => (
            <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={buildUrl(href)} />
          ))}
        </>
      )}
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
