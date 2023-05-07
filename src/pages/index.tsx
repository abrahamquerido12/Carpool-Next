import { GetServerSidePropsContext } from 'next';
import { getToken } from 'next-auth/jwt';

import { getSession } from 'next-auth/react';
import MainLayout from '../layouts/MainLayout';
import prisma from '../lib/prisma';

interface HomeProps {
  user: {
    email: string;
    isDriver: boolean;
  };
  userType?: string;
}

export default function Home(props: HomeProps) {
  const {
    user: { isDriver },
  } = props;

  if (!isDriver) {
    return <MainLayout>b</MainLayout>;
  }
}

// redirect to /login if user is not authenticated
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = await getToken({ req: context.req });
  const session = await getSession({ req: context.req });

  if (!token || !session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user?.isEmailVerified) {
    return {
      redirect: {
        destination: '/email-verification',
        permanent: false,
      },
    };
  }

  if (!user.isUserTypeSelected) {
    return {
      redirect: {
        destination: '/user-type',
        permanent: false,
      },
    };
  }

  if (user.isDriver) {
    return {
      redirect: {
        destination: '/driver',
        permanent: false,
      },
    };
  } else if (!user.isDriver) {
    return {
      redirect: {
        destination: '/passenger',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
        isDriver: session?.user?.isDriver,
      },
    },
  };
}
