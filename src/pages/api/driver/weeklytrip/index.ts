// protected route
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { options } from '../../auth/[...nextauth]';
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
      select: {
        driver: {
          include: {
            weeklyTrips: true,
          },
        },
      },
    });

    if (!user) {
      console.log('user not found');
      res.status(401).json({ error: 'Not Authorized' });
    }

    const weeklyTrips = user?.driver?.weeklyTrips;
    res.status(200).json(weeklyTrips);
    return;
  }

  if (req.method === 'POST') {
    try {
      // get the user
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          driver: true,
        },
      });

      if (!user || !user.isDriver) {
        res.status(401).json({ error: 'Not Authorized' });
        return;
      }

      let driver;
      if (!user.driver) {
        // create a driver
        driver = await prisma.driver.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } else {
        driver = user.driver;
      }
      const body = req.body;
      const weeklyTrips = await prisma.weeklyTrip.create({
        data: {
          dayOfWeek: body.dayOfWeek,
          departureTime: body.departureTime,
          destination: body.destination,
          destinationCoordinates: body.destinationCoordinates,
          origin: body.origin,
          originCoordinates: body.originCoordinates,
          driver: {
            connect: {
              id: driver.id,
            },
          },
        },
      });

      res.status(201).json(weeklyTrips);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }
};
