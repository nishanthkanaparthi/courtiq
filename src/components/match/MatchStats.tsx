import { Card } from '@/components/ui/Card';
import { STAT_TYPES } from '@/features/stats/types';
import { StatSummary } from '@/features/stats/stats-engine';

export function MatchStats({ summaries }: { summaries: StatSummary[] }) {
  return (
    <Card>
      <div className="space-y-3">
        {summaries.map((summary) => {
          const statType = STAT_TYPES.find((s) => s.id === summary.statTypeId);
          if (!statType) return null;

          return (
            <div key={summary.statTypeId} className="flex justify-between items-center">
              <span className="text-sm text-stone-600">{statType.label}</span>
              {summary.unit === 'count' ? (
                <span className="text-sm font-medium text-emerald-900">{summary.total}</span>
              ) : (
                <span className="text-sm font-medium text-emerald-900">
                  {summary.percentage === null ? 'No data' : `${summary.percentage}%`}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}