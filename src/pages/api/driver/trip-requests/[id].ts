// protected route
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { sendSms } from '../../../../lib/twilio';
import { options } from '../../auth/[...nextauth]';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  // only post allowed
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  } else {
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

    const phone = passenger.user?.profile?.phoneNumber;
    if (!phone) return res.status(400).json({ error: 'Missing phone number' });

    const date = dayjs(trip.searchedDateTime).format('DD/MM/YYYY');
    const time = dayjs(trip?.trip?.weeklyTrip?.departureTime).format('HH:mm');

    const message = `Tu viaje para el día ${date} a las ${time} ha sido ${
      acceptTrip ? 'aceptado' : 'rechazado'
    }.\n`;

    await sendSms(`+52${phone}`, message);

    res.status(200).json(trip);
    return;
  }
};
