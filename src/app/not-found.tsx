import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container empty-state">
      <span className="eyebrow">404 · NUVECTO</span>
      <h1>This path is still being built.</h1>
      <p>Ta ścieżka jeszcze nie istnieje.</p>
      <div className="completion-actions">
        <Link className="button primary" href="/en/">
          Back to learning
        </Link>
        <Link className="button secondary" href="/pl/">
          Wróć do nauki
        </Link>
      </div>
    </main>
  );
}
