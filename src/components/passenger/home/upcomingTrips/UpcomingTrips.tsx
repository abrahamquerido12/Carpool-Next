import UpcomingTrip from './UpcomingTrip';

interface Props {
  upcomingTrips: any;
}

const UpcomingTrips = ({ upcomingTrips }: Props) => {
  console.log(upcomingTrips.length);

  return (
    <div className="w-full flex-col">
      <h2 className="w-full text-start font-semibold opacity-60">
        Próximos viajes
      </h2>

      {upcomingTrips.length ? (
        upcomingTrips.map((trip: any) => (
          <UpcomingTrip key={trip.id} trip={trip} />
        ))
      ) : (
        <span>No hay futuros viajes</span>
      )}
    </div>
  );
};

export default UpcomingTrips;
