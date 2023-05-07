import MainLayout from '@/layouts/MainLayout';
import prisma from '@/lib/prisma';
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
import CustomButton from '../../../../components/Button';
import AlertDialog from '../../../../components/CustomAlertDialog';
import CustomBackdrop from '../../../../components/CustomBackdrop';
import { updateTripRequest } from '../../../../lib/api/driverReqs';
import { UseToastContext } from '../../../_app';

interface Props {
  trip: any;
  weeklyTrip: any;
}

const TripRequestDetailsPage = ({ trip, weeklyTrip }: Props) => {
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

  const title = getDateTitle(weeklyTrip.dayOfWeek, weeklyTrip.departureTime);
  const time = getFormattedDepartureTime(weeklyTrip.departureTime);

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
            Datos del pasajero
          </h2>
          <div className="w-full my-1 flex flex-start items-center ">
            <PersonOutlineOutlinedIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />
            <p className="overflow-hidden   font-medium">{passengerFullName}</p>
          </div>

          <div className="w-full my-1 flex flex-start items-center ">
            <PhoneAndroidOutlinedIcon className="mr-2 inline-block h-5 w-5 text-cxBlue" />

            <p>{passengerPhone}</p>
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
  const tripReq = await prisma.tripRequest.findFirst({
    where: {
      id: +id,
    },
    include: {
      passenger: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      trip: {
        include: {
          passengers: true,
        },
      },
    },
  });

  const weeklyTrip = await prisma.weeklyTrip.findFirst({
    where: {
      id: tripReq?.trip?.weeklyTripId,
    },
  });

  return {
    props: {
      trip: JSON.parse(JSON.stringify(tripReq)),
      weeklyTrip: JSON.parse(JSON.stringify(weeklyTrip)),
    },
  };
}
