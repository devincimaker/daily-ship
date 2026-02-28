const RTL_LANGUAGE_PREFIXES = new Set([
  "ar",
  "dv",
  "fa",
  "he",
  "ku",
  "ps",
  "ur",
  "yi",
]);

function canonicalizeLocaleTag(tag: string): string | null {
  if (!tag || tag === "*") {
    return null;
  }

  try {
    const [canonical] = Intl.getCanonicalLocales(tag);
    return canonical ?? null;
  } catch {
    return null;
  }
}

function getQualityValue(token: string): number {
  const qualityParam = token
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("q="));

  if (!qualityParam) {
    return 1;
  }

  const parsed = Number.parseFloat(qualityParam.slice(2));

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(0, Math.min(parsed, 1));
}

function parseAcceptLanguage(acceptLanguageHeader: string): string[] {
  return acceptLanguageHeader
    .split(",")
    .map((token, index) => {
      const [tag] = token.trim().split(";");
      return {
        index,
        quality: getQualityValue(token),
        locale: canonicalizeLocaleTag(tag.trim()),
      };
    })
    .filter((candidate): candidate is { index: number; quality: number; locale: string } =>
      Boolean(candidate.locale),
    )
    .sort((a, b) => {
      if (b.quality !== a.quality) {
        return b.quality - a.quality;
      }

      return a.index - b.index;
    })
    .map((candidate) => candidate.locale);
}

function normalizeLanguageTag(tag: string): string | null {
  const trimmed = tag.trim();

  if (!trimmed) {
    return null;
  }

  return canonicalizeLocaleTag(trimmed);
}

export function getPreferredLocale(acceptLanguageHeader?: string | null): string {
  if (!acceptLanguageHeader) {
    return "en-US";
  }

  const localeCandidates = parseAcceptLanguage(acceptLanguageHeader).slice(0, 6);

  if (localeCandidates.length) {
    return localeCandidates[0];
  }

  const fallback = acceptLanguageHeader
    .split(",")
    .map(normalizeLanguageTag)
    .find((locale): locale is string => Boolean(locale));

  return fallback ?? "en-US";
}

export function getDirectionFromLocale(locale: string): "ltr" | "rtl" {
  const [baseLanguage] = locale.toLowerCase().split("-");
  return RTL_LANGUAGE_PREFIXES.has(baseLanguage) ? "rtl" : "ltr";
}

export function resolveLocale(input?: string | null): string {
  if (!input) {
    return "en-US";
  }

  return canonicalizeLocaleTag(input) ?? "en-US";
}

export function resolveDirection(
  input: string | null | undefined,
  locale: string,
): "ltr" | "rtl" {
  if (input === "rtl" || input === "ltr") {
    return input;
  }

  return getDirectionFromLocale(locale);
}
