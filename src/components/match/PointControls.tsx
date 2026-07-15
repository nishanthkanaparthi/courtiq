import { Side } from '@/features/matches/types';

interface PointControlsProps {
  onPointWon: (winner: Side) => void;
  disabled: boolean;
}

export function PointControls({ onPointWon, disabled }: PointControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <button
        disabled={disabled}
        onClick={() => onPointWon('player')}
        className="rounded-xl bg-emerald-800 text-white py-2 font-medium disabled:opacity-40"
      >
        Point: You
      </button>
      <button
        disabled={disabled}
        onClick={() => onPointWon('opponent')}
        className="rounded-xl bg-emerald-800 text-white py-2 font-medium disabled:opacity-40"
      >
        Point: Opponent
      </button>
    </div>
  );
}