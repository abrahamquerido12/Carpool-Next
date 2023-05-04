// protected route
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]';

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

      // if there is no trip with weeklyTripId, create a new trip
      let trip = await prisma.trip.findFirst({
        where: {
          weeklyTripId,
        },
      });

      if (!trip) {
        trip = await prisma.trip.create({
          data: {
            date: date as string,
            isRecurrent: isRecurrent as boolean,
            status: 'PENDING',
            weeklyTripId: weeklyT?.id as number,
            driverId: weeklyT?.driver?.id as number,
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
