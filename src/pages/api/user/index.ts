// protected route
import prisma from '@/lib/prisma';
import * as argon from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
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

      const hash = await argon.hash(body.password);

      const user = await prisma.user.create({
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

      res.status(201).json({ ...user, profile });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
