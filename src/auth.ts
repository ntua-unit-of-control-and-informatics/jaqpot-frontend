import NextAuth, { DefaultSession } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { DefaultJWT } from '@auth/core/jwt';

declare module 'next-auth' {
  // Extend user to reveal access_token
  interface User {
    access_token: string | null;
  }

  // Extend session to hold the access_token
  interface Session {
    token: (string & DefaultSession) | any;
  }

  // Extend token to hold the access_token before it gets put into session
  interface JWT {
    access_token: string & DefaultJWT;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && account.access_token) {
        // set access_token to the token payload
        token.accessToken = account.access_token;
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      // If we want to make the accessToken available in components, then we have to explicitly forward it here.
      return { ...session, token: token.accessToken };
    },
  },
});
