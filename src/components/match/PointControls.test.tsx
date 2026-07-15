import { render, screen, fireEvent } from '@testing-library/react';
import { PointControls } from './PointControls';

describe('PointControls', () => {
  it('calls onPointWon with "player" when the You button is clicked', () => {
    const onPointWon = jest.fn();
    render(<PointControls onPointWon={onPointWon} disabled={false} />);

    fireEvent.click(screen.getByText('Point: You'));

    expect(onPointWon).toHaveBeenCalledWith('player');
  });

  it('calls onPointWon with "opponent" when the Opponent button is clicked', () => {
    const onPointWon = jest.fn();
    render(<PointControls onPointWon={onPointWon} disabled={false} />);

    fireEvent.click(screen.getByText('Point: Opponent'));

    expect(onPointWon).toHaveBeenCalledWith('opponent');
  });

  it('disables both buttons when disabled is true', () => {
    render(<PointControls onPointWon={jest.fn()} disabled={true} />);

    expect(screen.getByText('Point: You')).toBeDisabled();
    expect(screen.getByText('Point: Opponent')).toBeDisabled();
  });
});