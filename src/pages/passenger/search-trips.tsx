import { useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { place } from '../../../types/trips';
import CustomButton from '../../components/Button';
import CustomBackdrop from '../../components/CustomBackdrop';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomTimePicker from '../../components/CustomTimePicker';
import GoBackHeader from '../../components/GoBackHeader';
import TextOrCeti from '../../components/TextOrCeti';
import MainLayout from '../../layouts/MainLayout';
import { CetiData } from '../../lib/helpers';
const SearchTripPage = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const router = useRouter();

  const [origin, setOrigin] = useState<place>({
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [destination, setDestination] = useState<place>({
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [isOriginCeti, setIsOriginCeti] = useState(false);
  const [isDestinationCeti, setIsDestinationCeti] = useState(false);

  const [date, setDate] = useState(dayjs(new Date()));
  const [departureTime, setDepartureTime] = useState(dayjs(new Date()));

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

  const handleClick = async () => {
    const response = await axios.post('/api/trips/search', {
      date: date.toDate(),
      origin: {
        description: 'CETI',
      },
    });

    console.log(response.data);
  };

  if (!isLoaded) {
    return (
      <div>
        <CustomBackdrop open />
      </div>
    );
  }
  return (
    <MainLayout>
      <div className="w-full md:w-1/2">
        <GoBackHeader onClick={() => router.push('/passenger')} />
        <h1 className="text-[2rem]  text-cxBlue font-semibold ">
          Buscar viaje
        </h1>
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
      </div>
    </MainLayout>
  );
};

export default SearchTripPage;
