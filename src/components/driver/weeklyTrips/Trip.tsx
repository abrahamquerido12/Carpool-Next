import dayjs from 'dayjs';

interface Props {
  trip: {
    origin: string;
    destination: string;
    departureTime: string;
  };
}

const Trip = ({ trip }: Props) => {
  const departureTime = dayjs(trip.departureTime).format('DD/MM/YYYY HH:mm');

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-cxBlue rounded-full"></div>
        <p>{trip.origin}</p>
        <p>{trip.destination}</p>
      </div>
      <p>{departureTime}</p>
    </div>
  );
};

export default Trip;
