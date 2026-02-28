import { redirect } from "next/navigation";
import { getAllShips } from "@/lib/ships";

export const dynamic = "force-dynamic";

export default function RandomShipPage() {
  const ships = getAllShips();

  if (!ships.length) {
    redirect("/");
  }

  const randomShip = ships[Math.floor(Math.random() * ships.length)];
  redirect(`/ship/${randomShip.slug}`);
}
