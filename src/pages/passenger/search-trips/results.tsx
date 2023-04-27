import MainLayout from '@/layouts/MainLayout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UseToastContext } from '../../_app';

import GoBackHeader from '@/components/GoBackHeader';
import TripsResults from '@/components/passenger/searchTrips/TripsResults';
import _ from 'lodash';
import SearchParams from '../../../components/passenger/searchTrips/SearchParams';

const ResultsPage = () => {
  const router = useRouter();
  const { query } = router;
  const {
    origin,
    originCoordinates,
    destination,
    destinationCoordinates,
    departureTime,
    date,
  } = query;

  const data = useMemo(
    () => ({
      origin,
      originCoordinates,
      destination,
      destinationCoordinates,
      departureTime,
      date,
    }),
    [
      origin,
      originCoordinates,
      destination,
      destinationCoordinates,
      departureTime,
      date,
    ]
  );

  const { openToast } = useContext(UseToastContext);

  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  const getTrips = useCallback(async () => {
    console.log(data);

    const response = await axios.post('/api/trips/search', data);

    setLoading(false);
    if (response.status === 200) {
      setTrips(response.data);
    } else {
      openToast('Hubo un error al obtener los viajes', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (_.isEmpty(data)) return;
    getTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <MainLayout>
      <div className="w-full">
        <GoBackHeader onClick={() => router.back()} />
        <h1
          className=" 
        text-3xl text-cxBlue font-semibold mt-3"
        >
          Viajes encontrados
        </h1>
        <SearchParams />
        <TripsResults />
      </div>
    </MainLayout>
  );
};

export default ResultsPage;
