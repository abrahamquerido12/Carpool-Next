import CustomAccordion from '../../CustomAccordion';
import AddWeeklyTrip from './AddTrip';
import Trip from './Trip';

interface Props {
  title: string;
  trips: any[];
}

const Day = ({ title, trips }: Props) => {
  const renderTrips = () => {
    if (!trips?.length) return <p>No hay viajes para este día</p>;
    return trips.map((trip, index) => {
      return <Trip key={index} trip={trip} />;
    });
  };

  return (
    <CustomAccordion title={title}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">{renderTrips()}</div>
      </div>

      <AddWeeklyTrip day={title} />
    </CustomAccordion>
  );
};

export default Day;
