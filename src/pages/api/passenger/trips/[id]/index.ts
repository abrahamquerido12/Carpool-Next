// protected route
import prisma from '@/lib/prisma';
import { options } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'No trip id provided' });
      }

      const trip = await prisma.passengerTrip.findFirst({
        where: {
          id: +id,
        },
        include: {
          passenger: true,
          trip: {
            select: {
              driver: {
                select: {
                  car: {
                    select: {
                      brand: true,
                      color: true,
                      model: true,
                      plate: true,
                    },
                  },
                  user: {
                    select: {
                      profile: {
                        select: {
                          firstName: true,
                          firstLastName: true,
                          phoneNumber: true,
                        },
                      },
                    },
                  },
                },
              },
              weeklyTrip: true,
            },
          },
        },
      });

      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      const formattedTrip = {
        ...trip,
        trip: {
          ...trip.trip,
          driver: {
            ...trip.trip.driver,
            car: {
              ...trip.trip.driver.car,
              plate: trip.trip?.driver?.car?.plate.slice(-3),
            },
          },
        },
      };

      res.status(200).json(formattedTrip);
      return;
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: 'Error while getting trip data', e: error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
};
