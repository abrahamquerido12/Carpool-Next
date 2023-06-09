import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

import { getDateTitle, getFormattedDepartureTime } from '@/lib/helpers';
import TripStatusBadge from '../../../TripStatusBadge';

interface Props {
  trip: any;
  // eslint-disable-next-line no-unused-vars
  onClick: (trip: any) => void;
}

const TripRequest = ({ trip }: Props) => {
  const weeklyTrip = trip?.trip?.weeklyTrip;

  const time = getFormattedDepartureTime(weeklyTrip.departureTime);
  const title = getDateTitle(weeklyTrip.dayOfWeek, trip.searchedDateTime);

  return (
    <div className="flex items-center  w-full rounded-lg bg-white p-2 shadow-md hover:shadow-lg transition-all border-2 border-gray-100 my-2 select-none  hover:cursor-pointer">
      <div className="flex flex-col w-full pl-2">
        <div className="w-full flex justify-end">
          <div className="flex items-center justify-start w-full ">
            <MapOutlinedIcon className="mr-1 text-[1.2rem] opacity-80" />
            <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem] opacity-80">
              {weeklyTrip.origin}
            </p>
            <ArrowRightAltIcon className="mx-2 text-[1.2rem] opacity-80" />
            <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem] opacity-80">
              {weeklyTrip.destination}
            </p>
          </div>
          <div className="ml-auto">
            <TripStatusBadge status={'PENDING'} />
          </div>
        </div>
        <div className="flex items-center justify-start w-full ">
          <p className="overflow-hidden whitespace-nowrap   opacity-80">
            <CalendarMonthIcon className="mr-1  text-[1.2rem]" />
            {title}
          </p>
        </div>
        <div className="flex items-center justify-between w-full ">
          <p className="whitespace-nowrap opacity-80">
            <AccessTimeIcon className="mr-1 text-[1.2rem]" />
            {time}
          </p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default TripRequest;
