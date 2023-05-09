// protected route
import moment from 'moment-timezone';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../lib/prisma';
const timezone = 'America/Mexico_City';

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
          Passenger: {
            select: {
              id: true,
              trips: {
                include: {
                  trip: {
                    include: {
                      weeklyTrip: true,
                      TripRequest: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const today = moment().tz(timezone).startOf('day');

      // filter trips that are greater or equal to today
      const upcomingTrips = user?.Passenger?.trips?.filter((trip) => {
        const date = moment(trip.trip.date).tz(timezone).startOf('day');

        date.isSameOrAfter(today);
        return date.isSameOrAfter(today);
      });

      res.status(200).json(upcomingTrips ?? []);
      return;
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
