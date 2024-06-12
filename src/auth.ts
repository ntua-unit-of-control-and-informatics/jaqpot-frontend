import NextAuth, { DefaultSession } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { DefaultJWT } from '@auth/core/jwt';
import { jwtDecode } from 'jwt-decode';
import Keycloak from 'next-auth/providers/keycloak';

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
  providers: [Keycloak],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && account.access_token) {
        // set access_token to the token payload
        token.accessToken = account.access_token;
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      // Next Auth shenanigans :(

      // add userId from decoding the jwt and the sub value cause the sub was a different id
      let userId: string | undefined = '';
      if (token?.accessToken) {
        const decodedToken = jwtDecode(token.accessToken as string);
        userId = decodedToken.sub;
      }

      // add user token for backend requests and add user id in the user object to use it in client-side logic
      return {
        ...session,
        token: token.accessToken,
        user: { ...session.user, id: userId },
      };
    },
  },
});
