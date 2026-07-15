import { render, screen } from '@testing-library/react';
import { Scoreboard } from './Scoreboard';
import { createMatch } from '@/features/matches/types';

describe('Scoreboard', () => {
  it('shows 0-0 for a freshly created match', () => {
    const match = createMatch('player-1', 'Test Opponent');
    render(<Scoreboard match={match} />);

    expect(screen.getByText('vs Test Opponent')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(2);
  });

  it('shows the match winner when the match is completed', () => {
    const match = createMatch('player-1', 'Test Opponent');
    match.status = 'completed';
    match.winner = 'player';

    render(<Scoreboard match={match} />);

    expect(screen.getByText('Match won by you')).toBeInTheDocument();
  });
});