import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Match, formatFinalScore } from '@/features/matches/types';

function resultLabel(match: Match): string {
  if (match.status === 'abandoned') return 'Abandoned';
  if (match.winner === 'player') return 'Win';
  if (match.winner === 'opponent') return 'Loss';
  return 'In Progress';
}

export function MatchListItem({ match }: { match: Match }) {
  const date = new Date(match.startedAt).toLocaleDateString();
  const result = resultLabel(match);

  return (
    <Link href={`/history/${match.id}`}>
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-royal">vs {match.opponentName}</p>
            <p className="text-xs text-stone-500">{date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-700">{formatFinalScore(match)}</p>
            <p
              className={`text-xs font-medium ${
                result === 'Win'
                  ? 'text-royal-light'
                  : result === 'Loss'
                    ? 'text-red-700'
                    : 'text-stone-500'
              }`}
            >
              {result}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}