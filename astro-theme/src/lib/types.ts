export interface HeroSlide {
  eyeBadge: string;
  headline: string;       // může obsahovat <br> a <span class="hl">
  lead: string;
  btnPrimaryLabel: string;
  btnPrimaryUrl: string;
  btnSecondaryLabel?: string;
  btnSecondaryUrl?: string;
  showAppBadges?: boolean;
}

export interface Product {
  name: string;
  category: string;
  price: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  shopUrl?: string;
}

export interface HowStep {
  number: string;
  title: string;
  description: string;
}

export interface SegmentDevice {
  icon: string;
  name: string;
}

export interface SegmentFloor {
  name: string;
  devices: SegmentDevice[];
}

export interface Segment {
  id: string;
  name: string;
  iconUrl: string;
  shortDesc: string;
  headline: string;
  description: string;
  features: string[];
  tags: string[];
  floors: SegmentFloor[];
  quote: string;
}

export interface PmsPartner {
  name: string;
  vendor: string;
  logoUrl?: string;
  isCustom?: boolean;
}

export interface RezeFeatBullet {
  text: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  type: string;
  emoji: string;
  who: string;
  whoRole: string;
  headline: string;
  description: string;
  metrics: CaseStudyMetric[];
  quote: string;
}

export interface Review {
  stars: number;
  text: string;
  authorName: string;
  authorInitials: string;
  source: string;
  badge?: 'heureka' | 'google';
}

export interface Article {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
  portalUrl: string;
}

export interface HomePageData {
  metaTitle: string;
  metaDescription: string;
  heroSlides: HeroSlide[];
  howSteps: HowStep[];
  products: Product[];
  segments: Segment[];
  pmsPartners: PmsPartner[];
  rezeYoutubeId: string;
  rezeFeatHeadline: string;
  rezeFeatText: string;
  rezeBullets: RezeFeatBullet[];
  caseStudies: CaseStudy[];
  reviews: Review[];
  articles: Article[];
  faqItems: FaqItem[];
  contact: ContactInfo;
}
