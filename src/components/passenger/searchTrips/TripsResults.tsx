/* eslint-disable no-unused-vars */
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';
import SwipeEdge from '../../SwipeEdge';
import Trip from './Trip';
import TripDetails from './TripDetails';

const TripsResults = ({
  trips,
  open,
  toggleDrawer,
  loading,
}: {
  trips: any;
  open: boolean;
  toggleDrawer: (newOpen: boolean) => void;
  loading: boolean;
}) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const label = !selectedTrip
    ? `${trips.length || 0} viajes encontrados`
    : 'Detalles del viaje';

  const handleClick = (trip: any) => {
    setSelectedTrip(trip);
  };

  const renderTrips = () => (
    <div className={`w-full  flex flex-col justify-start`}>
      {!trips.length ? (
        <div>
          <h2>No se encontraron viajes con estos parámetros de búsqueda</h2>
        </div>
      ) : (
        trips.map((trip: any) => (
          <Trip trip={trip} onClick={() => handleClick(trip)} key={trip.id} />
        ))
      )}
    </div>
  );

  useEffect(() => {
    if (selectedTrip && !open) {
      setSelectedTrip(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <SwipeEdge
      label={label}
      disableSwipe={!trips.length}
      open={open}
      toggleDrawer={toggleDrawer}
    >
      {!selectedTrip ? (
        loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton
              variant="rectangular"
              height={70}
              width="100%"
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height={70}
              width="100%"
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height={70}
              width="100%"
              animation="wave"
            />
          </div>
        ) : (
          renderTrips()
        )
      ) : (
        <TripDetails trip={selectedTrip} goBack={() => setSelectedTrip(null)} />
      )}
    </SwipeEdge>
  );
};

export default TripsResults;
