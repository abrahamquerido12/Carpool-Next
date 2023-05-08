import requestImage from '@/../public/request.svg';
import { Skeleton } from '@mui/material';
import Image from 'next/image';
import TripRequests from '../tripRequests/TripRequests';
import UpcomingTrips from './upcomingTrips/UpcomingTrips';

interface TripsProps {
  upcomingTrips: any | null;
  tripRequests: any | null;
  tripRequestsLoading: boolean;
  upcomingTripsLoading: boolean;
}

const Trips = ({
  upcomingTrips,
  tripRequests,
  tripRequestsLoading,
  upcomingTripsLoading,
}: TripsProps) => {
  if (
    !upcomingTrips?.length &&
    !tripRequests?.length &&
    !tripRequestsLoading &&
    !upcomingTripsLoading
  )
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image src={requestImage} alt="No hay viajes" className="mt-5 w-1/2" />
        <h2 className="text-sm text-center mt-2">
          ¡Vaya! Parece que no has realizado ningún viaje. <br /> Aquí podrás
          ver tus viajes realizados y también las solicitudes de viaje que
          recibas
        </h2>
      </div>
    );

  return (
    <div className="flex flex-col w-full">
      {upcomingTripsLoading ? (
        <Skeleton height={150} />
      ) : (
        <UpcomingTrips upcomingTrips={upcomingTrips} />
      )}
      {tripRequestsLoading ? (
        <Skeleton height={150} />
      ) : (
        <TripRequests tripRequests={tripRequests} />
      )}
    </div>
  );
};

export default Trips;
