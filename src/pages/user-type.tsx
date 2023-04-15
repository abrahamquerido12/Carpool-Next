import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import MainLayout from '../layouts/MainLayout';

import driverImg from '@/../public/driver.svg';
import passengerImg from '@/../public/passenger.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const UserType = () => {
  const router = useRouter();
  const handleUserType = async (type: string) => {
    try {
      const response = await axios.post('/api/user/user-type', {
        isDriver: type === 'driver',
      });
      console.log(response.data);
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="mt-24 text-center">
        <h1 className="text-lg">Yo soy</h1>

        <div className="flex items-center justify-center mt-5">
          <button
            className="h-48 w-48 text-center flex justify-center items-center flex-col  bg-white shadow-lg border border-gray-50   rounded-md m-2 hover:bg-gray-50 hover:-translate-y-1 transition duration-300 ease-in-out"
            onClick={() => handleUserType('driver')}
          >
            <Image
              className="mb-2"
              src={driverImg}
              alt="driver"
              width={100}
              height={100}
            />
            Conductor
          </button>
          <button
            className="h-48 w-48 text-center flex justify-center items-center flex-col  bg-white shadow-lg border border-gray-50   rounded-md m-2 hover:bg-gray-50 hover:-translate-y-1 transition duration-300 ease-in-out"
            onClick={() => handleUserType('passenger')}
          >
            <Image
              className="mb-2"
              src={passengerImg}
              alt="driver"
              width={100}
              height={100}
            />
            Pasajero
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserType;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  if (session.user.isDriver !== null) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
