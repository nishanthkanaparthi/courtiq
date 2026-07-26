import type { Metadata } from 'next';
import { NavBar } from '@/components/ui/NavBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'CourtIQ',
  description: 'Tennis analytics for coaches — live scoring, history, and performance insight.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen text-stone-900">
        <NavBar />
        <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}