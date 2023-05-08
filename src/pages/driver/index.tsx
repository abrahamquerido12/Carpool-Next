import { GetServerSidePropsContext } from 'next';

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MissingDataCard from '../../components/MissingDataCard';
import WelcomeUser from '../../components/WelcomeUser';
import DriverHeader from '../../components/driver/DriverHeader';
import Trips from '../../components/driver/Home/Trips';
import MainLayout from '../../layouts/MainLayout';
import {
  useDriverData,
  useTripRequests,
  useUpcomingTrips,
} from '../../lib/api/driverReqs';

const DriverHome = () => {
  const { data: userData, isLoading: userDataLoading } = useDriverData();

  const { data: tripRequests, isLoading: tripRequestsLoading } =
    useTripRequests();

  const { data: upcomingTrips, isLoading: upcomingTripsLoading } =
    useUpcomingTrips();
  const { driver } = userData || {};
  const { firstName, firstLastName } = userData?.profile || {};
  const { car, weeklyTrips } = driver || {};
  const router = useRouter();

  const addCar = () => {
    router.push('/driver/add-car');
  };
  const addWeeklyTrips = () => {
    router.push('/driver/weekly-trips');
  };

  const checkProileComplete = () => {
    if (!car && !userDataLoading) {
      return (
        <MissingDataCard
          title="No hay vehículo configurado"
          description="No has configurado un vehículo. Por favor, configura tu vehículo para poder continuar."
          buttonLabel="Agregar"
          onBtnClick={addCar}
        />
      );
    } else if (!weeklyTrips?.length && !userDataLoading) {
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
        <Trips
          upcomingTrips={upcomingTrips}
          tripRequests={tripRequests}
          upcomingTripsLoading={upcomingTripsLoading}
          tripRequestsLoading={tripRequestsLoading}
        />
      );
    }
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <DriverHeader />
        <WelcomeUser
          loading={userDataLoading}
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
  console.log({
    session,
  });

  if (!session.user.isDriver && session.user.isUserTypeSelected) {
    return {
      redirect: {
        destination: '/passenger',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
