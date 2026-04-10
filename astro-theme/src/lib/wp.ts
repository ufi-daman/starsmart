import type { HomePageData } from './types';
import staticContent from '../../content/home.json';

const WP_API = import.meta.env.WP_API_URL as string | undefined;

// ---------------------------------------------------------------------------
// GraphQL query — odpovídá ACF Field Groups definovaným ve WordPressu
// ---------------------------------------------------------------------------
const HOME_QUERY = `
  query HomePage {
    page(id: "hlavni-stranka", idType: URI) {
      seo { title description }
      homeFields {
        heroSlides {
          eyeBadge
          headline
          lead
          btnPrimaryLabel
          btnPrimaryUrl
          btnSecondaryLabel
          btnSecondaryUrl
          showAppBadges
        }
        howSteps { number title description }
        products {
          name category price description shopUrl
          image { sourceUrl altText }
        }
        pmsPartners { name vendor logoUrl isCustom }
        rezeYoutubeId
        rezeFeatHeadline
        rezeFeatText
        rezeBullets { text }
        caseStudies {
          type emoji who whoRole headline description quote
          metrics { value label }
        }
        reviews { stars text authorName authorInitials source badge }
        articles { category date title excerpt url imageUrl }
        faqItems { question answer }
        contact { phone email address hours portalUrl }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Fetch z WPGraphQL
// ---------------------------------------------------------------------------
async function fetchFromWP(): Promise<HomePageData> {
  if (!WP_API) throw new Error('WP_API_URL není nastavena');

  const res = await fetch(WP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: HOME_QUERY }),
  });

  if (!res.ok) throw new Error(`WP GraphQL chyba: ${res.status}`);

  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);

  const f = data.page.homeFields;
  return {
    metaTitle: data.page.seo?.title ?? 'STAR Smart — Chytré přístupové systémy',
    metaDescription: data.page.seo?.description ?? '',
    ...f,
  };
}

// ---------------------------------------------------------------------------
// Statická fallback data — načítají se z content/home.json (editovatelné přes CMS)
// ---------------------------------------------------------------------------
const STATIC_DATA = staticContent as unknown as HomePageData;

// ---------------------------------------------------------------------------
// Hlavní export — použij WP nebo fallback
// ---------------------------------------------------------------------------
export async function getHomePageData(): Promise<HomePageData> {
  if (WP_API && import.meta.env.USE_STATIC_FALLBACK !== 'true') {
    try {
      return await fetchFromWP();
    } catch (err) {
      console.warn('[wp.ts] Fallback na statická data:', err);
    }
  }
  return STATIC_DATA;
}
