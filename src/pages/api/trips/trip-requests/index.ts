// protected route
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { sendSms } from '../../../../lib/twilio';
import { options } from '../../auth/[...nextauth]';

const timezone = 'America/Mexico_City';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ error: 'Not Authorized' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const {
        date,
        isRecurrent,
        weeklyTripId,
        distanceToOrigin,
        distanceToDestination,
        searchedDateTime,
        searchedDestination,
        searchedDestinationCoordinates,
        searchedOrigin,
        searchedOriginCoordinates,
      } = req.body;

      // user
      const user = await prisma.user.findFirst({
        where: {
          id: session.user.id,
          isDriver: false,
          isUserTypeSelected: true,
        },
        include: {
          Passenger: true,
        },
      });

      if (!user) {
        res.status(401).json({ error: 'Not Authorized' });
        return;
      }

      // get weeklyTrip data
      const weeklyT = await prisma.weeklyTrip.findFirst({
        where: {
          id: weeklyTripId,
        },
        include: {
          driver: {
            select: {
              id: true,
            },
          },
        },
      });

      const searchedDate = dayjs(searchedDateTime);

      const trips = await prisma.trip.findMany({
        where: {
          weeklyTripId: weeklyTripId,
        },
        include: {
          weeklyTrip: true,
        },
      });

      let trip = trips.find((t) => {
        const tripDate = dayjs(t.date);

        return (
          tripDate.format('MM') === searchedDate.format('MM') &&
          tripDate.format('DD') === searchedDate.format('DD')
        );
      });

      console.log({
        trip,
      });

      if (!trip) {
        trip = await prisma.trip.create({
          data: {
            date: searchedDateTime,
            isRecurrent: isRecurrent as boolean,
            status: 'PENDING',
            weeklyTripId: weeklyT?.id as number,
            driverId: weeklyT?.driver?.id as number,
          },
          include: {
            weeklyTrip: true,
          },
        });
      }

      let passenger = user.Passenger;
      if (!passenger) {
        passenger = await prisma.passenger.create({
          data: {
            userId: user.id,
          },
        });
      }

      // create a new trip request
      const tripRequest = await prisma.tripRequest.create({
        data: {
          tripId: trip.id,
          passengerId: passenger?.id as number,
          distanceToOrigin,
          distanceToDestination,

          searchedDateTime,
          searchedDestination,
          searchedDestinationCoordinates,
          searchedOrigin,
          searchedOriginCoordinates,
        },
      });

      const driver = await prisma.driver.findFirst({
        where: {
          id: trip.driverId,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });

      const driverPhone = driver?.user?.profile?.phoneNumber;

      const rquestDate = dayjs(tripRequest.searchedDateTime).format(
        'DD/MM/YYYY'
      );
      // const weeklyTripTime = dayjs(trip.weeklyTrip.departureTime).format(
      //   'HH:mm'
      // );
      const departureTime = moment
        .utc(trip.weeklyTrip.departureTime)
        .tz(timezone);

      const weeklyTripTime = departureTime.format('HH:mm');

      const message = `Tienes una nueva solicitud de viaje para el día ${rquestDate}, en tu viaje de las ${weeklyTripTime}.\n\n`;

      console.log(message);

      if (process.env.NODE_ENV !== 'development') {
        await sendSms(`+52${driverPhone}`, message);
      }

      res.status(200).json(tripRequest);
      return;
    } catch (e) {
      console.log(e);

      res.status(500).json({ error: e });
      return;
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
};
