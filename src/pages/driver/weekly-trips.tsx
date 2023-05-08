import GoBackHeader from '@/components/GoBackHeader';
import Day from '@/components/driver/weeklyTrips/Day';
import MainLayout from '@/layouts/MainLayout';
import { groupTrips, weekdays } from '@/lib/helpers';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createContext, useContext, useMemo } from 'react';
import { useWeeklyTrips } from '../../lib/api/driverReqs';
import { UseToastContext } from '../_app';

export const WeeklyTripsContext = createContext<{
  refreshData: () => void;
}>({
  refreshData: () => {},
});

const WeeklyTrips = () => {
  const { data: rawTrips, isLoading, error } = useWeeklyTrips();
  const { openToast } = useContext(UseToastContext);
  const router = useRouter();
  const trips = useMemo(() => {
    if (!rawTrips) return [];
    return groupTrips(rawTrips);
  }, [rawTrips]);

  const refetchProps = () => {
    router.replace(router.asPath);
  };

  if (!isLoading && error) {
    openToast('Ocurrión un error al obtener los viajes semanales', 'error');
  }

  const renderDays = () => {
    return weekdays.map((day) => {
      return (
        <div className="my-2" key={day.value}>
          <Day
            trips={trips[day.value as keyof typeof trips]}
            title={day.label}
            dayVal={day.value}
            isLoading={isLoading}
          />
        </div>
      );
    });
  };

  return (
    <MainLayout>
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

  if (!session?.user.isDriver && session.user.isUserTypeSelected) {
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
