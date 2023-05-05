import { weekdays } from '@/lib/helpers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { useRouter } from 'next/router';

const Trip = ({ trip }) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/driver/trips/trip-requests/${trip.id}`);
  };

  const weekday = `${
    weekdays.find((day) => day.value === trip.dayOfWeek)?.label
  } `;

  const departureDate = new Date(trip.departureTime).toLocaleDateString(
    'es-MX',
    { day: 'numeric', month: 'long' }
  );

  const time = new Date(trip.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const title = `${weekday} ${departureDate}`;

  // de donde a donde
  return (
    <div
      onClick={onClick}
      className="flex items-center  w-full rounded-lg bg-white p-2 shadow-md hover:shadow-lg transition-all border-2 border-gray-100 my-2 select-none  hover:cursor-pointer"
    >
      <div className="flex flex-col w-full pl-2">
        <div className="flex items-center justify-start w-full ">
          <MapOutlinedIcon className="mr-1 text-[1.2rem] opacity-80" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem] opacity-80">
            {trip.origin}
          </p>
          <ArrowRightAltIcon className="mx-2 text-[1.2rem] opacity-80" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem] opacity-80">
            {trip.destination}
          </p>
        </div>
        <div className="flex items-center justify-start w-full ">
          <p className="overflow-hidden whitespace-nowrap max-w-[10rem]  opacity-80">
            <CalendarMonthIcon className="mr-1  text-[1.2rem]" />
            {title}
          </p>
        </div>
        <div className="flex items-center justify-between w-full ">
          <p className="whitespace-nowrap opacity-80">
            <AccessTimeIcon className="mr-1 text-[1.2rem]" />
            {time}
          </p>

          <div className="w-full flex justify-end">
            <button
              className="bg-cxBlue text-white font-semibold text-sm py-2 px-5 flex justify-center items-center  rounded"
              onClick={onClick}
            >
              Ver más
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Trip;