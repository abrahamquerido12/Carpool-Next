import { GetServerSidePropsContext } from 'next';

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MissingDataCard from '../../components/MissingDataCard';
import WelcomeUser from '../../components/WelcomeUser';
import DriverHeader from '../../components/driver/DriverHeader';
import Trips from '../../components/driver/Home/Trips';
import MainLayout from '../../layouts/MainLayout';
import prisma from '../../lib/prisma';

interface DriverHomeProps {
  driver: any;
  user: any;
  tripRequests: any;
  upcomingTrips: any;
}

const DriverHome = (props: DriverHomeProps) => {
  const { driver, user, tripRequests, upcomingTrips } = props;
  const { firstName, firstLastName, loading } = user?.profile || {};
  const { car, weeklyTrips } = driver || {};
  const router = useRouter();

  const addCar = () => {
    router.push('/driver/add-car');
  };
  const addWeeklyTrips = () => {
    router.push('/driver/weekly-trips');
  };

  const checkProileComplete = () => {
    if (!car) {
      return (
        <MissingDataCard
          title="No hay vehículo configurado"
          description="No has configurado un vehículo. Por favor, configura tu vehículo para poder continuar."
          buttonLabel="Agregar"
          onBtnClick={addCar}
        />
      );
    } else if (!weeklyTrips?.length) {
      return (
        <MissingDataCard
          title="No hay viajes programados"
          description="No tienes viajes programados para esta semana. Por favor, configura tus viajes para poder continuar."
          buttonLabel="Agregar"
          onBtnClick={addWeeklyTrips}
        />
      );
    } else {
      return (
        <Trips upcomingTrips={upcomingTrips} tripRequests={tripRequests} />
      );
    }
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <DriverHeader />
        <WelcomeUser
          loading={loading}
          firstLastName={firstLastName as string}
          firstName={firstName as string}
        />

        <div className="flex items-center justify-center my-5 w-full">
          <div className="w-full h-0.5 bg-cxGray"></div>
          <h2 className="text-gray-400 text-md font-normal mx-3">Viajes</h2>
          <div className="w-full h-0.5 bg-cxGray"></div>
        </div>

        <div>{checkProileComplete()}</div>
      </div>
    </MainLayout>
  );
};

export default DriverHome;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      profile: {
        select: {
          firstLastName: true,
          firstName: true,
          secondLastName: true,
        },
      },
      driver: {
        include: {
          car: true,
          weeklyTrips: true,

          trips: {
            include: {
              TripRequest: true,
              weeklyTrip: true,
            },
          },
        },
      },
    },
  });

  const tripRequests = await prisma.tripRequest.findMany({
    where: {
      trip: {
        driverId: user?.driver?.id,
      },
      status: 'PENDING',
    },
    include: {
      trip: {
        include: {
          weeklyTrip: true,
        },
      },
    },
  });

  const today = new Date();

  const trips = await prisma.trip.findMany({
    where: {
      driverId: user?.driver?.id,
      status: 'PENDING',
    },
    include: {
      TripRequest: true,
      weeklyTrip: true,
      driver: true,
      passengers: true,
    },
  });

  const upcomingTrips = trips.filter((trip) => {
    const tripDate = new Date(trip.date);
    return tripDate >= today && trip.passengers.length > 0;
  });

  return {
    props: {
      // pass driver as json to the client
      user: JSON.parse(JSON.stringify(user)),
      driver: JSON.parse(JSON.stringify(user?.driver)) || null,
      tripRequests: JSON.parse(JSON.stringify(tripRequests)) || null,
      upcomingTrips: JSON.parse(JSON.stringify(upcomingTrips)) || null,
    },
  };
};
