import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    session({ session, token }) {
      return { ...session, accessToken: token.accessToken };
    },
  },
});
