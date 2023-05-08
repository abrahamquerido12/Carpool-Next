import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext } from 'react';
import EmailImg from '../../../public/email.svg';
import MainLayout from '../../layouts/MainLayout';
import { resendVerificationEmail } from '../../lib/api/general';
import prisma from '../../lib/prisma';
import { UseToastContext } from '../_app';
const EmailVerificationPage = () => {
  let interval: any;
  const { openToast } = useContext(UseToastContext);
  const [resended, setResended] = React.useState(false);
  const [timer, setTimer] = React.useState(10);

  const handleResendEmail = async () => {
    const res = await resendVerificationEmail();
    setResended(true);

    if (res.status !== 200)
      return openToast(
        'Ocurrió un error al mandar el correo. Favor de intentar mas tarde',
        'error'
      );

    openToast('Correo enviado', 'success');
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          setResended(false);
          clearInterval(interval);
          return 10;
        }

        return prev - 1;
      });
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2 flex flex-col h-full mt-10">
        <h1 className="text-center text-3xl font-bold text-cxBlue">
          Verifica tu correo electrónico
        </h1>
        <div className="flex flex-col items-center justify-center mt-5 p-5">
          <Image alt="email" src={EmailImg} className="my-5 h-1/3" />
          <p className="text-center text-xl mt-5">
            Hemos enviado un correo electrónico a tu dirección de correo.
          </p>
          <p className="text-center  text-sm my-1">
            Haz clic en el enlace de verificación que se encuentra en el correo
            electrónico. Si no encuentras el correo de confirmación, por favor
            revisa tu carpeta de spam o correo no deseado.
          </p>

          <span className="mt-5">¿No te llegó el correo?</span>
          <button
            className="text-cxBlue"
            onClick={handleResendEmail}
            disabled={resended}
          >
            Reenvía el correo electrónico
          </button>
          {resended && (
            <span className="text-sm">Podrás reenviar en {timer} segundos</span>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EmailVerificationPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);
    if (!session)
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (user?.isEmailVerified)
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };

    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
