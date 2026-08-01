import { Card } from '@/components/ui/Card';
import { STAT_TYPES, StatOutcome, StatCategory, StatSelections } from '@/features/stats/types';
import { Zap, TriangleAlert, TrendingUp, CircleAlert, Target, LucideIcon } from 'lucide-react';

const STAT_ICONS: Record<string, LucideIcon> = {
  'unforced-errors': TriangleAlert,
  winners: Zap,
  'break-points-won': TrendingUp,
  'double-faults': CircleAlert,
  'first-serve': Target,
};

interface QuickStatButtonsProps {
  selections: StatSelections;
  onToggle: (statTypeId: string, outcome: StatOutcome, category: StatCategory) => void;
  disabled: boolean;
}

interface ButtonDef {
  key: string;
  statTypeId: string;
  outcome: StatOutcome;
  label: string;
  variant: 'default' | 'positive' | 'negative';
  category: StatCategory;
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
        category: statType.category,
      });
    } else {
      buttons.push({
        key: `${statType.id}-in`,
        statTypeId: statType.id,
        outcome: 'in',
        label: 'First Serve In',
        variant: 'positive',
        category: statType.category,
      });
      buttons.push({
        key: `${statType.id}-out`,
        statTypeId: statType.id,
        outcome: 'out',
        label: 'First Serve Out',
        variant: 'negative',
        category: statType.category,
      });
    }
  }
  return buttons;
}

export function QuickStatButtons({ selections, onToggle, disabled }: QuickStatButtonsProps) {
  const buttons = buildButtons();

  return (
    <Card>
      <p className="text-xs text-stone-500 mb-3">
        Tap to select, tap again to remove — saved when you log the point.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((button) => {
          const Icon = STAT_ICONS[button.statTypeId] ?? Target;
          const selectedForCategory = selections[button.category];
          const isSelected =
            selectedForCategory?.statTypeId === button.statTypeId &&
            selectedForCategory?.outcome === button.outcome;

          const baseStyle =
            button.variant === 'negative'
              ? 'border-red-200 text-red-700 hover:bg-red-700 hover:text-white'
              : 'border-stone-200 text-stone-700 hover:bg-royal-light hover:text-white';

          const selectedStyle =
            button.variant === 'negative'
              ? 'bg-red-700 text-white border-red-700'
              : 'bg-royal-light text-white border-royal-light';

          return (
            <button
              key={button.key}
              disabled={disabled}
              onClick={() => onToggle(button.statTypeId, button.outcome, button.category)}
              className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-xs font-medium disabled:opacity-40 ${
                isSelected ? selectedStyle : baseStyle
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