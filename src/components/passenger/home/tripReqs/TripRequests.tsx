import TripRequest from './TripRequest';

const TripRequests = ({ trips }: { trips: any }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <h2 className="w-full text-start font-semibold opacity-60">
        Solicitudes de viaje
      </h2>
      {trips.length ? (
        trips.map((trip: any) => (
          <TripRequest
            trip={trip}
            key={trip.id}
            onClick={() => console.log(trip.trip.weeklyTrip)}
          />
        ))
      ) : (
        <span className="text-md opacity-50">No hay solicitudes</span>
      )}
    </div>
  );
};

export default TripRequests;
