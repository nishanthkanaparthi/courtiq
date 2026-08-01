import { render, screen, fireEvent } from '@testing-library/react';
import { QuickStatButtons } from './QuickStatButtons';

describe('QuickStatButtons', () => {
  it('calls onToggle with the correct statTypeId, outcome, and category', () => {
    const onToggle = jest.fn();
    render(<QuickStatButtons selections={{}} onToggle={onToggle} disabled={false} />);

    fireEvent.click(screen.getByText('Winners'));

    expect(onToggle).toHaveBeenCalledWith('winners', 'occurred', 'point-outcome');
  });

  it('calls onToggle with the right outcome for First Serve In and Out', () => {
    const onToggle = jest.fn();
    render(<QuickStatButtons selections={{}} onToggle={onToggle} disabled={false} />);

    fireEvent.click(screen.getByText('First Serve In'));
    fireEvent.click(screen.getByText('First Serve Out'));

    expect(onToggle).toHaveBeenNthCalledWith(1, 'first-serve', 'in', 'first-serve');
    expect(onToggle).toHaveBeenNthCalledWith(2, 'first-serve', 'out', 'first-serve');
  });

  it('disables all buttons when disabled is true', () => {
    render(<QuickStatButtons selections={{}} onToggle={jest.fn()} disabled={true} />);

    expect(screen.getByText('Winners').closest('button')).toBeDisabled();
  });

  it('highlights the button matching the current selection for its category', () => {
    render(
      <QuickStatButtons
        selections={{ 'point-outcome': { statTypeId: 'winners', outcome: 'occurred' } }}
        onToggle={jest.fn()}
        disabled={false}
      />
    );

    expect(screen.getByText('Winners').closest('button')?.className).toContain(
      'border-royal-light'
    );
  });

  it('does not highlight a sibling in the same category, and keeps it clickable', () => {
    render(
      <QuickStatButtons
        selections={{ 'point-outcome': { statTypeId: 'winners', outcome: 'occurred' } }}
        onToggle={jest.fn()}
        disabled={false}
      />
    );

    const sibling = screen.getByText('Unforced Errors').closest('button')!;
    expect(sibling.className).not.toContain('border-royal-light');
    expect(sibling).not.toBeDisabled();
  });
});