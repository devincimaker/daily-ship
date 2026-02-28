import Link from "next/link";

export default function NotFound() {
  return (
    <main className="empty-state">
      <p className="eyebrow">dailyship</p>
      <h1>Ship not found.</h1>
      <p>The entry may have moved, been renamed, or never existed.</p>
      <Link href="/" className="ship-primary-link">
        Back to latest ship
      </Link>
    </main>
  );
}
