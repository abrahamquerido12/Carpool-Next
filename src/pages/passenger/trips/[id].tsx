import GoBackHeader from '@/components/GoBackHeader';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';

import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import TripOriginIcon from '@mui/icons-material/TripOrigin';

import CustomButton from '@/components/Button';
import AlertDialog from '@/components/CustomAlertDialog';
import CustomBackdrop from '@/components/CustomBackdrop';
import {
  cancelTrip,
  useTripDeatils,
  useUpcomingTrips,
} from '@/lib/api/passengerReqs';
import {
  getDateTitle,
  getFormattedDepartureTime,
  getWhatsappLink,
} from '@/lib/helpers';
import { UseToastContext } from '@/pages/_app';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import EightMpOutlinedIcon from '@mui/icons-material/EightMpOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import { Skeleton } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { useContext, useState } from 'react';

const TripDetailsPage = ({ tripId }: { tripId: number }) => {
  const { data: trip, error, isLoading: dataLoading } = useTripDeatils(tripId);

  const { mutate } = useUpcomingTrips();
  const { weeklyTrip, driver } = trip?.trip || {};
  const { firstName, firstLastName, phoneNumber } = driver?.user.profile || {};
  const { brand, color, model, plate } = driver?.car || {};
  const { openToast } = useContext(UseToastContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const title = getDateTitle(weeklyTrip?.dayOfWeek, weeklyTrip?.departureTime);
  const time = getFormattedDepartureTime(weeklyTrip?.departureTime);

  const whatsAppMessage = 'Hola, soy pasajero en tu viaje de SchoolPool.';

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
        'Se canceló el viaje con éxito. Se notifcará al conductor.',
        'success'
      );
      mutate();
      router.push('/driver');
    }
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <GoBackHeader onClick={() => router.push('/passenger')} />
        <h1 className="text-3xl font-bold text-cxBlue">Detalles del viaje</h1>
        <div className="w-full flex-col  px-3 mt-3 ">
          <h2 className="text-[1.3rem] text-gray-500 font-semibold mb-3">
            Viaje
          </h2>
          <div className="flex items-start flex-col justify-start w-full mb-3">
            <div className="w-full flex my-1 flex-start items-center">
              <TripOriginIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
              {dataLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={30}
                  className="rounded-md"
                />
              ) : (
                <p className="overflow-hidden  font-medium">
                  {weeklyTrip.origin}
                </p>
              )}
            </div>
            <div className="w-full flex my-1 flex-start items-center ">
              <FmdGoodOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
              {dataLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={30}
                  className="rounded-md"
                />
              ) : (
                <p className="overflow-hidden   font-medium ">
                  {weeklyTrip.destination}
                </p>
              )}
            </div>
            <div className="w-full flex my-1 flex-start items-center ">
              <CalendarMonthIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
              {dataLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={30}
                  className="rounded-md"
                />
              ) : (
                <p className="overflow-hidden   font-medium ">
                  {title}, {time}
                </p>
              )}
            </div>
          </div>
          <h2 className="text-[1.3rem] text-gray-500 font-semibold">
            Conductor
          </h2>
          <div className="w-full flex my-2 flex-start items-center">
            <PersonOutlineOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
            {dataLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={30}
                className="rounded-md"
              />
            ) : (
              <p className="overflow-hidden   font-medium flex items-center ">
                {firstName + ' ' + firstLastName}
                <PhoneIphoneOutlinedIcon className="inline-block text-[md] ml-2 text-cxBlue" />{' '}
                <a
                  className="underline decoration-cxBlue"
                  href={getWhatsappLink(phoneNumber, whatsAppMessage)}
                  target="_blank"
                >
                  {phoneNumber}
                </a>
              </p>
            )}
          </div>
          <h2 className="text-[1.3rem] text-gray-500 font-semibold">
            Vehículo
          </h2>{' '}
          <div className="w-full flex my-2 flex-start items-center">
            <DirectionsCarFilledOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
            {dataLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={30}
                className="rounded-md"
              />
            ) : (
              <p className="overflow-hidden   font-medium flex items-center ">
                {brand + ', ' + model + ', ' + color}
              </p>
            )}
          </div>
          <div className="w-full flex my-2 flex-start items-center">
            <EightMpOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
            {dataLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={30}
                className="rounded-md"
              />
            ) : (
              <p className="overflow-hidden   font-medium flex items-center ">
                ****{plate}
              </p>
            )}
          </div>
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
  if (!id) {
    return {
      redirect: {
        destination: '/passenger',
        permanent: false,
      },
    };
  }
  return {
    props: {
      tripId: +id,
    },
  };
};
