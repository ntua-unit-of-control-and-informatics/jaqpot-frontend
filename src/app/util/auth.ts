import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { SessionContextValue } from 'next-auth/react';

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}

/**
 * use client session, to retrieve the session data but remove the token so it's not visible on the client
 */
export const useClientSession = (): SessionContextValue => {
  const session = useSession();
  delete session.data?.token;
  return session;
};
