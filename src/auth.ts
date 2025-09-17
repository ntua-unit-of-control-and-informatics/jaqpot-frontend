import NextAuth, { DefaultSession } from 'next-auth';

import { DefaultJWT } from '@auth/core/jwt';
import { jwtDecode } from 'jwt-decode';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { logger } from '@/logger';

const log = logger.child({ module: 'error' });

declare module 'next-auth' {
  // Extend user to reveal access_token
  interface User {
    access_token: string | null;
    username: string | null;
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
  session: {
    strategy: 'jwt',
    maxAge: 180 * 24 * 60 * 60,
  },
  providers: [
    KeycloakProvider({
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      authorization: {
        params: {
          scope: 'openid profile email offline_access',
        },
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Initial sign in
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        const expiresAt = (account as any).expires_at
          ? (account as any).expires_at * 1000
          : (account as any).expires_in
          ? Date.now() + (account as any).expires_in * 1000
          : undefined;
        if (expiresAt) token.accessTokenExpires = expiresAt;
      }

      // return token;

      // Return previous token if the access token has not expired yet
      const expires = token.accessTokenExpires as number | undefined;
      const hasValidExpiry = typeof expires === 'number';
      const isStillValid = hasValidExpiry && Date.now() < expires - 60_000;
      if (isStillValid) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    session: async ({ session, token, user }) => {
      // Next Auth shenanigans :(

      // add userId from decoding the jwt and the sub value cause the sub was a different id
      let userId: string | undefined = '';
      let username: string | undefined = '';
      if (token?.accessToken) {
        const decodedToken = jwtDecode(token.accessToken as string);
        userId = decodedToken.sub;
        username = (decodedToken as any)['preferred_username'];
      }

      // add user token for backend requests and add user id in the user object to use it in client-side logic
      return {
        ...session,
        token: token.accessToken,
        user: { ...session.user, id: userId, name: username },
      };
    },
  },
});

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.AUTH_KEYCLOAK_ID!,
        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
