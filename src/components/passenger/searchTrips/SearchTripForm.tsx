/* eslint-disable no-unused-vars */
import dayjs from 'dayjs';
import { ChangeEvent } from 'react';
import { place } from '../../../../types/trips';
import CustomButton from '../../Button';
import CustomDatePicker from '../../CustomDatePicker';
import CustomTimePicker from '../../CustomTimePicker';
import TextOrCeti from '../../TextOrCeti';

interface SearchTripFormProps {
  origin: place;
  isOriginCeti: boolean;
  setOrigin: (value: place) => void;
  onOriginCetiChange: (e: ChangeEvent<HTMLInputElement>) => void;
  destination: place;
  isDestinationCeti: boolean;
  setDestination: (value: place) => void;
  onDestinationCetiChange: (e: ChangeEvent<HTMLInputElement>) => void;

  date: dayjs.Dayjs;
  setDate: (value: dayjs.Dayjs) => void;

  departureTime: dayjs.Dayjs;
  setDepartureTime: (value: dayjs.Dayjs) => void;

  handleClick: () => void;
}

const SearchTripForm = (props: SearchTripFormProps) => {
  const {
    origin,
    isOriginCeti,
    setOrigin,
    onOriginCetiChange,
    destination,
    isDestinationCeti,
    setDestination,
    onDestinationCetiChange,
    date,
    setDate,

    departureTime,

    setDepartureTime,
    handleClick,
  } = props;

  return (
    <>
      <div className="flex-col flex mt-4">
        <span>Origen</span>
        <TextOrCeti
          value={origin}
          isCeti={isOriginCeti}
          onChange={(value) => setOrigin(value)}
          onCetiChange={onOriginCetiChange}
        />
      </div>
      <div className="flex-col flex mt-4">
        <span>Destino</span>
        <TextOrCeti
          value={destination}
          isCeti={isDestinationCeti}
          onChange={(value) => setDestination(value)}
          onCetiChange={onDestinationCetiChange}
        />
      </div>

      <div className="mt-4 flex flex-col">
        <span>Fecha de salida</span>
        <CustomDatePicker value={date} onChange={(val) => setDate(val)} />
      </div>

      <div className="mt-4 flex flex-col">
        <span>Hora de salida</span>
        <CustomTimePicker
          value={departureTime}
          setValue={(val) => setDepartureTime(val)}
        />
      </div>

      <div className="mt-8">
        <CustomButton variant="primary" onClick={handleClick}>
          Buscar
        </CustomButton>
      </div>
    </>
  );
};

export default SearchTripForm;
