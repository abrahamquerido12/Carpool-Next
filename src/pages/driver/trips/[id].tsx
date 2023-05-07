import GoBackHeader from '@/components/GoBackHeader';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';

import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import TripOriginIcon from '@mui/icons-material/TripOrigin';

import CustomButton from '@/components/Button';
import AlertDialog from '@/components/CustomAlertDialog';
import CustomBackdrop from '@/components/CustomBackdrop';
import { cancelTrip } from '@/lib/api/driverReqs';
import { getDateTitle, getFormattedDepartureTime } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import { UseToastContext } from '@/pages/_app';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { GetServerSidePropsContext } from 'next';
import { useContext, useState } from 'react';

const TripDetailsPage = ({ trip }: { trip: any }) => {
  const { weeklyTrip, passengers } = trip;
  const { openToast } = useContext(UseToastContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const title = getDateTitle(weeklyTrip.dayOfWeek, weeklyTrip.departureTime);
  const time = getFormattedDepartureTime(weeklyTrip.departureTime);

  const renderPassengers = () => {
    if (passengers.length == 0) {
      return <div>No hay pasajeros que mostrar</div>;
    }
    return passengers.map((passenger: any) => {
      const { firstName, firstLastName, phoneNumber } = passenger.profile;
      return (
        <div
          key={passenger.id}
          className="w-full flex my-2 flex-start items-center"
        >
          <PersonOutlineOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
          <p className="overflow-hidden   font-medium flex items-center ">
            {firstName + ' ' + firstLastName}
            <PhoneIphoneOutlinedIcon className="inline-block text-[md] ml-2 text-cxBlue" />{' '}
            {phoneNumber}
          </p>
        </div>
      );
    });
  };

  const handleCancelTripBtnClick = async () => {
    setAlertTitle('Confirmación');
    setAlertMessage('¿Estás seguro de cancelar el viaje?');
    setOpenAlert(true);
  };

  const handleAction = async () => {
    setIsLoading(true);
    const response = await cancelTrip(trip.id);

    if (response.status !== 200) {
      openToast(
        'Ocurrió un error al cancelar el viaje. Favor de intentar mas tarde.',
        'error'
      );
      setIsLoading(false);
    } else {
      openToast(
        'Se canceló el viaje con éxito. Se notifcará a todos los pasajeros.',
        'success'
      );
      router.push('/driver');
    }
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <GoBackHeader onClick={() => router.push('/driver')} />
        <h1 className="text-3xl font-bold text-cxBlue">Detalles del viaje</h1>
        <div className="w-full flex-col  px-3 mt-3 ">
          <h2 className="text-[1.3rem] text-gray-500 font-semibold mb-3">
            Viaje
          </h2>
          <div className="flex items-start flex-col justify-start w-full mb-3">
            <div className="w-full flex my-1 flex-start items-center">
              <TripOriginIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
              <p className="overflow-hidden  font-medium">
                {weeklyTrip.origin}
              </p>
            </div>
            <div className="w-full flex my-1 flex-start items-center ">
              <FmdGoodOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
              <p className="overflow-hidden   font-medium ">
                {weeklyTrip.destination}
              </p>
            </div>
            <div className="w-full flex my-1 flex-start items-center ">
              <CalendarMonthIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
              <p className="overflow-hidden   font-medium ">
                {title}, {time}
              </p>
            </div>
          </div>
          <h2 className="text-[1.3rem] text-gray-500 font-semibold">
            Pasajeros
          </h2>
          <div className="w-full flex flex-col">{renderPassengers()}</div>

          <div className="mt-10">
            <div className="w-full my-3">
              <CustomButton onClick={handleCancelTripBtnClick} variant="error">
                Cancelar viaje
              </CustomButton>
            </div>
          </div>
          <AlertDialog
            open={openAlert}
            handleClose={() => setOpenAlert(false)}
            title={alertTitle}
            description={alertMessage}
            agreeText="Si, continuar"
            disagreeText="Cancelar"
            handleAgree={handleAction}
          />
        </div>
      </div>
      <CustomBackdrop open={isLoading} />
    </MainLayout>
  );
};

export default TripDetailsPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;

  const trip = await prisma.trip.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      passengers: {
        include: {
          passenger: {
            include: {
              user: {
                select: {
                  profile: {
                    select: {
                      firstLastName: true,
                      firstName: true,
                      phoneNumber: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      weeklyTrip: true,
    },
  });

  const formattedtrip = {
    ...trip,

    passengers: trip?.passengers.map((passenger: any) => {
      return {
        ...passenger,
        profile: {
          ...passenger.passenger.user.profile,
        },
      };
    }),
  };

  if (!trip) {
    return {
      redirect: {
        destination: '/driver/trips',
        permanent: false,
      },
    };
  }

  return {
    props: {
      trip: JSON.parse(JSON.stringify(formattedtrip)),
    },
  };
};
