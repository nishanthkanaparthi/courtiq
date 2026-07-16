import { render, screen, fireEvent } from '@testing-library/react';
import { MatchPointHistory } from './MatchPointHistory';
import { createSet } from '@/features/matches/types';

describe('MatchPointHistory', () => {
  it('does not show points until a game is expanded', () => {
    const set = createSet(1);
    render(<MatchPointHistory sets={[set]} />);

    expect(screen.queryByText(/Point 1:/)).not.toBeInTheDocument();
  });

  it('shows points after clicking a game to expand it', () => {
    const set = createSet(1);
    set.games[0].points = [
      { id: 'p1', pointNumber: 1, winner: 'player', timestamp: new Date().toISOString() },
    ];
    render(<MatchPointHistory sets={[set]} />);

    fireEvent.click(screen.getByText(/Game 1/));

    expect(screen.getByText('Point 1: You')).toBeInTheDocument();
  });
});