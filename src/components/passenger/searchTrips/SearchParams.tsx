import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';
import TripOriginOutlinedIcon from '@mui/icons-material/TripOriginOutlined';

interface Props {
  origin: string;
  destination: string;
  departureTime: string;
  date: string;
}

const SearchParams = ({
  origin,

  destination,
  departureTime,

  date,
}: Props) => {
  const formattedDTime = new Date(departureTime).toLocaleTimeString(
    'es-ES',

    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }
  );

  // formate date to weekday dd/mm
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <div
      className="flex w-full flex-col my-3 border-b-2 border-gray-300 pb-3
    
    
    "
    >
      <h2 className="mb-2 text-xl font-bold opacity-50 ">Resultados para:</h2>
      <div className="w-full flex items-center my-1 opacity-50">
        <TripOriginOutlinedIcon className="mr-1" />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]  ">
          {origin}
        </span>
        <SportsScoreOutlinedIcon className="mr-1 ml-4" />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]  ">
          {destination}
        </span>
      </div>
      <div className="w-full flex items-center my-1 opacity-50">
        <AccessTimeOutlinedIcon className="mr-1" />
        <span>{formattedDTime}</span>

        <EventOutlinedIcon className="mr-1 ml-4" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default SearchParams;
