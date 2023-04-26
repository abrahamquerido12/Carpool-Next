import GoBackHeader from '@/components/GoBackHeader';
import Day from '@/components/driver/weeklyTrips/Day';
import MainLayout from '@/layouts/MainLayout';
import { groupTrips, weekdays } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { createContext, useMemo } from 'react';

export const WeeklyTripsContext = createContext<{
  refreshData: () => void;
}>({
  refreshData: () => {},
});

interface Props {
  trips: any;
}

const WeeklyTrips = ({ trips: rawTrips }: Props) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const router = useRouter();
  const trips = useMemo(() => {
    if (!rawTrips) return [];
    return groupTrips(rawTrips);
  }, [rawTrips]);

  const refetchProps = () => {
    router.replace(router.asPath);
  };

  const renderDays = () => {
    return weekdays.map((day) => {
      return (
        <div className="my-2" key={day.value}>
          <Day
            trips={trips[day.value as keyof typeof trips]}
            title={day.label}
            dayVal={day.value}
          />
        </div>
      );
    });
  };

  return (
    <MainLayout>
      <Script
        type="text/javascript"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
      />
      <WeeklyTripsContext.Provider value={{ refreshData: refetchProps }}>
        <div className="w-full md:w-1/2">
          <GoBackHeader onClick={() => router.push('/driver')} />
          <h1 className="text-[2rem]  text-cxBlue font-semibold ">
            Viajes Semanales
          </h1>
          {renderDays()}
        </div>
      </WeeklyTripsContext.Provider>
    </MainLayout>
  );
};

export default WeeklyTrips;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    select: {
      driver: {
        include: {
          weeklyTrips: true,
        },
      },
    },
  });

  if (!user?.driver) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      trips: JSON.parse(JSON.stringify(user?.driver?.weeklyTrips)),
    },
  };
};
