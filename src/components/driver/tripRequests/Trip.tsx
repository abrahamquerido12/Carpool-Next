import { weekdays } from '@/lib/helpers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

const Trip = ({ trip, onClick }) => {
  const { weeklyTrip } = trip;

  const weekday = `${
    weekdays.find((day) => day.value === weeklyTrip.dayOfWeek)?.label
  } `;

  const departureDate = new Date(weeklyTrip.departureTime).toLocaleDateString(
    'es-MX',
    { day: 'numeric', month: 'long' }
  );

  const time = new Date(weeklyTrip.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const title = `${weekday} ${departureDate},  ${time}`;

  // de donde a donde
  return (
    <div
      onClick={onClick}
      className="flex items-center  w-full rounded-lg bg-white p-2 shadow-md hover:shadow-lg transition-all border-2 border-gray-100 my-2 select-none  hover:cursor-pointer"
    >
      <div className="flex flex-col w-full pl-2">
        <div className="flex items-center justify-start w-full ">
          <p className="overflow-hidden whitespace-nowrap max-w-[10rem]  opacity-80">
            <CalendarMonthIcon className="mr-1  text-[1.2rem]" />
            {title}
          </p>
        </div>
        <div className="flex items-center justify-start w-full ">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem] opacity-80">
            <AccessTimeIcon className="mr-1 text-[1.2rem]" />
            {time}
          </p>
        </div>
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
      </div>
    </div>
  );
};

export default Trip;
