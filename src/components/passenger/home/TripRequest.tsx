import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

import dayjs from 'dayjs';
import TripStatusBadge from '../../TripStatusBadge';

interface Props {
  trip: any;
  // eslint-disable-next-line no-unused-vars
  onClick: (trip: any) => void;
}

const TripRequest = ({ trip, onClick }: Props) => {
  const departureTime = dayjs(trip.departureTime).format('HH:mm');
  const weeklyTrip = trip?.trip?.weeklyTrip;

  const distance = () => {
    if (trip.origin === 'CETI') {
      return trip.distanceToDestination > 1000
        ? `${trip.distanceToDestination / 1000} km`
        : `${trip.distanceToDestination} m`;
    } else {
      return trip.distanceToOrigin > 1000
        ? `${trip.distanceToOrigin / 1000} km`
        : `${trip.distanceToOrigin} m`;
    }
  };

  const walkingTime =
    trip.origin === 'CETI'
      ? Math.round(trip.distanceToDestination / 1.39)
      : Math.round(trip.distanceToOrigin / 1.39);

  const walkingTimeFormatted =
    walkingTime > 3600
      ? `${Math.floor(walkingTime / 60)}
      hrs y ${walkingTime % 60} min`
      : `${Math.round(walkingTime / 60)} min`;

  return (
    <div
      onClick={onClick}
      className="flex items-center  w-full rounded-lg bg-white p-2 shadow-md hover:shadow-lg transition-all border-2 border-gray-100 my-2 select-none  hover:cursor-pointer"
    >
      <div className="flex flex-col w-full pl-2">
        <div className="flex items-center justify-start w-full ">
          <MapOutlinedIcon className="mr-1" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[8rem] font-medium">
            {weeklyTrip.origin}
          </p>
          <ArrowRightAltIcon className="mx-2" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap  font-medium max-w-[8rem]">
            {weeklyTrip.destination}
          </p>
          <div className="ml-auto">
            <TripStatusBadge status={'PENDING'} />
          </div>
        </div>
        <div className="flex items-start justify-start w-full">
          <p className="opacity-80 flex items-center justify-start mr-3 text-md mt-2">
            {' '}
            <AccessTimeIcon className="mr-1 text-[1.2rem]" />
            {departureTime}
          </p>
          <p className="opacity-80 flex items-center justify-start mr-3 text-md mt-2">
            {' '}
            <DirectionsWalkOutlinedIcon className="mr-1 text-[1.2rem]" />
            {distance()} ({walkingTimeFormatted})
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripRequest;
