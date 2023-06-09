// protected route
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
      const user = await prisma.user.findFirst({
        where: {
          email: session.user.email,
        },
        select: {
          driver: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        res.status(401).json({ error: 'Not Authorized' });
        return;
      }

      const tripRequests = await prisma.tripRequest.findMany({
        where: {
          trip: {
            driverId: user?.driver?.id,
          },
          status: 'PENDING',
        },
        include: {
          trip: {
            include: {
              weeklyTrip: true,
            },
          },
        },
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
