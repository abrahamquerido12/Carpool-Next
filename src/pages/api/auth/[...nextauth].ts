/* eslint-disable no-unused-vars */

import prisma from '@/lib/prisma';
import * as argon from 'argon2';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

const LOGIN_ERROR = 'Verifica tus credenciales';

export const options = {
  providers: [
    CredentialsProvider({
      id: 'credentials',

      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email Address',
          type: 'email',
          placeholder: 'Your email address',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials, _req) {
        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
        } catch (e) {
          console.log(e);

          throw Error('Error inesperado, intenta más tarde.');
        }

        if (!user) {
          throw new Error(LOGIN_ERROR);
        }
        if (!credentials) {
          throw new Error('No credentials');
        }
        if (!user.password) {
          throw new Error(LOGIN_ERROR);
        }

        const valid = await argon.verify(user.password, credentials?.password);

        if (!valid) {
          throw new Error(LOGIN_ERROR);
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
    CredentialsProvider({
      id: 'token',
      name: 'Token',

      credentials: {
        token: {
          label: 'Verification Token',
          type: 'string',
        },
      },
      async authorize(credentials, _req) {
        let user;
        try {
          const { id } = await jwt.decode(credentials?.token);
          user = await prisma.user.findUnique({
            where: {
              id,
            },
          });
        } catch (e) {
          throw Error('Internal server error. Please try again later');
        }

        if (!user) {
          throw new Error('Error de autenticación');
        }

        if (user.emailVerified) {
          throw new Error('Email already verified');
        }

        const isValid = await new Promise((resolve) => {
          jwt.verify(
            credentials?.token,
            serverRuntimeConfig.JWT_SECRET + user.email,
            (err) => {
              if (err) resolve(false);
              if (!err) resolve(true);
            }
          );
        });

        if (!isValid) {
          throw new Error('Token is not valid or expired');
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user }) {
      return token;
    },

    async session({ session, token }) {
      if (!session?.user?.isDriver) {
        const user = await prisma.user.findUnique({
          where: {
            email: session?.user?.email,
          },
          include: {
            driver: true,
          },
        });
        session.user.id = user?.id;
        session.user.isDriver = user?.isDriver;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login', // Error code passed in query string as ?error=
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, options);
}
