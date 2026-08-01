import { render, screen, fireEvent } from '@testing-library/react';
import { QuickStatButtons } from './QuickStatButtons';

describe('QuickStatButtons', () => {
  it('logs a count-type stat with outcome "occurred" on click', () => {
    const onLogStat = jest.fn();
    render(<QuickStatButtons onLogStat={onLogStat} disabled={false} />);

    fireEvent.click(screen.getByText('Winners'));

    expect(onLogStat).toHaveBeenCalledWith('winners', 'occurred');
  });

  it('logs the correct outcome for each First Serve button', () => {
    const onLogStat = jest.fn();
    render(<QuickStatButtons onLogStat={onLogStat} disabled={false} />);

    fireEvent.click(screen.getByText('First Serve In'));
    fireEvent.click(screen.getByText('First Serve Out'));

    expect(onLogStat).toHaveBeenCalledWith('first-serve', 'in');
    expect(onLogStat).toHaveBeenCalledWith('first-serve', 'out');
  });

  it('disables all buttons when disabled is true', () => {
    render(<QuickStatButtons onLogStat={jest.fn()} disabled={true} />);

    expect(screen.getByText('Winners').closest('button')).toBeDisabled();
  });
});