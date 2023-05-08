// protected route
import prisma from '@/lib/prisma';
import { options } from '@/pages/api/auth/[...nextauth]';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
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
            include: {
              TripRequest: {
                include: {
                  trip: {
                    select: {
                      weeklyTrip: true,
                      date: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        res.status(401).json({ error: 'Not Authorized' });
        return;
      }

      const today = dayjs().startOf('day');

      const tripRequests = user.Passenger?.TripRequest?.filter((req) => {
        // use dayjs to check if tripDate is today or greater

        const date = dayjs(req.trip.date).startOf('day');

        return (
          (req.status === 'PENDING' && date.isSame(today)) ||
          date.isAfter(today)
        );
      });
      res.status(200).json(tripRequests);
      return;
    } catch (e) {
      console.log(e);

      res.status(500).json({ error: 'Something went wrong', e });
    }
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  } else {
    const { acceptTrip } = req.body;
  }
};
