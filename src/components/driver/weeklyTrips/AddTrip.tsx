import { place } from '@/../types/trips';
import { CetiData } from '@/lib/helpers';
import { useLoadScript } from '@react-google-maps/api';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext } from 'react';
import { addWeeklyTrip, useWeeklyTrips } from '../../../lib/api/driverReqs';
import { UseToastContext } from '../../../pages/_app';
import { WeeklyTripsContext } from '../../../pages/driver/weekly-trips';
import CustomButton from '../../Button';
import CustomBackdrop from '../../CustomBackdrop';
import CustomDialog from '../../CustomFormDialog';
import CustomTimePicker from '../../CustomTimePicker';
import TextOrCeti from '../../TextOrCeti';

interface Props {
  day: string;
  dayVal: string;
}

const AddWeeklyTrip = ({ day, dayVal }: Props) => {
  const { mutate } = useWeeklyTrips();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string;
  const { openToast } = useContext(UseToastContext);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const { refreshData } = useContext(WeeklyTripsContext);
  const [saving, setSaving] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [origin, setOrigin] = React.useState<place>({
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [destination, setDestination] = React.useState<place>({
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [isOriginCeti, setIsOriginCeti] = React.useState(false);
  const [isDestinationCeti, setIsDestinationCeti] = React.useState(false);

  const [departureTime, setDepartureTime] = React.useState(dayjs(new Date()));

  const onOriginChange = (value: place) => {
    setOrigin(value);
  };

  const onDestinationChange = (value: place) => {
    setDestination(value);
  };

  const onOriginCetiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if is checked assign ceti data to origin
    if (e.target.checked) {
      setOrigin(CetiData);
      setIsOriginCeti(true);
    } else {
      setIsOriginCeti(false);
      setOrigin({
        description: '',
        latitude: 0,
        longitude: 0,
      });
    }
  };

  const onDestinationCetiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setDestination(CetiData);
      setIsDestinationCeti(true);
    } else {
      setIsDestinationCeti(false);
      setDestination({
        description: '',
        latitude: 0,
        longitude: 0,
      });
    }
  };

  const onTimeChange = (value: Dayjs) => {
    setDepartureTime(value);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);

    if (!origin.description || !destination.description) {
      openToast('Favor de agregar origen y destino válidos', 'error');
      setSaving(false);
      return;
    }

    if (origin.description === destination.description) {
      openToast('Origen y destino deben ser diferentes', 'error');
      setSaving(false);
      return;
    }

    const payload = {
      origin: origin.description,
      originCoordinates: `${origin.latitude},${origin.longitude}`,
      destination: destination.description,
      destinationCoordinates: `${destination.latitude}, ${destination.longitude}`,
      departureTime: departureTime.toISOString(),
      dayOfWeek: dayVal,
    };
    const response = await addWeeklyTrip(payload);
    if (response.status === 201) {
      openToast('Viaje semanal agregado', 'success');
      setSaving(false);
      onClose();
      mutate();
    } else {
      openToast('Error al agregar viaje semanal', 'error');
      setSaving(false);
    }
  };

  return (
    <div className="mt-5 w-full">
      <CustomButton variant="primary" onClick={() => setOpen(true)}>
        Agregar viaje
      </CustomButton>
      <CustomDialog open={open} onClose={onClose}>
        <div className="flex flex-col items-center justify-center p-5 w-[100%] md:w-[450px]">
          <h1 className="text-lg font-semibold text-gray-700">
            Nuevo viaje semanal para {day}
          </h1>

          <div className="flex flex-col items-start justify-center w-full">
            <span className="text-gray-500">Origen</span>
            {isLoaded && (
              <TextOrCeti
                isCeti={isOriginCeti}
                onCetiChange={onOriginCetiChange}
                value={origin}
                onChange={onOriginChange}
              />
            )}

            <span className="text-gray-500 mt-4">Destino</span>
            {isLoaded && (
              <TextOrCeti
                isCeti={isDestinationCeti}
                onCetiChange={onDestinationCetiChange}
                value={destination}
                onChange={onDestinationChange}
              />
            )}
            <span>Hora de salida</span>
            <CustomTimePicker setValue={onTimeChange} value={departureTime} />

            <div className="mt-4 w-full">
              <CustomButton variant="primary" onClick={handleSave}>
                Guardar
              </CustomButton>
            </div>
          </div>
        </div>

        <CustomBackdrop open={saving} />
      </CustomDialog>
    </div>
  );
};

export default AddWeeklyTrip;
