import TripRequest from './TripRequest';

const TripRequests = ({ trips }: { trips: any }) => {
  return (
    <div className="w-full">
      <h2 className="w-full text-start font-semibold opacity-60">
        Solicitudes de viaje
      </h2>
      {trips.map((trip: any) => (
        <TripRequest
          trip={trip}
          key={trip.id}
          onClick={() => console.log(trip.trip.weeklyTrip)}
        />
      ))}
    </div>
  );
};

export default TripRequests;
