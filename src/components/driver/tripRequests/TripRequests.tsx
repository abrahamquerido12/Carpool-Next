import Trip from './Trip';

const TripRequests = ({ trips, onClick }) => {
  return (
    <div>
      <span>Solicitudes de viaje</span>
      {trips.map((trip) => (
        <Trip trip={trip} onClick={onClick} key={trip.id}></Trip>
      ))}
    </div>
  );
};

export default TripRequests;
