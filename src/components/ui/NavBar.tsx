import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="text-emerald-900 font-semibold tracking-tight">
          CourtIQ
        </Link>
        <Link href="/match/live" className="text-sm text-stone-600 hover:text-emerald-800">
          Live Match
        </Link>
        <span className="text-sm text-stone-300">History</span>
        <span className="text-sm text-stone-300">Players</span>
      </div>
    </nav>
  );
}