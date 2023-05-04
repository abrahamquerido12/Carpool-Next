import { useLoadScript } from '@react-google-maps/api';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { place } from '../../../../types/trips';
import CustomBackdrop from '../../../components/CustomBackdrop';
import GoBackHeader from '../../../components/GoBackHeader';
import SearchTripForm from '../../../components/passenger/searchTrips/SearchTripForm';
import TripsResults from '../../../components/passenger/searchTrips/TripsResults';
import { SearchTripContext } from '../../../contexts/searchTripCtx';
import MainLayout from '../../../layouts/MainLayout';
import { searchTrips } from '../../../lib/api/passengerReqs';
import { CetiData } from '../../../lib/helpers';
import { UseToastContext } from '../../_app';

const SearchTripPage = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  });

  const router = useRouter();
  const { openToast } = useContext(UseToastContext);

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

  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen);
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

  const handleClick = async () => {
    setLoading(true);
    if (origin.description === 'CETI' && destination.description === 'CETI') {
      openToast('Favor de ingresar un viaje válido', 'error');
      return;
    }

    if (origin.description !== 'CETI' && destination.description !== 'CETI') {
      openToast('Solo viajes con destino o origen CETI', 'error');
      return;
    }
    setDrawerOpen(true);

    const payload = {
      date: date.toISOString(),
      origin: origin.description,
      originCoordinates: `${origin.latitude},${origin.longitude}`,
      destination: destination.description,
      destinationCoordinates: `${destination.latitude},${destination.longitude}`,
      departureTime: departureTime.toISOString(),
    };

    const { data } = await searchTrips(payload);

    if (!data) {
      openToast('No se encontraron viajes', 'error');
      setLoading(false);

      return;
    }

    setTrips(data);
    setLoading(false);
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
      <SearchTripContext.Provider
        value={{
          date,
          setDate,
          origin,
          setOrigin,
          destination,
          setDestination,
          departureTime,
          setDepartureTime,
        }}
      >
        <div className="w-full md:w-1/2">
          <GoBackHeader onClick={() => router.push('/passenger')} />
          <h1 className="text-[2rem]  text-cxBlue font-semibold ">
            Buscar viaje
          </h1>
          <SearchTripForm
            date={date}
            setDate={setDate}
            origin={origin}
            setOrigin={setOrigin}
            isOriginCeti={isOriginCeti}
            departureTime={departureTime}
            destination={destination}
            handleClick={handleClick}
            isDestinationCeti={isDestinationCeti}
            onDestinationCetiChange={onDestinationCetiChange}
            onOriginCetiChange={onOriginCetiChange}
            setDepartureTime={setDepartureTime}
            setDestination={setDestination}
          />

          <TripsResults
            trips={trips}
            open={drawerOpen}
            toggleDrawer={toggleDrawer}
            loading={loading}
          />
        </div>
      </SearchTripContext.Provider>
    </MainLayout>
  );
};

export default SearchTripPage;
