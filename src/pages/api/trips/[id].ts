// protected route
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { sendSms } from '../../../lib/twilio';
import { options } from '../auth/[...nextauth]';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      if (!id) return res.status(404).json({ error: 'Invalid id' });

      const trip = await prisma.trip.findFirst({
        where: {
          id: +id,
        },
        include: {
          passengers: {
            include: {
              passenger: {
                include: {
                  user: {
                    select: {
                      profile: {
                        select: {
                          phoneNumber: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });

      await prisma.trip.update({
        where: {
          id: +id,
        },
        data: {
          status: 'CANCELLED',
        },
      });

      const date = dayjs(trip.date).format('DD/MM/YYYY');
      const time = dayjs(trip.date).format('HH:mm');
      const message = `Tu viaje para el día ${date} a las ${time} ha sido cancelado.\n`;

      //notify status
      const passengerNotifications = trip.passengers.map(async (p) => {
        const phone = p.passenger.user.profile?.phoneNumber;
        if (!phone) {
          return Promise.reject({ error: 'Missing phone number' });
        }

        if (process.env.NODE_ENV !== 'development') {
          await sendSms(`+52${phone}`, message);
        }
      });

      Promise.all(passengerNotifications)
        .then((results) => {
          return res.status(200).json(trip);
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ error: 'Failed to send SMS notifications' });
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: 'Error while updating trip status', e: error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
};
