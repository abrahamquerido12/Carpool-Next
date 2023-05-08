import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import dayjs from 'dayjs';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CustomButton from '../../components/Button';
import WelcomeUser from '../../components/WelcomeUser';
import PassengerHeader from '../../components/passenger/PassengerHeader';
import Trips from '../../components/passenger/home/Trips';
import MainLayout from '../../layouts/MainLayout';
import { useUserData } from '../../lib/api/general';
import prisma from '../../lib/prisma';

interface PassengerHomeProps {
  user: any;
  upcomingTrips: any;
  tripRequests: any;
}

const PassengerHome = (props: PassengerHomeProps) => {
  const { data: user, isLoading: userDataLoading } = useUserData();
  const { upcomingTrips, tripRequests } = props;

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
        />

        <div className="mt-auto mb-10">
          <CustomButton
            onClick={() => router.push('/passenger/search-trips')}
            variant="primary"
          >
            <SearchOutlinedIcon className="mr-1" />
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
  let user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      email: true,
      Passenger: {
        include: {
          TripRequest: {
            include: {
              trip: {
                select: {
                  weeklyTrip: true,
                  date: true,
                },
              },
            },
          },
          trips: {
            include: {
              trip: {
                include: {
                  weeklyTrip: true,
                },
              },
            },
          },
        },
      },
      isDriver: true,
      profile: true,
    },
  });

  const today = dayjs().startOf('day');

  // filter trips that are greater or equal to today
  const upcomingTrips = user?.Passenger?.trips?.filter((trip) => {
    const date = dayjs(trip.trip.date).startOf('day');

    return date.isSame(today) || date.isAfter(today);
  });

  // show only trip request that are pending and in the future
  const tripRequests = user?.Passenger?.TripRequest?.filter((req) => {
    // use dayjs to check if tripDate is today or greater

    const date = dayjs(req.trip.date).startOf('day');

    return (
      (req.status === 'PENDING' && date.isSame(today)) || date.isAfter(today)
    );
  });

  return {
    props: {
      // pass driver as json to the client
      user: JSON.parse(JSON.stringify(user)) || null,
      upcomingTrips: upcomingTrips
        ? JSON.parse(JSON.stringify(upcomingTrips))
        : [],
      tripRequests: tripRequests
        ? JSON.parse(JSON.stringify(tripRequests))
        : [],
    },
  };
};
