// protected route
import prisma from '@/lib/prisma';
import { getDistance } from 'geolib';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { weekdaysForTripSearch } from '../../../lib/helpers';
import { options } from '../auth/[...nextauth]';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, options);

    if (!session) {
      res.status(401).json({ error: 'Not Authorized' });
      return;
    }
    try {
      // expect to recieve optional query parameters such as

      const {
        origin,
        originCoordinates,
        destination,
        destinationCoordinates,
        date,
        departureTime,
      }: {
        origin: string;
        originCoordinates: string;
        destination: string;
        destinationCoordinates: string;
        date: Date;
        departureTime: Date;
      } = req.body;
      // trips we'll be generated based on driver's weekly trips and query params
      let trips = await prisma.weeklyTrip.findMany({
        include: {
          driver: {
            select: {
              id: true,
            },
          },
        },
      });

      if (date) {
        // get day of the week from date object
        let day = new Date(date).getDay();

        // filter trips based on day of the week
        const dayOfWeekName = weekdaysForTripSearch[day];

        trips = trips.filter((trip) => {
          return trip.dayOfWeek === dayOfWeekName;
        });

        if (!trips.length) {
          res.status(200).json({ trips: [] });
          return;
        }
      }

      if (origin) {
        if (origin === 'CETI') {
          trips = trips
            .filter((trip) => trip.origin === 'CETI')
            .map((trip) => ({ ...trip, distanceToOrigin: 0 }));
        } else {
          const [lat, long] = originCoordinates.split(',');
          const searchOrigin = {
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
          };

          // we'll search the closest trip to origin based on the latitude and longitude
          trips = trips
            .map((trip) => {
              const [tripLat, tripLng] = trip.originCoordinates.split(',');
              const tripOrigin = {
                latitude: parseFloat(tripLat),
                longitude: parseFloat(tripLng),
              };

              const distance = getDistance(searchOrigin, tripOrigin);

              return { ...trip, distanceToOrigin: distance };
            })
            .sort((a, b) => a.distanceToOrigin - b.distanceToOrigin);
        }
      }

      if (destination) {
        if (destination === 'CETI') {
          trips = trips
            .filter((trip) => trip.destination === 'CETI')
            .map((trip) => ({ ...trip, distanceToDestination: 0 }));
        } else {
          const [lat, long] = destinationCoordinates.split(',');
          const searchDestination = {
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
          };

          // we'll search the closest trip to origin based on the latitude and longitude
          trips = trips
            .map((trip) => {
              const [tripLat, tripLng] = trip.destinationCoordinates.split(',');
              const tripDestination = {
                latitude: parseFloat(tripLat),
                longitude: parseFloat(tripLng),
              };

              const distance = getDistance(searchDestination, tripDestination);

              return { ...trip, distanceToDestination: distance };
            })
            .sort((a, b) => a.distanceToDestination - b.distanceToDestination);
        }
      }

      // sort trips based on departure time, first on the array the ones that are
      // closer to the departure time from the searched trip
      const searchedDepartureTime = new Date(departureTime).getHours();

      trips.sort((a, b) => {
        const aDepartureTime = new Date(a.departureTime);
        const bDepartureTime = new Date(b.departureTime);

        const aTimeDiff = Math.abs(
          aDepartureTime.getHours() - searchedDepartureTime
        );
        const bTimeDiff = Math.abs(
          bDepartureTime.getHours() - searchedDepartureTime
        );

        return aTimeDiff - bTimeDiff;
      });

      res.status(200).json(trips);
      return;

      // if query params are present, we'll generate trips based on those params
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
