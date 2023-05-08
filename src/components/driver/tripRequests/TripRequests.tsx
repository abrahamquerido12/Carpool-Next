import Trip from './Trip';

const TripRequests = ({ tripRequests }: { tripRequests: any }) => {
  return (
    <div className="w-full ">
      <div className="w-full flex justify-between">
        <h2 className="w-full text-start font-semibold opacity-60">
          Solicitudes de viaje pendientes
        </h2>

        {/* <Link href={'/driver/trips/trip-requests'}>
          <span className="text-blue-600 text-sm cursor-pointer whitespace-nowrap">
            Ver todas
          </span>
        </Link> */}
      </div>
      {tripRequests.map((tripRequest: any) => (
        <Trip tripRequest={tripRequest} key={tripRequest.id}></Trip>
      ))}
    </div>
  );
};

export default TripRequests;
