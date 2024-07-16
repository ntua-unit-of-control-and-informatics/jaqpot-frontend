import { Session } from 'next-auth';

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user;
}
