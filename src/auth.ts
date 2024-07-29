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
      // Initial sign in
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        if (account.expires_at) {
          token.accessTokenExpires = account.expires_at * 1000;
        }
      }

      // Return previous token if the access token has not expired yet
      if (
        !token.accessTokenExpires ||
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
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
