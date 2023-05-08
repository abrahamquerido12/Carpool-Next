// protected route
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../lib/prisma';
import { options } from '../../auth/[...nextauth]';
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
        select: {
          driver: {
            select: {
              id: true,
              trips: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const trips = await prisma.trip.findMany({
        where: {
          driverId: user?.driver?.id,
          status: 'PENDING',
        },
        include: {
          TripRequest: true,
          weeklyTrip: true,
          driver: true,
          passengers: true,
        },
      });

      const today = dayjs().startOf('day');
      const upcomingTrips = trips.filter((trip) => {
        const date = dayjs(trip.date).startOf('day');

        return (
          date.isSame(today) ||
          (date.isAfter(today) && trip.passengers.length > 0)
        );
      });

      res.status(200).json(upcomingTrips);
      return;
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
