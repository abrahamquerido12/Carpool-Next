// protected route
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  // only allow post
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = session.user;

    // change isDriver to value from body
    const isDriver = req.body.isDriver;

    // update user in db
    const user = await prisma.user.update({
      where: { email },
      data: { isDriver, isUserTypeSelected: true },
    });

    // create driver model if isDriver is true
    if (isDriver) {
      await prisma.driver.create({
        data: {
          user: {
            connect: { email },
          },
        },
      });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: 'Something went wrong' });
  }
};
