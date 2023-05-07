import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CustomButton from '../../components/Button';
import WelcomeUser from '../../components/WelcomeUser';
import PassengerHeader from '../../components/passenger/PassengerHeader';
import Trips from '../../components/passenger/home/Trips';
import MainLayout from '../../layouts/MainLayout';
import prisma from '../../lib/prisma';

interface PassengerHomeProps {
  user: any;
  upcomingTrips: any;
  tripRequests: any;
}

const PassengerHome = (props: PassengerHomeProps) => {
  const { user, upcomingTrips, tripRequests } = props;

  const router = useRouter();
  const { firstName, firstLastName } = user.profile;

  return (
    <MainLayout>
      <div className="w-full md:w-1/2 flex flex-col h-full">
        <PassengerHeader />
        <WelcomeUser
          loading={false}
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

  const today = new Date();

  // filter trips that are greater or equal to today
  const upcomingTrips = user?.Passenger?.trips?.filter((trip) => {
    const tripDate = new Date(trip.trip.date);
    return tripDate >= today;
  });

  // show only trip request that are pending and in the future
  const tripRequests = user?.Passenger?.TripRequest?.filter((req) => {
    const tripDate = new Date(req.trip.date);
    return req.status === 'PENDING' && tripDate >= today;
  });

  console.log(upcomingTrips);

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
