import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2 } from 'lucide-react';
import { mutator } from '../services/mutator';
import SEO from '../components/SEO';
import 'react-quill/dist/quill.snow.css';

export type PromoLandingData = {
  id: string;
  type: string;
  title: string | null;
  brandName: string | null;
  modelName: string | null;
  linkUrl: string | null;
  landingTitle: string | null;
  landingBody: string | null;
  landingImageUrl: string | null;
};

async function fetchLandingBySlug(slug: string): Promise<PromoLandingData> {
  return mutator<PromoLandingData>({ url: `/api/promo-banners/landing/${encodeURIComponent(slug)}` });
}

const PromoLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['promo-landing', slug],
    queryFn: () => fetchLandingBySlug(slug!),
    enabled: !!slug,
  });

  const handleCta = () => {
    if (!data) return;
    if (data.type === 'NEW_ARRIVAL') {
      if (data.modelName) {
        navigate(`/buyCars?model=${encodeURIComponent(data.modelName)}`);
      } else if (data.brandName) {
        navigate(`/buyCars?brand=${encodeURIComponent(data.brandName)}`);
      }
    } else if (data.linkUrl) {
      if (data.linkUrl.startsWith('http')) {
        window.open(data.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(data.linkUrl);
      }
    }
  };

  const ctaLabel =
    data?.type === 'NEW_ARRIVAL' && (data?.modelName || data?.brandName)
      ? `View ${data.modelName || data.brandName} cars`
      : data?.linkUrl
        ? 'Continue'
        : null;

  if (!slug) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-500">Invalid link.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-slate-500">{(error as Error)?.message || 'Page not found.'}</p>
      </div>
    );
  }

  const title = data.landingTitle || data.title || 'Promotion';
  const seoTitle = data.title || 'Promotion';
  const titleIsHtml = typeof data.landingTitle === 'string' && data.landingTitle.trim().startsWith('<');
  const hasContent = data.landingTitle || data.landingBody || data.landingImageUrl;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        canonical={`/promo/${slug}`}
        title={seoTitle}
        description={data.landingBody?.replace(/<[^>]*>/g, '').slice(0, 160) || undefined}
        image={data.landingImageUrl || undefined}
      />

      {/* Hero image: full-bleed with bottom gradient for overlap */}
      {data.landingImageUrl && (
        <div className="relative w-full aspect-[21/9] min-h-[280px] max-h-[50vh] bg-slate-200">
          <img
            src={data.landingImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"
            aria-hidden
          />
        </div>
      )}

      {/* Content: same pattern as FooterBanner so Quill inline font-size works for Burmese */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 font-myanmar">
        {titleIsHtml ? (
          <div
            className="ql-editor banner-rich-text landing-title-content !p-0 mb-4 text-slate-900 tracking-tight [&_p]:mb-0 [&_p]:leading-tight [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2"
            dangerouslySetInnerHTML={{ __html: data.landingTitle!.trim() }}
          />
        ) : (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            {title}
          </h1>
        )}

        {data.landingBody && (
          <div
            className="ql-editor banner-rich-text !p-0 !min-h-0 text-slate-600 [&>p]:mb-4 [&>p:last-child]:mb-0 [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2 !leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: data.landingBody }}
          />
        )}

        {!hasContent && (
          <p className="text-slate-500">No additional content for this promotion.</p>
        )}

        {ctaLabel && (
          <div className="mt-8">
            <button
              type="button"
              onClick={handleCta}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoLandingPage;
