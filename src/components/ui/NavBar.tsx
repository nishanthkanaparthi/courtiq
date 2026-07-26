import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="text-royal font-semibold tracking-tight">
          CourtIQ
        </Link>
        <Link href="/match/live" className="text-sm text-stone-600 hover:text-royal">
          Live Match
        </Link>
        <Link href="/history" className="text-sm text-stone-600 hover:text-royal">
          History
        </Link>
        <Link href="/analytics" className="text-sm text-stone-600 hover:text-royal">
          Analytics
        </Link>
      </div>
    </nav>
  );
}