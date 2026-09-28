'use client';

import { signIn } from 'next-auth/react';
import type { ReactNode } from 'react';

type GoogleSignInButtonProps = {
  className?: string;
  children: ReactNode;
};

export function GoogleSignInButton({ className, children }: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      className={`cursor-pointer ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
