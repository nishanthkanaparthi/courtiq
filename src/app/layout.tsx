import type { Metadata } from 'next';
import { Sidebar } from '@/components/ui/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'CourtIQ',
  description: 'Tennis analytics for coaches — live scoring, history, and performance insight.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen text-stone-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 px-8 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}