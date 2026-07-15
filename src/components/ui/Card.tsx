import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-stone-200 p-6">
      {children}
    </div>
  );
}