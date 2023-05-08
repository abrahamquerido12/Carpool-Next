// protected route
import prisma from '@/lib/prisma';
import { options } from '@/pages/api/auth/[...nextauth]';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { sendSms } from '../../../../../lib/twilio';

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
        return res.status(400).json({ error: 'No trip id provided' });
      }

      const deletedPassenger = await prisma.passengerTrip.delete({
        where: {
          id: +id,
        },
        include: {
          passenger: {
            select: {
              user: {
                select: {
                  profile: {
                    select: {
                      firstName: true,
                    },
                  },
                },
              },
            },
          },
          trip: {
            select: {
              id: true,
              date: true,
              driverId: true,
            },
          },
        },
      });

      const driver = await prisma.driver.findFirst({
        where: {
          id: deletedPassenger.trip.driverId,
        },
        include: { user: { include: { profile: true } } },
      });

      if (!driver) return res.status(400).json({ error: 'No driver found' });
      const phone = driver.user.profile?.phoneNumber;
      const passsengerName = deletedPassenger.passenger.user.profile?.firstName;
      const tripDateTime = dayjs(deletedPassenger.trip.date).format(
        'DD/MM/YYYY HH:mm'
      );

      if (phone && process.env.NODE_ENV === 'production') {
        await sendSms(
          `+52${phone}`,
          `El pasajero ${passsengerName} ha cancelado su viaje con fecha y hora ${tripDateTime}`
        );
      }

      res.status(200).json(deletedPassenger);
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
