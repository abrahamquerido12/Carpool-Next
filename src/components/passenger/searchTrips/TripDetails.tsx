import { CetiData, weekdays } from '@/lib/helpers';
import 'dayjs/locale/es'; // importar el idioma si se requiere
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { SearchTripContext } from '../../../contexts/searchTripCtx';

import { createTripRequest } from '../../../lib/api/passengerReqs';
import { CreateTripReqPayload } from '../../../lib/api/passengerReqs/passengerTypes';
import { UseToastContext } from '../../../pages/_app';
import CustomButton from '../../Button';
import CustomBackdrop from '../../CustomBackdrop';

interface TripDetailsProps {
  trip: any;
  goBack: () => void;
}

const TripDetails = ({ trip, goBack }: TripDetailsProps) => {
  const router = useRouter();

  const { date, origin, destination, departureTime } =
    useContext(SearchTripContext);
  const { openToast } = useContext(UseToastContext);

  const [loading, setLoading] = React.useState(false);

  const weekday = `${
    weekdays.find((day) => day.value === trip.dayOfWeek)?.label
  } `;
  const time = new Date(trip.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const title = `${weekday},  ${time}`;

  const distanceLabel =
    trip.origin === 'CETI'
      ? 'Distancia desde destino del viaje a tu destino'
      : 'Distancia desde tu origen al origen del viaje';

  const distance = () => {
    if (trip.origin === 'CETI') {
      return trip.distanceToDestination > 1000
        ? `${trip.distanceToDestination / 1000} km`
        : `${trip.distanceToDestination} m`;
    } else {
      return trip.distanceToOrigin > 1000
        ? `${trip.distanceToOrigin / 1000} km`
        : `${trip.distanceToOrigin} m`;
    }
  };

  const walkingTime =
    trip.origin === 'CETI'
      ? Math.round(trip.distanceToDestination / 1.39)
      : Math.round(trip.distanceToOrigin / 1.39);

  const walkingTimeFormatted =
    walkingTime > 3600
      ? `${Math.floor(walkingTime / 60)}
          hrs y ${walkingTime % 60}min`
      : `${Math.round(walkingTime / 60)}min`;

  const handleOpenGoogleMaps = () => {
    let originCoordinates, destinationCoordinates;

    if (trip.origin === 'CETI') {
      originCoordinates = `${CetiData.latitude}, ${CetiData.longitude}`;
      destinationCoordinates = trip.destinationCoordinates;
    } else {
      originCoordinates = trip.originCoordinates;
      destinationCoordinates = `${CetiData.latitude}, ${CetiData.longitude}`;
    }

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoordinates}&destination=${destinationCoordinates}`;
    window.open(mapsUrl, '_blank');
  };

  const handleSendRequest = async () => {
    setLoading(true);

    const { description: oDesc, latitude: oLat, longitude: oLong } = origin;
    const {
      description: dDesc,
      latitude: dLat,
      longitude: dLong,
    } = destination;

    // create a new datetime with search date and departure time
    const combinedDateTime = date
      .set('hour', departureTime.hour())
      .set('minute', departureTime.minute());

    const payload: CreateTripReqPayload = {
      date: date.toISOString(),
      weeklyTripId: trip.id,
      isRecurrent: false,
      searchedDateTime: combinedDateTime.toISOString(),
      distanceToDestination: trip.distanceToDestination,
      distanceToOrigin: trip.distanceToOrigin,
      searchedDestination: dDesc,
      searchedDestinationCoordinates: `${dLat}, ${dLong}`,
      searchedOrigin: oDesc,
      searchedOriginCoordinates: `${oLat}, ${oLong}`,
    };

    const response = await createTripRequest(payload);

    if (response.status !== 200) {
      openToast('Ocurrió un error al solicitar el viaje', 'error');
      setLoading(false);
    } else {
      openToast('Solicitud enviada', 'success');
      router.push('/passenger');
    }
  };
  return (
    <div className="w-full px-3">
      <button
        className="bg-gray-100 p-2 rounded-md text-gray-600"
        onClick={goBack}
      >
        Regresar
      </button>
      <div className="mt-4 flex flex-col ">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex flex-col mt-2 w-full">
          <div className="flex w-full my-2 justify-between">
            <span className="mr-4 text-lg font-semibold ">Origen: </span>
            <span className="text-end">{trip.origin}</span>
          </div>
          <div className="flex w-full my-2 justify-between">
            <span className="mr-4 text-lg font-semibold ">Destino: </span>
            <span className="text-end">{trip.destination}</span>
          </div>

          <div className="flex w-full my-2 items-center justify-between">
            <div className="flex flex-col w-[50%]">
              <span className="mr-4 text-lg font-semibold ">Ditancia: </span>
              <span className="mr-4 text-xs font-normal">{distanceLabel}</span>
            </div>
            <div className="flex flex-col flex-1 w-[50%]  items-end">
              <span>{distance()}</span>
              <span>{walkingTimeFormatted} caminando</span>
            </div>
          </div>

          <div className="flex flex-col mt-10">
            <CustomButton onClick={handleOpenGoogleMaps}>
              Ver ruta completa
            </CustomButton>
          </div>
          <div className="flex flex-col mt-2">
            <CustomButton variant="primary" onClick={handleSendRequest}>
              Solicitar viaje
            </CustomButton>
          </div>
        </div>
      </div>
      <CustomBackdrop open={loading} />
    </div>
  );
};

export default TripDetails;
