import MainLayout from '@/layouts/MainLayout';
import prisma from '@/lib/prisma';
import { GetServerSidePropsContext } from 'next';

interface Props {
  trip: any;
}

const TripRequestDetailsPage = ({ trip }: Props) => {
  console.log(trip);

  return (
    <MainLayout>
      <div>
        <h1>holis</h1>
      </div>
    </MainLayout>
  );
};

export default TripRequestDetailsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  if (!id) {
    return {
      redirect: {
        destination: '/driver',
        permanent: false,
      },
    };
  }
  const tripReq = await prisma.tripRequest.findFirst({
    where: {
      id: +id,
    },
    include: {
      trip: {
        include: {
          passengers: true,
        },
      },
    },
  });

  return {
    props: {
      trip: JSON.parse(JSON.stringify(tripReq)),
    },
  };
}
