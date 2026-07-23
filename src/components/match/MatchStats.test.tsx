import { render, screen } from '@testing-library/react';
import { MatchStats } from './MatchStats';
import { StatSummary } from '@/features/stats/stats-engine';

describe('MatchStats', () => {
  it('shows the total for a count-type stat', () => {
    const summaries: StatSummary[] = [
      { unit: 'count', statTypeId: 'winners', total: 5 },
    ];

    render(<MatchStats summaries={summaries} />);

    expect(screen.getByText('Winners')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows the percentage for a percentage-type stat with data', () => {
    const summaries: StatSummary[] = [
      { unit: 'percentage', statTypeId: 'first-serve', inCount: 3, outCount: 1, percentage: 75 },
    ];

    render(<MatchStats summaries={summaries} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows "No data" for a percentage-type stat with no entries', () => {
    const summaries: StatSummary[] = [
      { unit: 'percentage', statTypeId: 'first-serve', inCount: 0, outCount: 0, percentage: null },
    ];

    render(<MatchStats summaries={summaries} />);

    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});