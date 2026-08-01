'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlayCircle, History, BarChart3 } from 'lucide-react';
import { PLACEHOLDER_PLAYER_NAME } from '@/features/players/constants';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/match/live', label: 'Live Match', icon: PlayCircle },
  { href: '/history', label: 'History', icon: History },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-royal min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <span className="text-white font-semibold text-lg">CourtIQ</span>
        <span className="w-2 h-2 rounded-full bg-lime-300" />
      </div>

      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                isActive
                  ? 'bg-royal-light text-white font-medium'
                  : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-blue-800 pt-4 flex items-center gap-2 px-2">
        <div className="w-8 h-8 rounded-full bg-royal-light flex items-center justify-center text-white text-xs font-medium">
          {PLACEHOLDER_PLAYER_NAME.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-sm">{PLACEHOLDER_PLAYER_NAME}</p>
          <p className="text-blue-200 text-xs">Coach</p>
        </div>
      </div>
    </aside>
  );
}