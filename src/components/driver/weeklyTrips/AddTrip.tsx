import { DayOfWeek } from '@prisma/client';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import CustomButton from '../../Button';
import CustomDialog from '../../CustomFormDialog';
import CustomTimePicker from '../../CustomTimePicker';
import TextOrCeti from '../../TextOrCeti';

interface Props {
  day: string;
}

const AddWeeklyTrip = ({ day }: Props) => {
  const [open, setOpen] = React.useState(false);

  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [isOriginCeti, setIsOriginCeti] = React.useState(false);
  const [isDestinationCeti, setIsDestinationCeti] = React.useState(false);

  const [departureTime, setDepartureTime] = React.useState(dayjs(new Date()));

  const onOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrigin(e.target.value);
  };

  const onDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  const onOriginCetiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOriginCeti(e.target.checked);
  };

  const onDestinationCetiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDestinationCeti(e.target.checked);
  };

  const onTimeChange = (value: Dayjs) => {
    setDepartureTime(value);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    // endpoint /api/driver/weeklytrip
    // lets to a mock object to test button and encpoint
    const mockTrip = {
      origin: 'origin',
      originCoordinates: 'originCoordinates',
      destination: 'destination',
      destinationCoordinates: 'destinationCoordinates',
      departureTime: new Date(),
      dayOfWeek: DayOfWeek.MONDAY,
    };

    const response = await axios.post('/api/driver/weeklytrip', mockTrip);
    console.log(response);
  };

  return (
    <div className="mt-5">
      <CustomButton variant="primary" onClick={() => setOpen(true)}>
        Agregar viaje
      </CustomButton>
      <CustomDialog open={open} onClose={onClose}>
        <div className="flex flex-col items-center justify-center p-5">
          <h1 className="text-lg font-semibold text-gray-700">
            Nuevo viaje semanal para {day}
          </h1>

          <div className="flex flex-col items-start justify-center w-full">
            <span className="text-gray-500">Origen</span>
            <TextOrCeti
              isCeti={isOriginCeti}
              onCetiChange={onOriginCetiChange}
              value={origin}
              onChange={onOriginChange}
            />

            <span className="text-gray-500 mt-4">Destino</span>
            <TextOrCeti
              isCeti={isDestinationCeti}
              onCetiChange={onDestinationCetiChange}
              value={destination}
              onChange={onDestinationChange}
            />

            <span>Hora de salida</span>
            <CustomTimePicker setValue={onTimeChange} value={departureTime} />

            <div className="mt-4 w-full">
              <CustomButton variant="primary" onClick={handleSave}>
                Guardar
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default AddWeeklyTrip;
