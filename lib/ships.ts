export type ShipEntry = {
  date: string;
  slug: string;
  title: string;
  projectUrl: string;
  githubUrl?: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  author: string;
  tags: string[];
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const rawEntries: ShipEntry[] = [
  {
    date: "2026-02-27",
    slug: "infinite-escape",
    title: "Infinite Escape",
    projectUrl: "https://infiniteescape.xyz/",
    githubUrl: "https://github.com/devincimaker/infinite-escape",
    description: "Single-player procedural escape room prototype.",
    image: {
      src: "/ships/infiniteescape.png",
      alt: "Screenshot of Infinite Escape project",
    },
    author: "@devinci",
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
      src: "/ships/daio.png",
      alt: "Screenshot of daio.md project",
    },
    author: "@devinci",
    tags: ["agents", "coordination"],
  },
];

const sortedEntries = [...rawEntries].sort(
  (a, b) => parseShipDate(b.date) - parseShipDate(a.date),
);

function parseShipDate(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export function getAllShips(): ShipEntry[] {
  return sortedEntries;
}

export function getShipBySlug(slug: string): ShipEntry | null {
  return sortedEntries.find((entry) => entry.slug === slug) ?? null;
}

export function getLatestShip(): ShipEntry | null {
  return sortedEntries[0] ?? null;
}

export function formatShipDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function getCurrentStreak(): number {
  if (!sortedEntries.length) {
    return 0;
  }

  let streak = 1;

  for (let index = 1; index < sortedEntries.length; index += 1) {
    const previous = parseShipDate(sortedEntries[index - 1].date);
    const current = parseShipDate(sortedEntries[index].date);
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
  const currentIndex = sortedEntries.findIndex((entry) => entry.slug === slug);

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
