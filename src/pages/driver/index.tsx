import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import MissingDataCard from '../../components/MissingDataCard';
import { UserContext } from '../../contexts/userCtx';
import MainLayout from '../../layouts/MainLayout';
import prisma from '../../lib/prisma';

interface DriverHomeProps {
  driver: string;
}

const DriverHome = (props: DriverHomeProps) => {
  const { driver } = props;
  const driverObj = JSON.parse(driver);
  const { car, weeklyTrips } = driverObj || {};

  console.log('weeklyTrips', weeklyTrips);

  const router = useRouter();
  const { firstName, firstLastName } = useContext(UserContext);

  const addCar = () => {
    router.push('/driver/add-car');
  };
  const addWeeklyTrips = () => {
    router.push('/driver/weekly-trips');
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <h1 className="text-[2rem]  text-cxBlue font-semibold ">
          Bienvenido, {firstName?.toUpperCase()} {firstLastName?.toUpperCase()}
        </h1>

        <div className="flex items-center justify-center my-5 w-full">
          <div className="w-full h-0.5 bg-cxGray"></div>
          <h2 className="text-gray-400 text-md font-normal mx-3">Viajes</h2>
          <div className="w-full h-0.5 bg-cxGray"></div>
        </div>

        <div>
          {!car && (
            <MissingDataCard
              title="No hay vehículo configurado"
              description="No has configurado un vehículo. Por favor, configura tu vehículo para poder continuar."
              buttonLabel="Agregar"
              onBtnClick={addCar}
            />
          )}
          {!weeklyTrips?.length && (
            <MissingDataCard
              title="No hay viajes programados"
              description="No tienes viajes programados para esta semana. Por favor, configura tus viajes para poder continuar."
              buttonLabel="Agregar"
              onBtnClick={addWeeklyTrips}
            />
          )}
        </div>
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
        },
      },
    },
  });

  return {
    props: {
      // pass driver as json to the client
      driver: JSON.stringify(user?.driver) || null,
    },
  };
};
