import Trip from './Trip';

const TripRequests = ({ trips }: { trips: any }) => {
  return (
    <div>
      <span>Solicitudes de viaje</span>
      {trips.map((trip: any) => (
        <Trip trip={trip} key={trip.id}></Trip>
      ))}
    </div>
  );
};

export default TripRequests;
