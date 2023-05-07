import UpcomingTrip from './UpcomingTrip';

interface Props {
  upcomingTrips: any;
}

const UpcomingTrips = ({ upcomingTrips }: Props) => {
  return (
    <div className="w-full flex-col items-start flex my-2">
      <h2 className="w-full text-start font-semibold opacity-60">
        Próximos viajes
      </h2>

      {upcomingTrips.length ? (
        upcomingTrips.map((trip: any) => (
          <UpcomingTrip key={trip.id} trip={trip} />
        ))
      ) : (
        <span className="text-md opacity-50 text-start">
          No hay futuros viajes
        </span>
      )}
    </div>
  );
};

export default UpcomingTrips;
