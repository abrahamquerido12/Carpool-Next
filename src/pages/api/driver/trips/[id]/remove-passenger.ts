// protected route
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../../../lib/prisma';
import { sendSms } from '../../../../../lib/twilio';
import { options } from '../../../auth/[...nextauth]';

const timezone = 'America/Mexico_City';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  if (req.method === 'PUT') {
    try {
      //trip id
      const { id } = req.query;

      // method to remove a passenger from a trip
      if (!id) {
        res.status(400).json({ error: 'Missing id' });
        return;
      }

      const { passengerId } = req.body;

      const passengerTrip = await prisma.passengerTrip.findFirst({
        where: {
          passengerId: passengerId,
        },
        select: {
          id: true,
          passenger: {
            select: {
              user: {
                select: { profile: { select: { phoneNumber: true } } },
              },
            },
          },
          trip: {
            select: {
              date: true,
            },
          },
        },
      });

      if (!passengerTrip) {
        res.status(400).json({ error: 'Passenger not found' });
        return;
      }

      await prisma.passengerTrip.delete({
        where: {
          id: passengerTrip?.id,
        },
      });

      const tripDateTime = moment
        .tz(passengerTrip?.trip?.date, timezone)
        .format('DD/MM/YYYY HH:mm');

      const phoneNumber = passengerTrip?.passenger?.user?.profile?.phoneNumber;

      if (process.env.NODE_ENV === 'production' && phoneNumber) {
        await sendSms(
          phoneNumber,
          `Tu viaje del ${tripDateTime} ha sido cancelado`
        );
      }

      res.status(200).json({
        message: 'Passenger removed',
      });
      return;
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};
