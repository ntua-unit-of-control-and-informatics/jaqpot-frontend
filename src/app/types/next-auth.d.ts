import NextAuth, { DefaultSession } from 'next-auth';
import { DefaultJWT } from '@auth/core/jwt';

declare module 'next-auth' {
  // Extend user to reveal access_token
  interface User {
    access_token: string | null;
  }

  // Extend session to hold the access_token
  interface Session {
    access_token: (string & DefaultSession) | any;
  }

  // Extend token to hold the access_token before it gets put into session
  interface JWT {
    access_token: string & DefaultJWT;
  }
}
