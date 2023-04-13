import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'driver';
      return token;
    },
  },
};

export default NextAuth(authOptions);
