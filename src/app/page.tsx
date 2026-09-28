import { ArrowRight, PlayCircle, LayoutDashboard, History, BarChart3, TrendingUp, FileText, Lock } from 'lucide-react';
import { GoogleSignInButton } from '@/components/ui/GoogleSignInButton';

export default function LandingPage() {
  return (
    <div className="-mx-8 -my-8">
      <section className="relative min-h-screen flex flex-col bg-royal overflow-hidden">
        <svg
          className="absolute top-0 right-0 h-full w-2/3 pointer-events-none"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMaxYMin slice"
        >
          <circle cx="750" cy="50" r="420" fill="#84cc16" opacity="0.35" />
          <circle cx="650" cy="150" r="320" fill="#4d7c0f" opacity="0.4" />
        </svg>

        <nav className="relative w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white">CourtIQ</span>
              <span className="w-2 h-2 rounded-full bg-lime-300" />
            </div>
            <span className="hidden md:block h-5 w-px bg-white/20" />
            <span className="hidden md:block text-sm text-blue-200">Tennis analytics for coaches</span>
          </div>
          <GoogleSignInButton className="rounded-lg bg-royal-light text-white px-5 py-2.5 font-medium hover:bg-blue-600">Get Started</GoogleSignInButton>
        </nav>

        <div className="relative flex-1 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-200 mb-5">
                TRACK. ANALYZE. IMPROVE.
              </p>
              <h1 className="text-5xl lg:text-6xl font-semibold text-white leading-tight mb-5">
                Make Every Match <span className="text-lime-300">Count</span>.
              </h1>
              <p className="text-lg text-blue-100 mb-9 max-w-md">
                A simple and powerful platform for tennis coaches to record matches, analyze performance, and support player development.
              </p>
              <GoogleSignInButton className="inline-flex items-center gap-2 rounded-xl bg-royal-light text-white font-medium px-7 py-3.5 hover:bg-blue-600">
                Get Started
                <ArrowRight size={16} />
              </GoogleSignInButton>
              <div className="flex items-center gap-2 mt-5 text-sm text-blue-200">
                <Lock size={16} className="shrink-0 text-lime-300" />
                <p>New or returning? Sign in with Google. Your matches stay private to you.</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 flex bg-royal">
              <div className="w-36 bg-royal p-3 space-y-1 border-r border-white/10">
                <div className="flex items-center gap-1 px-1 pb-3">
                  <span className="text-white text-sm font-semibold">CourtIQ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-300" />
                </div>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-royal-light text-white text-xs">
                  <LayoutDashboard size={13} />
                  Dashboard
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-blue-200 text-xs">
                  <PlayCircle size={13} />
                  Live Match
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-blue-200 text-xs">
                  <History size={13} />
                  History
                </div>
                <div className="flex items-center gap-2 px-2 py-2 text-blue-200 text-xs">
                  <BarChart3 size={13} />
                  Analytics
                </div>
              </div>
              <div className="flex-1 bg-white p-5">
                <p className="text-base font-semibold text-royal mb-4">Welcome back, Coach</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-[10px] text-stone-500">Matches Played</p>
                    <p className="text-xl font-semibold text-royal">24</p>
                  </div>
                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-[10px] text-stone-500">Win Rate</p>
                    <p className="text-xl font-semibold text-royal">76%</p>
                  </div>
                  <div className="bg-cream rounded-lg p-3">
                    <p className="text-[10px] text-stone-500">Streak</p>
                    <p className="text-xl font-semibold text-royal">5</p>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-stone-600 mb-2">Recent Matches</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-cream rounded-lg px-3 py-2">
                    <span className="text-[11px] text-royal">vs. J. Smith</span>
                    <span className="text-[10px] text-blue-600 font-medium">Win</span>
                  </div>
                  <div className="flex justify-between items-center bg-cream rounded-lg px-3 py-2">
                    <span className="text-[11px] text-royal">vs. A. Lee</span>
                    <span className="text-[10px] text-blue-600 font-medium">Win</span>
                  </div>
                  <div className="flex justify-between items-center bg-cream rounded-lg px-3 py-2">
                    <span className="text-[11px] text-royal">vs. M. Chen</span>
                    <span className="text-[10px] text-red-600 font-medium">Loss</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white">
            <div className="flex items-start gap-3">
              <PlayCircle size={20} className="text-blue-200 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Track Matches</p>
                <p className="text-xs text-blue-200">Full point-by-point logging</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 size={20} className="text-blue-200 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Analyze Performance</p>
                <p className="text-xs text-blue-200">Clear, visual insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp size={20} className="text-blue-200 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Monitor Progress</p>
                <p className="text-xs text-blue-200">Long-term player stats</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-blue-200 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Build Better Players</p>
                <p className="text-xs text-blue-200">Data-driven training plans</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
