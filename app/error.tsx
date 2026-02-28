"use client";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <main className="empty-state" role="alert" aria-live="assertive">
      <p className="eyebrow">dailyship</p>
      <h1>Something failed while loading this ship.</h1>
      <p>
        Try again. If this keeps happening, a refresh should recover from temporary
        runtime issues.
      </p>
      <button type="button" className="ship-image-retry" onClick={reset}>
        Try again
      </button>
      {error.digest ? <p>Error ref: {error.digest}</p> : null}
    </main>
  );
}
