export type ShipEntry = {
  date: string;
  slug: string;
  title: string;
  projectUrl?: string;
  githubUrl?: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  author: string;
  tags: string[];
};

type RawShipEntry = Partial<Omit<ShipEntry, "image">> & {
  image?: Partial<ShipEntry["image"]>;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const VALID_ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_TITLE = "Untitled ship";
const DEFAULT_DESCRIPTION = "No description has been added yet.";
const DEFAULT_AUTHOR = "@unknown";
const DEFAULT_IMAGE_SRC = "/ships/site-preview.png";
const DEFAULT_IMAGE_ALT = "Project preview is unavailable";
const DEFAULT_TAG = "uncategorized";

const rawEntries: RawShipEntry[] = [
  {
    date: "2026-02-28",
    slug: "dailyship-xyz",
    title: "Daily Ship",
    projectUrl: "https://dailyship.xyz/",
    githubUrl: "https://github.com/devincimaker/daily-ship",
    description:
      "The site itself: a daily log of shipped work, published as a living landing page.",
    image: {
      src: "/ships/dailyship-20260228.png",
      alt: "Homepage screenshot of Daily Ship",
    },
    author: "@devi_maker",
    tags: ["meta", "portfolio", "journal"],
  },
  {
    date: "2026-02-27",
    slug: "infinite-escape",
    title: "Infinite Escape",
    projectUrl: "https://infiniteescape.xyz/",
    githubUrl: "https://github.com/devincimaker/infinite-escape",
    description: "Single-player procedural escape room prototype.",
    image: {
      src: "/ships/infiniteescape-20260228.jpg",
      alt: "Screenshot of Infinite Escape project",
    },
    author: "@devi_maker",
    tags: ["game", "prototype"],
  },
  {
    date: "2026-02-26",
    slug: "daio-md",
    title: "daio.md",
    projectUrl: "https://daio.md/",
    description:
      "A DAO-of-agents concept site exploring collective coordination patterns.",
    image: {
      src: "/ships/daio-20260228.jpg",
      alt: "Screenshot of daio.md project",
    },
    author: "@devi_maker",
    tags: ["agents", "coordination"],
  },
];

const sortedEntries = normalizeEntries(rawEntries);

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeText(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = normalizeWhitespace(value);

  if (!normalized) {
    return fallback;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(maxLength - 1, 1)).trimEnd()}…`;
}

function sanitizeSlug(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getUniqueSlug(baseSlug: string, index: number, seen: Set<string>): string {
  const seed = baseSlug || `ship-${index + 1}`;
  let candidate = seed;
  let suffix = 2;

  while (seen.has(candidate)) {
    candidate = `${seed}-${suffix}`;
    suffix += 1;
  }

  seen.add(candidate);
  return candidate;
}

function sanitizeDate(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const candidate = value.trim();

  if (!VALID_ISO_DATE_PATTERN.test(candidate)) {
    return null;
  }

  const parsed = parseShipDate(candidate);
  return Number.isNaN(parsed) ? null : candidate;
}

function sanitizeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  try {
    const parsed = new URL(value);
    const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
    return isHttp ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

function sanitizeImageSrc(value: unknown): string {
  if (typeof value !== "string") {
    return DEFAULT_IMAGE_SRC;
  }

  const candidate = value.trim();

  if (!candidate) {
    return DEFAULT_IMAGE_SRC;
  }

  if (candidate.startsWith("/")) {
    return candidate;
  }

  return sanitizeExternalUrl(candidate) ?? DEFAULT_IMAGE_SRC;
}

function sanitizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => sanitizeText(tag, "", 32).toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeEntries(entries: RawShipEntry[]): ShipEntry[] {
  const seenSlugs = new Set<string>();

  const normalized = entries
    .map((entry, index): ShipEntry | null => {
      const date = sanitizeDate(entry.date);

      if (!date) {
        return null;
      }

      const slug = getUniqueSlug(sanitizeSlug(entry.slug), index, seenSlugs);
      const tags = sanitizeTags(entry.tags);

      return {
        date,
        slug,
        title: sanitizeText(entry.title, DEFAULT_TITLE, 120),
        description: sanitizeText(entry.description, DEFAULT_DESCRIPTION, 600),
        projectUrl: sanitizeExternalUrl(entry.projectUrl),
        githubUrl: sanitizeExternalUrl(entry.githubUrl),
        image: {
          src: sanitizeImageSrc(entry.image?.src),
          alt: sanitizeText(entry.image?.alt, DEFAULT_IMAGE_ALT, 180),
        },
        author: sanitizeText(entry.author, DEFAULT_AUTHOR, 60),
        tags: tags.length ? tags : [DEFAULT_TAG],
      };
    })
    .filter((entry): entry is ShipEntry => entry !== null);

  return normalized.sort((a, b) => parseShipDate(b.date) - parseShipDate(a.date));
}

function parseShipDate(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export function getAllShips(): ShipEntry[] {
  return sortedEntries;
}

export function getShipBySlug(slug: string): ShipEntry | null {
  const normalizedSlug = sanitizeSlug(slug);
  return sortedEntries.find((entry) => entry.slug === normalizedSlug) ?? null;
}

export function getLatestShip(): ShipEntry | null {
  return sortedEntries[0] ?? null;
}

function resolveLocale(locale?: string): string | undefined {
  if (!locale) {
    return undefined;
  }

  try {
    const [canonical] = Intl.getCanonicalLocales(locale);
    return canonical ?? undefined;
  } catch {
    return undefined;
  }
}

function normalizeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

function getPluralCategory(value: number, locale?: string): Intl.LDMLPluralRule {
  return new Intl.PluralRules(resolveLocale(locale)).select(value);
}

export function formatShipDate(date: string, locale?: string): string {
  const parsed = parseShipDate(date);

  if (Number.isNaN(parsed)) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(resolveLocale(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(parsed));
}

export function formatInteger(value: number, locale?: string): string {
  return new Intl.NumberFormat(resolveLocale(locale)).format(normalizeCount(value));
}

export function formatStreakLabel(days: number, locale?: string): string {
  const safeDays = normalizeCount(days);
  const suffix = getPluralCategory(safeDays, locale) === "one" ? "day" : "days";
  return `${formatInteger(safeDays, locale)} ${suffix}`;
}

export function formatShipCountLabel(totalShips: number, locale?: string): string {
  const safeTotal = normalizeCount(totalShips);
  const noun = getPluralCategory(safeTotal, locale) === "one" ? "ship" : "ships";
  return `${formatInteger(safeTotal, locale)} ${noun} logged`;
}

export function getCurrentStreak(): number {
  if (!sortedEntries.length) {
    return 0;
  }

  const uniqueDateKeys = Array.from(new Set(sortedEntries.map((entry) => entry.date)));

  if (!uniqueDateKeys.length) {
    return 0;
  }

  let streak = 1;

  for (let index = 1; index < uniqueDateKeys.length; index += 1) {
    const previous = parseShipDate(uniqueDateKeys[index - 1]);
    const current = parseShipDate(uniqueDateKeys[index]);
    const differenceInDays = (previous - current) / DAY_IN_MS;

    if (differenceInDays === 1) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}

export function getShipContext(slug: string): {
  current: ShipEntry;
  older: ShipEntry | null;
  newer: ShipEntry | null;
  total: number;
} | null {
  const normalizedSlug = sanitizeSlug(slug);
  const currentIndex = sortedEntries.findIndex(
    (entry) => entry.slug === normalizedSlug,
  );

  if (currentIndex === -1) {
    return null;
  }

  return {
    current: sortedEntries[currentIndex],
    older: sortedEntries[currentIndex + 1] ?? null,
    newer: sortedEntries[currentIndex - 1] ?? null,
    total: sortedEntries.length,
  };
}
