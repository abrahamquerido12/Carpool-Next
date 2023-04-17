import GoBackHeader from '@/components/GoBackHeader';
import Day from '@/components/driver/weeklyTrips/Day';
import MainLayout from '@/layouts/MainLayout';
import { groupTrips, weekdays } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const mockDay = {
  title: 'Lunes',
  trips: [
    // {
    //   origin: 'Origen',
    //   destination: 'Destino',
    //   departureTime: '12:00',
    // },
  ],
};

interface Props {
  trips: any;
}

const WeeklyTrips = ({ trips: rawTrips }: Props) => {
  const router = useRouter();

  const trips = useMemo(() => {
    if (!rawTrips) return [];
    return groupTrips(rawTrips);
  }, [rawTrips]);

  const renderDays = () => {
    return weekdays.map((day, i) => {
      return (
        <Day
          key={day.value}
          trips={trips[day.value as keyof typeof trips]}
          title={day.label}
        />
      );
    });
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <GoBackHeader onClick={() => router.push('/driver')} />
        <h1 className="text-[2rem]  text-cxBlue font-semibold ">
          Viajes Semanales
        </h1>
        {renderDays()}
      </div>
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
