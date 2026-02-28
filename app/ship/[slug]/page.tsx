import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DailyShipView } from "@/components/daily-ship-view";
import { resolveDirection, resolveLocale } from "@/lib/i18n";
import {
  getAllShips,
  getCurrentStreak,
  getShipBySlug,
  getShipContext,
} from "@/lib/ships";

type ShipPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    locale?: string;
    dir?: string;
  }>;
};

export function generateStaticParams() {
  return getAllShips().map((ship) => ({
    slug: ship.slug,
  }));
}

export async function generateMetadata({
  params,
}: ShipPageProps): Promise<Metadata> {
  const { slug } = await params;
  const ship = getShipBySlug(slug);

  if (!ship) {
    return {
      title: "Ship Not Found",
    };
  }

  return {
    title: ship.title,
    description: ship.description,
  };
}

export default async function ShipPage({ params, searchParams }: ShipPageProps) {
  const query = await searchParams;
  const locale = resolveLocale(query.locale);
  const direction = resolveDirection(query.dir, locale);
  const { slug } = await params;
  const context = getShipContext(slug);

  if (!context) {
    notFound();
  }

  return (
    <DailyShipView
      current={context.current}
      older={context.older}
      newer={context.newer}
      streak={getCurrentStreak()}
      totalShips={context.total}
      locale={locale}
      direction={direction}
    />
  );
}
