export default function Loading() {
  return (
    <main className="empty-state" aria-live="polite" aria-busy="true">
      <p className="eyebrow">dailyship.xyz</p>
      <h1>Loading today&apos;s ship…</h1>
      <p>Fetching the latest entry and preparing the interface.</p>
    </main>
  );
}
