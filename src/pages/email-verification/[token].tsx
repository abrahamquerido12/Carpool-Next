import { GetServerSidePropsContext } from 'next';
import prisma from '../../lib/prisma';

const VerifyEmailPage = () => {
  return <div>VerifyEmailPage</div>;
};

export default VerifyEmailPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { token } = context.query;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const verifiedToken = await prisma.verificationToken.findFirst({
    where: {
      token: token as string,
    },
    include: {
      user: {
        select: {
          id: true,
          isEmailVerified: true,
        },
      },
    },
  });

  if (!verifiedToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (verifiedToken.user.isEmailVerified)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  const today = new Date();
  const expireDate = verifiedToken?.expiresAt;

  if (expireDate && today > expireDate) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.update({
    where: {
      id: verifiedToken?.user?.id,
    },
    data: {
      isEmailVerified: true,
    },
  });

  const email = user.email;

  return {
    redirect: {
      destination: `/login?email=${email}&verified=true`,
      permanent: false,
    },
  };
};
