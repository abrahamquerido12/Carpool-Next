import requestImage from '@/../public/request.svg';
import { Trip } from '@prisma/client';
import Image from 'next/image';
interface TripsProps {
  trips: Trip[] | null;
}

const Trips = ({ trips }: TripsProps) => {
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
    <div>
      <h1>Trips</h1>
    </div>
  );
};

export default Trips;
