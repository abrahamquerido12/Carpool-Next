import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CustomButton from '../../components/Button';
import WelcomeUser from '../../components/WelcomeUser';
import PassengerHeader from '../../components/passenger/PassengerHeader';
import Trips from '../../components/passenger/home/Trips';
import MainLayout from '../../layouts/MainLayout';
import { useUserData } from '../../lib/api/general';
import { useTripRequests, useUpcomingTrips } from '../../lib/api/passengerReqs';

const PassengerHome = () => {
  const { data: user, isLoading: userDataLoading } = useUserData();
  const { data: upcomingTrips, isLoading: upcomingTripsLoading } =
    useUpcomingTrips();

  const { data: tripRequests, isLoading: tripRequestsLoading } =
    useTripRequests();

  const router = useRouter();
  const { firstName, firstLastName } = user?.profile || {};

  return (
    <MainLayout>
      <div className="w-full md:w-1/2 flex flex-col h-full">
        <PassengerHeader />
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

        <Trips
          upcomingTrips={upcomingTrips}
          pendingTripRequests={tripRequests}
          upcomingTripsLoading={upcomingTripsLoading}
          tripRequestsLoading={tripRequestsLoading}
        />

        <div className="fixed bottom-5 w-[80%] text-center left-1/2 -translate-x-1/2">
          <CustomButton
            onClick={() => router.push('/passenger/search-trips')}
            variant="primary"
          >
            <SearchOutlinedIcon className="mr-1 " />
            Buscar Viajes
          </CustomButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default PassengerHome;

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

  if (session.user.isDriver) {
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
