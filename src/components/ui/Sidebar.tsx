'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlayCircle, History, BarChart3 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/match/live', label: 'Live Match', icon: PlayCircle },
  { href: '/history', label: 'History', icon: History },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === '/' || pathname === '/signin') {
    return null;
  }

  const coachName = session?.user?.name ?? 'Coach';
  const initials = coachName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="w-56 shrink-0 bg-royal min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <span className="text-white font-semibold text-lg">CourtIQ</span>
        <span className="w-2 h-2 rounded-full bg-lime-300" />
      </div>

      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
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

      <div className="border-t border-blue-800 pt-4 px-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-royal-light flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <div>
            <p className="text-white text-sm">{coachName}</p>
            <p className="text-blue-200 text-xs">Coach</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs text-blue-200 hover:text-white underline"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
