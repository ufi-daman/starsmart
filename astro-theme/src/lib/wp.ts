import type { HomePageData } from './types';

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
// Statická fallback data (používají se pokud WP_API_URL není k dispozici)
// ---------------------------------------------------------------------------
const STATIC_DATA: HomePageData = {
  metaTitle: 'STAR Smart — Chytré přístupové systémy | H&B Group',
  metaDescription:
    'Modulární elektronický přístupový systém STAR Smart. Odemykejte mobilem, čipem, kódem nebo otiskem prstu. Výhradní distributor pro ČR a SR — Klíčové centrum, H&B Group.',

  heroSlides: [
    {
      eyeBadge: 'Výhradní distributor ČR & SR — H&B Group',
      headline: 'Chytrý přístup<br>do každých<br><span class="hl">dveří.</span>',
      lead: 'Modulární elektronický přístupový systém STAR Smart — pro domácnosti, hotely, sportoviště i státní správu. Odemykejte mobilem, čipem, kódem nebo otiskem prstu.',
      btnPrimaryLabel: 'Najít své řešení',
      btnPrimaryUrl: '#reseni',
      btnSecondaryLabel: 'Případové studie',
      btnSecondaryUrl: '#studie',
      showAppBadges: true,
    },
    {
      eyeBadge: 'Segment: Hotely & penziony',
      headline: 'Bezkontaktní<br>vstup pro vaše<br><span class="hl">hosty.</span>',
      lead: 'Hotelové kování STAR Smart — online check-in, dočasné kódy a přímá integrace s PMS systémy. Bez recepce, bez fyzického klíče, bez kabeláže.',
      btnPrimaryLabel: 'Hotelové řešení',
      btnPrimaryUrl: '#reseni',
      btnSecondaryLabel: 'Integrace PMS →',
      btnSecondaryUrl: '#pms',
    },
    {
      eyeBadge: 'Segment: Krátkodobý pronájem',
      headline: 'Klíče hostům<br>na dálku.<br><span class="hl">Bez předání.</span>',
      lead: 'Automatické PIN kódy nebo mobilní přístup pro každý pobyt. Spravujte více bytů z jedné aplikace — odkudkoliv a kdykoliv.',
      btnPrimaryLabel: 'Řešení pro pronájem',
      btnPrimaryUrl: '#reseni',
      btnSecondaryLabel: 'STAR master app →',
      btnSecondaryUrl: '#aplikace',
    },
    {
      eyeBadge: 'Segment: Sportoviště & fitness',
      headline: 'Šatny a skříňky<br>bez klíčů.<br><span class="hl">Fokus na výkon.</span>',
      lead: 'Nábytkový zámek STAR Smart nahradí staré visací zámky — mobilní app, čip nebo PIN. Žádné ztracené klíče, žádné výměny zámků.',
      btnPrimaryLabel: 'Sportovní řešení',
      btnPrimaryUrl: '#reseni',
      btnSecondaryLabel: 'Produktová řada →',
      btnSecondaryUrl: '#produkty',
    },
  ],

  howSteps: [
    { number: '01', title: 'Konzultace', description: 'Poradíme, jaké produkty jsou vhodné pro váš objekt. Osobně, telefonicky nebo e-mailem — bez závazků.' },
    { number: '02', title: 'Dodávka a montáž', description: 'Produkty doručíme nebo vyzvednete na pobočce. Montáž zvládnete sami nebo s naší odbornou pomocí.' },
    { number: '03', title: 'Registrace v portálu', description: 'Zaregistrujte produkty v klientském portálu STAR a zprovozněte aplikaci STAR master.' },
    { number: '04', title: 'Správa přístupů', description: 'Přidávejte uživatele, nastavujte časy a sledujte historii vstupů odkudkoliv a kdykoliv.' },
  ],

  products: [
    { name: 'Chytrý zámek STAR Smart 2.0', category: 'Zámky', price: 'od 3 482 Kč', description: 'Montáž bez zásahu do dveří. Ideální start pro domácnosti a menší objekty.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370315-chytry-zamek-star.png', imageAlt: 'Chytrý zámek STAR Smart 2.0' },
    { name: 'Elektronické kování STAR Smart', category: 'Kování', price: 'od 5 299 Kč', description: 'Náhrada stávající kliky s Bluetooth odemykáním, využívá stávající otvory ve dveřích.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370322-elektronicke-kovani-star-smart.png', imageAlt: 'Elektronické kování STAR Smart' },
    { name: 'Elektronická vložka STAR Smart', category: 'Vložky', price: 'od 4 597 Kč', description: 'Jednostranná i oboustranná. Zachovává kování a vzhled stávajících dveří.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370338-elektronicka-jednostranna-vlozka-star-smart-s-knoflikem-verze-f.png', imageAlt: 'Elektronická vložka STAR Smart' },
    { name: 'Hotelové kování STAR Smart', category: 'Hotely', price: 'od 6 897 Kč', description: 'Úzké provedení pro hotelové dveře. Karta, čip nebo mobilní aplikace.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370495-hotelova-klika-star-smart-uzke-provedeni.png', imageAlt: 'Hotelové kování STAR Smart' },
    { name: 'Stěnová čtečka STAR Smart', category: 'Čtečky', price: 'od 1 997 Kč', description: 'Pro vstupy, brány, výtahy. Antivandal provedení, více modelů (K3, CF3, HF4…).', imageUrl: 'https://www.klicovecentrum.cz/images/products/370313-stenova-ctecka-star-smart-k2f-k3f-.png', imageAlt: 'Stěnová čtečka STAR Smart' },
    { name: 'Keybox STAR Smart WP', category: 'Key-boxy', price: 'od 2 799 Kč', description: 'Chytrá schránka na klíče. Voděodolná verze pro venkovní montáž.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370499-key-box-star-smart-wp.jpg', imageAlt: 'Keybox STAR Smart WP' },
    { name: 'Nábytkový zámek STAR Smart', category: 'Nábytek', price: 'od 2 397 Kč', description: 'Pro skříňky, šatny a fitness centra. Bateriové napájení, žádná kabeláž.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370307-nabytkovy-zamek-star-smart.png', imageAlt: 'Nábytkový zámek STAR Smart' },
    { name: 'Modul Gateway STAR Smart', category: 'Konektivita', price: 'od 1 097 Kč', description: 'Připojí libovolné zařízení k Wi-Fi pro vzdálený přístup a online správu.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370300-modul-gateway-star-smart.png', imageAlt: 'Modul Gateway STAR Smart' },
    { name: 'Elektronický visací zámek STAR', category: 'Flexibilní', price: 'od 2 997 Kč', description: 'Zabezpečení bez kabeláže pro sklady, venkovní prostory a výstavní použití.', imageUrl: 'https://www.klicovecentrum.cz/images/products/370305-elektronicky-visaci-zamek-star.png', imageAlt: 'Elektronický visací zámek STAR' },
  ],

  segments: [],   // zkráceno — plná data v ACF

  pmsPartners: [
    { name: 'Opera Cloud', vendor: 'Oracle Hospitality', logoUrl: 'https://logo.clearbit.com/oracle.com' },
    { name: 'Mews', vendor: 'Mews Systems', logoUrl: 'https://logo.clearbit.com/mews.com' },
    { name: 'Protel', vendor: 'Protel hotelsoftware', logoUrl: 'https://logo.clearbit.com/protel.net' },
    { name: 'Hotelogix', vendor: 'Hotelogix PMS', logoUrl: 'https://logo.clearbit.com/hotelogix.com' },
    { name: 'Cloudbeds', vendor: 'Cloudbeds', logoUrl: 'https://logo.clearbit.com/cloudbeds.com' },
    { name: 'Apaleo', vendor: 'Apaleo GmbH', logoUrl: 'https://logo.clearbit.com/apaleo.com' },
    { name: 'Clock PMS+', vendor: 'Clock Software', logoUrl: 'https://logo.clearbit.com/clock-software.com' },
    { name: 'Sievert', vendor: 'Sievert Larsen', logoUrl: 'https://logo.clearbit.com/sievert-larsen.de' },
    { name: 'Váš systém', vendor: 'Integrace na míru přes API', isCustom: true },
  ],

  rezeYoutubeId: '9fSZYFQqrO8',
  rezeFeatHeadline: 'STAR Smart × Reze:<br>check-in bez recepce',
  rezeFeatText: 'Reze je český channel manager pro hotely, penziony a apartmány. Propojení se STAR Smart umožňuje plně automatizovaný check-in — host obdrží přístupový kód nebo mobilní přístup ihned po potvrzení rezervace.',
  rezeBullets: [
    { text: 'Automatický PIN kód nebo mobilní přístup po potvrzení v Reze' },
    { text: 'Host odemyká dveře telefonem nebo kódem v SMS — sám, bez obsluhy' },
    { text: 'Vzdálené otevření nebo blokace vstupu odkudkoli na světě' },
    { text: 'Přístupy se automaticky deaktivují po odjezdu hosta' },
    { text: 'Kompletní auditní stopa — přehled každého vstupu v reálném čase' },
  ],

  caseStudies: [],  // zkráceno — plná data v ACF

  reviews: [],      // zkráceno — plná data v ACF

  articles: [],     // zkráceno — plná data v ACF

  faqItems: [
    { question: 'Je nutná elektroinstalace nebo zásah do dveří?', answer: 'Ne. Všechna zařízení STAR Smart jsou bateriová a montují se na stávající dveře bez vrtání nebo kabeláže. Baterie vydrží 12 a více měsíců.' },
    { question: 'Jak se ovládá systém?', answer: 'Přes mobilní aplikaci STAR master (iOS a Android), webový portál nebo fyzickými přihlašovacími prostředky (čip, karta, PIN, otisk prstu).' },
    { question: 'Co se stane při vybité baterii?', answer: 'Aplikace zobrazí upozornění s předstihem. Zámek lze nouzově napájet přes micro-USB z power banky. Mechanický klíč slouží jako záložní řešení.' },
    { question: 'Mohu zámky spravovat vzdáleně?', answer: 'Ano, pokud je zámek připojen přes Gateway modul k Wi-Fi. Pak lze otevírat, zavírat a spravovat přístupy odkudkoli přes internet.' },
    { question: 'Je systém vhodný pro větší objekty?', answer: 'Ano. Systém STAR Smart je plně škálovatelný — od jednoho bytu po hotel se stovkami dveří. Administrace probíhá z jednoho portálu.' },
  ],

  contact: {
    phone: '+420 377 225 903',
    email: 'info@klicovecentrum.cz',
    address: 'Klíčové centrum, Borská 3, 301 00 Plzeň',
    hours: 'Po–Pá 8:00–17:00',
    portalUrl: 'https://star.hbgroup.cz/register/',
  },
};

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
