import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/userCtx';
import MainLayout from '../../layouts/MainLayout';
import prisma from '../../lib/prisma';

interface DriverHomeProps {
  user: any;
}

const DriverHome = (props: DriverHomeProps) => {
  const router = useRouter();
  const { firstName, firstLastName } = useContext(UserContext);

  const addCar = () => {
    router.push('/driver/add-car');
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

        <div></div>
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
      Passenger: true,
    },
  });

  return {
    props: {
      // pass driver as json to the client
      user: JSON.parse(JSON.stringify(user)) || null,
    },
  };
};
