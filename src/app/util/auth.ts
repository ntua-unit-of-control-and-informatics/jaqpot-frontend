import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { SessionContextValue } from 'next-auth/react';

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}
