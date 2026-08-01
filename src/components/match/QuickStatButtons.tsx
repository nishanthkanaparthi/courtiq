'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { STAT_TYPES, StatOutcome } from '@/features/stats/types';
import { Zap, TriangleAlert, TrendingUp, CircleAlert, Target, LucideIcon } from 'lucide-react';

const STAT_ICONS: Record<string, LucideIcon> = {
  'unforced-errors': TriangleAlert,
  winners: Zap,
  'break-points-won': TrendingUp,
  'double-faults': CircleAlert,
  'first-serve': Target,
};

interface QuickStatButtonsProps {
  onLogStat: (statTypeId: string, outcome: StatOutcome) => void;
  disabled: boolean;
}

interface ButtonDef {
  key: string;
  statTypeId: string;
  outcome: StatOutcome;
  label: string;
  variant: 'default' | 'positive' | 'negative';
}

function buildButtons(): ButtonDef[] {
  const buttons: ButtonDef[] = [];
  for (const statType of STAT_TYPES) {
    if (statType.unit === 'count') {
      buttons.push({
        key: `${statType.id}-occurred`,
        statTypeId: statType.id,
        outcome: 'occurred',
        label: statType.label,
        variant: 'default',
      });
    } else {
      buttons.push({
        key: `${statType.id}-in`,
        statTypeId: statType.id,
        outcome: 'in',
        label: 'First Serve In',
        variant: 'positive',
      });
      buttons.push({
        key: `${statType.id}-out`,
        statTypeId: statType.id,
        outcome: 'out',
        label: 'First Serve Out',
        variant: 'negative',
      });
    }
  }
  return buttons;
}

export function QuickStatButtons({ onLogStat, disabled }: QuickStatButtonsProps) {
  const [justLogged, setJustLogged] = useState<string | null>(null);
  const buttons = buildButtons();

  function handleClick(button: ButtonDef) {
    onLogStat(button.statTypeId, button.outcome);
    setJustLogged(button.key);
    setTimeout(() => setJustLogged(null), 500);
  }

  return (
    <Card>
      <p className="text-xs text-stone-500 mb-3">Log a stat</p>
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((button) => {
          const Icon = STAT_ICONS[button.statTypeId] ?? Target;
          const isFlashing = justLogged === button.key;

          const baseStyle =
            button.variant === 'negative'
              ? 'border-red-200 text-red-700 hover:bg-red-700 hover:text-white'
              : 'border-stone-200 text-stone-700 hover:bg-royal-light hover:text-white';

          return (
            <button
              key={button.key}
              disabled={disabled}
              onClick={() => handleClick(button)}
              className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-xs font-medium disabled:opacity-40 ${baseStyle} ${
                isFlashing ? 'ring-2 ring-royal-light' : ''
              }`}
            >
              <Icon size={16} />
              {button.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}