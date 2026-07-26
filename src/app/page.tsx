import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-royal">Welcome to CourtIQ</h1>
        <p className="text-stone-600 mt-1">
          Log live matches, track performance, and review history — all in one place.
        </p>
      </div>

      <Card>
        <h2 className="text-lg font-medium text-royal mb-2">Start a live match</h2>
        <p className="text-sm text-stone-600 mb-4">
          Log points in real time with full tennis scoring.
        </p>
        <Link
          href="/match/live"
          className="inline-block rounded-xl bg-royal-light text-white text-sm font-medium px-4 py-2 hover:bg-royal"
        >
          Go to Live Match
        </Link>
      </Card>
    </div>
  );
}