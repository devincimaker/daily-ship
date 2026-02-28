import Link from "next/link";
import {
  formatShipCountLabel,
  formatShipDate,
  formatStreakLabel,
  type ShipEntry,
} from "@/lib/ships";
import { ResilientShipImage } from "@/components/resilient-ship-image";

type DailyShipViewProps = {
  current: ShipEntry;
  older: ShipEntry | null;
  newer: ShipEntry | null;
  streak: number;
  totalShips: number;
  locale?: string;
  direction?: "ltr" | "rtl";
};

type ShipNavButtonProps = {
  href: string | null;
  direction: "left" | "right";
  label: string;
};

type ShipNavigationProps = {
  older: ShipEntry | null;
  newer: ShipEntry | null;
  className?: string;
  ariaLabel: string;
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  if (direction === "left") {
    return (
      <svg viewBox="0 0 20 20" className="ship-arrow-icon" aria-hidden="true">
        <path d="M13.8 3.2L6.2 10l7.6 6.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className="ship-arrow-icon" aria-hidden="true">
      <path d="M6.2 3.2L13.8 10l-7.6 6.8" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.5" y="2.5" width="15" height="15" rx="2.5" />
      <circle cx="6.5" cy="6.5" r="1.2" />
      <circle cx="10" cy="10" r="1.2" />
      <circle cx="13.5" cy="13.5" r="1.2" />
      <circle cx="13.5" cy="6.5" r="1.2" />
      <circle cx="6.5" cy="13.5" r="1.2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0.2a8 8 0 0 0-2.53 15.59c0.4 0.07 0.55-0.17 0.55-0.39 0-0.2-0.01-0.85-0.01-1.53-2.02 0.37-2.54-0.5-2.7-0.95-0.09-0.23-0.48-0.95-0.82-1.14-0.28-0.15-0.68-0.52-0.01-0.53 0.63-0.01 1.08 0.58 1.23 0.82 0.72 1.21 1.86 0.87 2.31 0.66 0.07-0.52 0.28-0.87 0.51-1.07-1.79-0.2-3.67-0.89-3.67-3.95 0-0.87 0.31-1.58 0.82-2.14-0.08-0.2-0.36-1.02 0.08-2.11 0 0 0.67-0.21 2.2 0.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-0.82 2.2-0.82 0.44 1.1 0.16 1.91 0.08 2.11 0.51 0.56 0.82 1.27 0.82 2.14 0 3.07-1.88 3.75-3.67 3.95 0.29 0.25 0.54 0.73 0.54 1.48 0 1.07-0.01 1.93-0.01 2.2 0 0.22 0.15 0.47 0.55 0.39A8 8 0 0 0 8 0.2Z"
      />
    </svg>
  );
}

function ShipNavButton({ href, direction, label }: ShipNavButtonProps) {
  if (!href) {
    return (
      <button
        type="button"
        className="ship-control is-disabled"
        aria-label={`${label} unavailable`}
        aria-disabled="true"
        disabled
      >
        <ArrowIcon direction={direction} />
      </button>
    );
  }

  return (
    <Link href={href} prefetch={false} className="ship-control" aria-label={label}>
      <ArrowIcon direction={direction} />
    </Link>
  );
}

function ShipNavigation({ older, newer, className, ariaLabel }: ShipNavigationProps) {
  return (
    <nav className={className ?? "ship-controls"} aria-label={ariaLabel}>
      <ShipNavButton
        href={older ? `/ship/${older.slug}` : null}
        direction="left"
        label="Go to previous day"
      />
      <Link
        href="/random"
        prefetch={false}
        className="ship-control ship-control-random"
        aria-label="Open a random ship"
      >
        <DiceIcon />
      </Link>
      <ShipNavButton
        href={newer ? `/ship/${newer.slug}` : null}
        direction="right"
        label="Go to next day"
      />
    </nav>
  );
}

export function DailyShipView({
  current,
  older,
  newer,
  streak,
  totalShips,
  locale,
  direction = "ltr",
}: DailyShipViewProps) {
  return (
    <main className="daily-ship" dir={direction}>
      <section className="ship-layout">
        <header className="ship-header reveal delay-0">
          <p className="eyebrow">dailyship</p>
          <h1>One thing shipped every day.</h1>
          <p className="subhead">
            Hi, I&apos;m Devi and I like to create. Here&apos;s a public log of my
            daily experiments.
          </p>
        </header>

        <p className="streak-pill reveal delay-1">
          <span>Current streak</span>
          <strong>{formatStreakLabel(streak, locale)}</strong>
        </p>

        <ShipNavigation
          older={older}
          newer={newer}
          className="ship-controls reveal delay-2"
          ariaLabel="Top ship navigation"
        />

        <article className="ship-panel reveal delay-2">
          <div className="ship-media">
            <ResilientShipImage
              src={current.image.src}
              alt={current.image.alt}
              priority
              className="ship-image"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          <div className="ship-content">
            <time className="ship-date" dateTime={current.date}>
              {formatShipDate(current.date, locale)}
            </time>
            <h2 dir="auto">{current.title}</h2>
            <p dir="auto">{current.description}</p>
            <div className="ship-links">
              {current.projectUrl ? (
                <a
                  href={current.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ship-primary-link"
                  aria-label={`Visit ${current.title} project (opens in a new tab)`}
                >
                  Visit project
                </a>
              ) : (
                <button
                  type="button"
                  className="ship-primary-link is-disabled"
                  aria-label="Project link unavailable"
                  disabled
                  aria-disabled="true"
                >
                  Project unavailable
                </button>
              )}
              {current.githubUrl ? (
                <a
                  href={current.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ship-github-link"
                  aria-label="Open GitHub repository"
                  title="Open GitHub repository"
                >
                  <GitHubIcon />
                </a>
              ) : null}
            </div>
          </div>
        </article>

        <ShipNavigation
          older={older}
          newer={newer}
          className="ship-controls reveal delay-3"
          ariaLabel="Bottom ship navigation"
        />

        <footer className="ship-meta reveal delay-4" aria-label="Ship metadata">
          <span dir="auto">{current.author}</span>
          <span>{formatShipCountLabel(totalShips, locale)}</span>
        </footer>
      </section>
    </main>
  );
}
