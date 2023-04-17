import Skeleton from '@mui/material/Skeleton';
import { GetServerSidePropsContext } from 'next';

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import MissingDataCard from '../../components/MissingDataCard';
import DriverHeader from '../../components/driver/DriverHeader';
import Trips from '../../components/driver/Home/Trips';
import { UserContext } from '../../contexts/userCtx';
import MainLayout from '../../layouts/MainLayout';
import prisma from '../../lib/prisma';

interface DriverHomeProps {
  driver: any;
}

const DriverHome = (props: DriverHomeProps) => {
  const { driver } = props;
  const { car, weeklyTrips, trips } = driver || {};
  const router = useRouter();

  const { firstName, firstLastName, loading } = useContext(UserContext);
  console.log(loading);

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
      return <Trips trips={trips} />;
    }
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <DriverHeader />
        {loading ? (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={30}
              className="rounded-lg mt-2"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={30}
              className="rounded-lg mt-2"
            />
          </>
        ) : (
          <h1 className="text-[2rem]  text-cxBlue font-semibold ">
            Bienvenido, {firstName?.toUpperCase()}{' '}
            {firstLastName?.toUpperCase()}
          </h1>
        )}

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
      driver: {
        include: {
          car: true,
          weeklyTrips: true,
          Trip: true,
        },
      },
    },
  });

  return {
    props: {
      // pass driver as json to the client
      driver: JSON.parse(JSON.stringify(user?.driver)) || null,
    },
  };
};
