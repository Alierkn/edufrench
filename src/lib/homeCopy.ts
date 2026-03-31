export type HomePageCopy = {
  badge: string;
  headlineLine1: string;
  headlineAccent: string;
  subhead: string;
  ctaLabel: string;
  ctaHref: string;
};

const DEFAULT_HOME: HomePageCopy = {
  badge: "Fransız Liselerine Özel",
  headlineLine1: "MAÎTRISEZ",
  headlineAccent: "LE FRANÇAIS.",
  subhead:
    "Saint Joseph, Saint Benoît ve NDS gibi okulların akademik ritmine ayak uydurmanız için tasarlanmış **ilk ve tek Neo-Brutalist** eğitim motoru.",
  ctaLabel: "Sistemi Deneyimle",
  ctaHref: "/login",
};

type AppCopyDoc = {
  homeBadge?: string | null;
  homeHeadlineLine1?: string | null;
  homeHeadlineAccent?: string | null;
  homeSubhead?: string | null;
  homeCtaLabel?: string | null;
  homeCtaHref?: string | null;
} | null;

export function buildHomeCopy(doc: AppCopyDoc): HomePageCopy {
  if (!doc) return DEFAULT_HOME;
  return {
    badge: doc.homeBadge?.trim() || DEFAULT_HOME.badge,
    headlineLine1: doc.homeHeadlineLine1?.trim() || DEFAULT_HOME.headlineLine1,
    headlineAccent: doc.homeHeadlineAccent?.trim() || DEFAULT_HOME.headlineAccent,
    subhead: doc.homeSubhead?.trim() || DEFAULT_HOME.subhead,
    ctaLabel: doc.homeCtaLabel?.trim() || DEFAULT_HOME.ctaLabel,
    ctaHref: doc.homeCtaHref?.trim() || DEFAULT_HOME.ctaHref,
  };
}
