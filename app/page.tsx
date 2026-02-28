import { DailyShipView } from "@/components/daily-ship-view";
import { getCurrentStreak, getLatestShip, getShipContext } from "@/lib/ships";

export default function Home() {
  const latestShip = getLatestShip();

  if (!latestShip) {
    return (
      <main className="empty-state">
        <p className="eyebrow">dailyship.xyz</p>
        <h1>Start shipping.</h1>
        <p>Add your first entry in `lib/ships.ts` to bring the site to life.</p>
      </main>
    );
  }

  const context = getShipContext(latestShip.slug);

  if (!context) {
    return (
      <main className="empty-state">
        <h1>Couldn&apos;t load your latest ship.</h1>
      </main>
    );
  }

  return (
    <DailyShipView
      current={context.current}
      older={context.older}
      newer={context.newer}
      streak={getCurrentStreak()}
      totalShips={context.total}
    />
  );
}
