import MainLayout from '@/layouts/MainLayout';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import GoBackHeader from '../../../../components/GoBackHeader';
import {
  getDateTitle,
  getFormattedDepartureTime,
} from '../../../../lib/helpers';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Skeleton } from '@mui/material';
import CustomButton from '../../../../components/Button';
import AlertDialog from '../../../../components/CustomAlertDialog';
import CustomBackdrop from '../../../../components/CustomBackdrop';
import {
  updateTripRequest,
  useTripRequest,
  useTripRequests,
  useUpcomingTrips,
} from '../../../../lib/api/driverReqs';
import { UseToastContext } from '../../../_app';

interface Props {
  tripId: number;
}

const TripRequestDetailsPage = ({ tripId }: Props) => {
  const { data, isLoading: dataLoading, error } = useTripRequest(tripId);
  const { mutate: updateReqs } = useTripRequests();
  const { mutate: updateUpcomingTrips } = useUpcomingTrips();
  const { trip, weeklyTrip } = data || {};

  const router = useRouter();
  const { openToast } = useContext(UseToastContext);
  const passengerProfile = trip?.passenger?.user?.profile;

  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState<'aceptar' | 'rechazar'>(
    'aceptar'
  );

  const [isLoading, setIsLoading] = useState(false);

  const passengerFullName = `${passengerProfile?.firstName} ${passengerProfile?.firstLastName}`;
  const passengerPhone = passengerProfile?.phoneNumber;

  const title = getDateTitle(weeklyTrip?.dayOfWeek, trip?.trip?.date);
  const time = getFormattedDepartureTime(weeklyTrip?.departureTime);

  if (!dataLoading && error) {
    openToast(
      'Ocurrión un error al cargar la información. Favor de intentar mas tarde.',
      'error'
    );
  }

  const handleAcceptBtnClick = async () => {
    setAlertTitle('Confirmación');
    setAlertMessage('¿Estás seguro de aceptar la solicitud?');
    setAlertAction('aceptar');
    setOpenAlert(true);
  };

  const handleRejectBtnClick = async () => {
    setAlertTitle('Confirmación');
    setAlertMessage('¿Estás seguro de rechazar la solicitud?');
    setAlertAction('rechazar');

    setOpenAlert(true);
  };

  const handleAction = async (action: 'aceptar' | 'rechazar') => {
    setIsLoading(true);
    const response = await updateTripRequest(trip.id, {
      acceptTrip: action === 'aceptar',
    });

    if (response.status !== 200) {
      openToast(
        'Ocurrió un error al actualizar la información. Favor de intentar mas tarde.',
        'error'
      );
      setIsLoading(false);
    } else {
      openToast(
        'Se aceptó solicitud de viaje con éxito. Se notifcará al pasajero para que se comunique contigo.',
        'success'
      );
      updateReqs();
      updateUpcomingTrips();

      setIsLoading(false);
      router.push('/driver');
    }
  };

  return (
    <MainLayout>
      <div className="w-full md:w-1/2 h-full">
        <GoBackHeader onClick={() => router.push('/driver')} />
        <h1 className="text-[1.5rem] text-cxBlue font-semibold">
          Detalles de la solicitud
        </h1>

        <div className="w-full flex-col  px-3 mt-3 ">
          <h2 className="text-[1.3rem] text-gray-500 font-semibold mb-3">
            Viaje
          </h2>
          <div className="flex items-start flex-col justify-start w-full mb-3">
            <div className="w-full flex my-1 flex-start items-center">
              <TripOriginIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
              {dataLoading ? (
                <Skeleton width="100%" height={30} />
              ) : (
                <p className="overflow-hidden  font-medium">
                  {weeklyTrip?.origin}
                </p>
              )}
            </div>
            <div className="w-full flex my-1 flex-start items-center ">
              <FmdGoodOutlinedIcon className="mr-2 inline-block text-[md] text-cxBlue" />
              {dataLoading ? (
                <Skeleton width="100%" height={30} />
              ) : (
                <p className="overflow-hidden   font-medium ">
                  {weeklyTrip?.destination}
                </p>
              )}
            </div>
            <div className="w-full flex my-1 flex-start items-center ">
              <CalendarMonthIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
              {dataLoading ? (
                <Skeleton width="100%" height={30} />
              ) : (
                <p className="overflow-hidden   font-medium ">
                  {title}, {time}
                </p>
              )}
            </div>
          </div>
          <h2 className="text-[1.3rem] text-gray-500 font-semibold">
            Datos del pasajero
          </h2>
          <div className="w-full my-1 flex flex-start items-center ">
            <PersonOutlineOutlinedIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
            {dataLoading ? (
              <Skeleton width="100%" height={30} />
            ) : (
              <p className="overflow-hidden   font-medium">
                {passengerFullName}
              </p>
            )}
          </div>

          <div className="w-full my-1 flex flex-start items-center ">
            <PhoneAndroidOutlinedIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />

            {dataLoading ? (
              <Skeleton width="100%" height={30} />
            ) : (
              <p>{passengerPhone}</p>
            )}
          </div>

          <div className="mt-10">
            <div className="w-full my-3">
              <CustomButton onClick={handleRejectBtnClick}>
                Rechazar solicitud
              </CustomButton>
            </div>

            <div className="w-full my-3">
              <CustomButton onClick={handleAcceptBtnClick} variant="primary">
                Aceptar solicitud
              </CustomButton>
            </div>
          </div>
        </div>
        <AlertDialog
          open={openAlert}
          handleClose={() => setOpenAlert(false)}
          title={alertTitle}
          description={alertMessage}
          agreeText="Si, continuar"
          disagreeText="Cancelar"
          handleAgree={() => handleAction(alertAction)}
        />
      </div>
      <CustomBackdrop open={isLoading} />
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

  return {
    props: {
      tripId: +id,
    },
  };
}
