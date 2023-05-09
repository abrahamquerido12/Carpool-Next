// protected route
import moment from 'moment-timezone';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../../lib/prisma';
import { options } from '../../../auth/[...nextauth]';

const timezone = 'America/Mexico_City';
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

      const today = moment().tz(timezone).startOf('day');
      const tripRequests = user.Passenger?.TripRequest?.filter((req) => {
        const date = moment(req.searchedDateTime).tz(timezone).startOf('day');

        return date.isSameOrAfter(today) && req.status === 'PENDING';
      });
      res.status(200).json(tripRequests ?? []);
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
