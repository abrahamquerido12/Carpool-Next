// protected route
import prisma from '@/lib/prisma';
import { sendSms } from '@/lib/twilio';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { options } from '../../../auth/[...nextauth]';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  // only post allowed
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const tripReq = await prisma.tripRequest.findFirst({
        where: {
          id: +id,
        },
        include: {
          passenger: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          trip: {
            include: {
              passengers: true,
            },
          },
        },
      });

      const weeklyTrip = await prisma.weeklyTrip.findFirst({
        where: {
          id: tripReq?.trip?.weeklyTripId,
        },
      });

      res.status(200).json({
        weeklyTrip,
        trip: tripReq,
      });
      return;
    } catch (e) {
      console.log(e);

      res.status(500).json({ error: 'Internal Server Error', e });
      return;
    }
  }
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { acceptTrip } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }

    const trip = await prisma.tripRequest.update({
      where: {
        id: +id,
      },
      data: {
        status: acceptTrip ? 'ACCEPTED' : 'REJECTED',
      },
      include: {
        trip: {
          include: {
            weeklyTrip: true,
          },
        },
      },
    });

    const passenger = await prisma.passenger.findFirst({
      where: {
        id: trip.passengerId,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });

    if (!passenger) {
      res.status(400).json({ error: 'Missing passenger' });
      return;
    }

    if (acceptTrip && trip?.trip) {
      await prisma.passengerTrip.create({
        data: {
          passenger: {
            connect: {
              id: passenger.id,
            },
          },
          trip: {
            connect: {
              id: trip.trip.id,
            },
          },
        },
      });
    }

    const phone = passenger.user?.profile?.phoneNumber;
    if (!phone) return res.status(400).json({ error: 'Missing phone number' });

    const date = dayjs(trip.searchedDateTime).format('DD/MM/YYYY');
    const time = dayjs(trip?.trip?.weeklyTrip?.departureTime).format('HH:mm');

    const message = `Tu solicitud de viaje para el día ${date} a las ${time} ha sido ${
      acceptTrip ? 'aceptado' : 'rechazado'
    }.\n`;

    if (process.env.NODE_ENV !== 'development') {
      await sendSms(`+52${phone}`, message);
    }

    res.status(200).json(trip);
    return;
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
};
