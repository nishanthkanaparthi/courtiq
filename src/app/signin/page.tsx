'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card } from '@/components/ui/Card';

function errorMessage(error: string | null): string | null {
  if (!error) return null;
  if (error === 'OAuthAccountNotLinked') {
    return 'That email is already linked to a different sign-in. Please try again or contact support.';
  }
  return 'Something went wrong signing in. Please try again.';
}

function SignInCard() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const error = errorMessage(searchParams.get('error'));

  async function handleSignIn() {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  }

  return (
    <Card>
      <div className="flex flex-col items-center text-center py-4 px-2 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-royal font-semibold text-2xl">CourtIQ</span>
          <span className="w-2 h-2 rounded-full bg-lime-300" />
        </div>
        <p className="text-sm text-stone-500 mb-8">
          Track every match, one point at a time.
        </p>

        {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full rounded-xl bg-royal-light text-white text-sm font-medium py-2.5 hover:bg-royal disabled:opacity-40"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <SignInCard />
      </Suspense>
    </div>
  );
}