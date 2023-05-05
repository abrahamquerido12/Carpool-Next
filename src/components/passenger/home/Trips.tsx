import searchImg from '@/../public/search.svg';
import Image from 'next/image';
import TripRequests from './tripReqs/TripRequests';
import UpcomingTrips from './upcomingTrips/UpcomingTrips';

interface TripsI {
  upcomingTrips: any;
  pendingTripRequests: any;
}

const Trips = ({ upcomingTrips, pendingTripRequests }: TripsI) => {
  return (
    <div className="text-center flex justify-center itmes-center">
      {!upcomingTrips?.length && !pendingTripRequests?.length ? (
        <div>
          <Image src={searchImg} height={300} width={300} alt="search image" />

          <h3 className="mt-3">No se encontraron viajes activos</h3>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <UpcomingTrips upcomingTrips={upcomingTrips} />

          <TripRequests trips={pendingTripRequests} />
        </div>
      )}
    </div>
  );
};

export default Trips;
