import searchImg from '@/../public/search.svg';
import Image from 'next/image';
import TripRequests from './TripRequests';

interface TripsI {
  trips: any;
  pendingTripRequests: any;
}

const Trips = ({ trips, pendingTripRequests }: TripsI) => {
  return (
    <div className="text-center flex justify-center itmes-center">
      {!trips?.length && !pendingTripRequests?.length ? (
        <div>
          <Image src={searchImg} height={300} width={300} alt="search image" />

          <h3 className="mt-3">No se encontraron viajes activos</h3>
        </div>
      ) : (
        <>
          {/* {trips.length && <Trips />} */}
          {pendingTripRequests?.length && (
            <TripRequests trips={pendingTripRequests} />
          )}
        </>
      )}
    </div>
  );
};

export default Trips;
