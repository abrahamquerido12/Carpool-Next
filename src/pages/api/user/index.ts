// protected route
import prisma from '@/lib/prisma';
import * as argon from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { sendEmail } from '../../../lib/email';
import { options } from '../auth/[...nextauth]';
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, options);

    if (!session) {
      res.status(401).json({ error: 'Not Authorized' });
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          driver: true,
          Passenger: true,
          profile: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // post
  if (req.method === 'POST') {
    try {
      const { body } = req;

      // check if email already exists
      let user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (user) return res.status(400).json({ error: 'Email already exists' });

      const hash = await argon.hash(body.password);

      user = await prisma.user.create({
        data: {
          email: body.email,
          password: hash,
        },
      });

      const profile = await prisma.profile.create({
        data: {
          firstName: body.firstName,
          firstLastName: body.firstLastName,
          secondLastName: body.secondLastName,
          phoneNumber: body.phoneNumber,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const today = new Date();
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresIn = new Date(today.getTime() + 60 * 60 * 1000);

      await prisma.verificationToken.create({
        data: {
          token: token,
          expiresAt: expiresIn,
          userId: user.id,
        },
      });

      await sendEmail(user.email, token);

      res.status(201).json({ ...user, profile });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
