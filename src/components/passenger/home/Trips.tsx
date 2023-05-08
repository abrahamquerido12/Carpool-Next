import searchImg from '@/../public/search.svg';
import { Skeleton } from '@mui/material';
import Image from 'next/image';
import TripRequests from './tripReqs/TripRequests';
import UpcomingTrips from './upcomingTrips/UpcomingTrips';

interface TripsI {
  upcomingTrips: any;
  pendingTripRequests: any;
  upcomingTripsLoading: boolean;
  tripRequestsLoading: boolean;
}

const Trips = ({
  upcomingTrips,
  pendingTripRequests,
  upcomingTripsLoading,
  tripRequestsLoading,
}: TripsI) => {
  const finishLoading = !upcomingTripsLoading && !tripRequestsLoading;

  return (
    <div className="text-center flex justify-center itmes-center pb-20">
      {finishLoading &&
      !upcomingTrips &&
      !upcomingTrips?.length &&
      !pendingTripRequests?.length ? (
        <div>
          <Image src={searchImg} height={300} width={300} alt="search image" />

          <h3 className="mt-3">No se encontraron viajes activos</h3>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {upcomingTripsLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              className="mb-5"
            />
          ) : (
            <UpcomingTrips upcomingTrips={upcomingTrips} />
          )}

          {tripRequestsLoading ? (
            <Skeleton variant="rectangular" width="100%" height={100} />
          ) : (
            <TripRequests trips={pendingTripRequests} />
          )}
        </div>
      )}
    </div>
  );
};

export default Trips;
