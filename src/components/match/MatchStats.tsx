import { Card } from '@/components/ui/Card';
import { STAT_TYPES } from '@/features/stats/types';
import { StatSummary } from '@/features/stats/stats-engine';
import { Target, TriangleAlert, Zap, TrendingUp, CircleAlert, LucideIcon } from 'lucide-react';

const STAT_ICONS: Record<string, LucideIcon> = {
  'first-serve': Target,
  'unforced-errors': TriangleAlert,
  winners: Zap,
  'break-points-won': TrendingUp,
  'double-faults': CircleAlert,
};

export function MatchStats({ summaries }: { summaries: StatSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {summaries.map((summary) => {
        const statType = STAT_TYPES.find((s) => s.id === summary.statTypeId);
        if (!statType) return null;
        const Icon = STAT_ICONS[statType.id] ?? Target;

        return (
          <Card key={summary.statTypeId}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className="text-royal-light" />
              <span className="text-xs text-stone-500">{statType.label}</span>
            </div>

            {summary.unit === 'count' ? (
              <p className="text-2xl font-semibold text-royal">{summary.total}</p>
            ) : summary.percentage === null ? (
              <p className="text-sm text-stone-400">No data</p>
            ) : (
              <div>
                <p className="text-2xl font-semibold text-royal mb-1">
                  {summary.percentage}%
                </p>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-royal-light"
                    style={{ width: `${summary.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}