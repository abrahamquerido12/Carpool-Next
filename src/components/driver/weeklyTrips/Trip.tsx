import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import dayjs from 'dayjs';

interface Props {
  trip: {
    origin: string;
    destination: string;
    departureTime: string;
  };
}

const Trip = ({ trip }: Props) => {
  const departureTime = dayjs(trip.departureTime).format('HH:mm');

  return (
    <div className="flex items-center my-2 w-full">
      <div className="w-2 h-2 bg-cxBlue rounded-full "></div>

      <div className="flex flex-col w-full pl-2">
        <div className="flex items-center justify-start w-full ">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem] font-medium">
            {trip.origin}
          </p>
          <ArrowRightAltIcon className="mx-2" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap  font-medium max-w-[10rem]">
            {trip.destination}
          </p>
        </div>
        <p className="opacity-80">{departureTime}</p>
      </div>
    </div>
  );
};

export default Trip;
