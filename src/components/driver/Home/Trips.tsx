import requestImage from '@/../public/request.svg';
import Image from 'next/image';
import TripRequests from '../tripRequests/TripRequests';
interface TripsProps {
  trips: Trip[] | null;
}

const Trips = ({ trips }: TripsProps) => {
  const navigateToTripDetail = () => {};

  if (!trips?.length)
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
    <TripRequests trips={trips} onClick={navigateToTripDetail}></TripRequests>
  );
};

export default Trips;
