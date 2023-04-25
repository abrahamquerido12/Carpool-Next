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

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).json({ error: 'Missing id' });
        return;
      }

      const trip = await prisma.weeklyTrip.findFirstOrThrow({
        where: {
          id: +id,
        },
      });

      // check if trip belongs to user
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: session.user.id,
        },
        select: {
          driver: true,
        },
      });

      if (!user) return res.status(401).json({ error: 'Not Authorized' });

      if (trip.driverId !== user.driver?.id)
        return res.status(401).json({ error: 'Not Authorized' });

      // delete trip
      const deleted = await prisma.weeklyTrip.delete({
        where: {
          id: +id,
        },
      });

      res.status(200).json(deleted);
    } catch (e) {
      console.log(e);

      return res.status(500).json({ error: e });
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
};
