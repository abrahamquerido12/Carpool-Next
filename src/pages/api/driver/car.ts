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

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          driver: {
            select: {
              car: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const car = user.driver?.car || {};
      res.status(200).json(car);
      return;
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      const driver = await prisma.driver.findUnique({
        where: {
          userId: user?.id,
        },
      });

      if (!user) throw new Error('User not found');
      if (!user?.isDriver) throw new Error('User is not a driver');

      const car = await prisma.car.upsert({
        where: {
          driverId: driver?.id,
        },
        update: {
          model: data.model,
          brand: data.brand,
          color: data.color,
          seats: data.seats,
          plate: data.plate,
        },
        create: {
          model: data.model,
          brand: data.brand,
          color: data.color,
          seats: data.seats,
          plate: data.plate,
          driver: {
            connect: {
              id: driver?.id,
            },
          },
        },
      });

      res.status(201).json(car);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
