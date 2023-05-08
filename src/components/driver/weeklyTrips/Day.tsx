import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { deleteTrip } from '../../../lib/api/driverReqs';
import { englishToSpanishWeekdays } from '../../../lib/helpers';
import { UseToastContext } from '../../../pages/_app';
import { WeeklyTripsContext } from '../../../pages/driver/weekly-trips';
import CustomButton from '../../Button';
import CustomAccordion from '../../CustomAccordion';
import CustomBackdrop from '../../CustomBackdrop';
import CustomDialog from '../../CustomFormDialog';
import AddWeeklyTrip from './AddTrip';
import Trip from './Trip';

interface Props {
  title: string;
  trips: any[];
  dayVal: string;
  isLoading: boolean;
}

const Day = ({ title, trips, dayVal, isLoading }: Props) => {
  const { openToast } = useContext(UseToastContext);
  const { refreshData } = useContext(WeeklyTripsContext);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTripDelete = async (trip: any) => {
    setSelectedTrip(trip);
    setIsDeleting(true);
  };

  const handleOnClose = () => {
    setIsDeleting(false);
    setSelectedTrip(null);
  };

  const handleTripDeleteConfirm = async () => {
    setLoading(true);
    const tripId = selectedTrip?.id;
    if (!tripId) return;
    const res = await deleteTrip(tripId);
    if (res.status === 200) {
      openToast('Viaje eliminado', 'success');
      refreshData();
      setIsDeleting(false);
      setSelectedTrip(null);
      setLoading(false);
    } else {
      openToast('Error al eliminar el viaje', 'error');
      setIsDeleting(false);
      setSelectedTrip(null);
      setLoading(false);
    }
  };

  const renderTrips = () => {
    if (!trips?.length) return <p>No hay viajes para este día</p>;
    return trips.map((trip, index) => {
      return (
        <div key={index} className="w-full flex justify-between items-center">
          <Trip trip={trip} />
          <DeleteOutlineIcon
            className="opacity-60"
            onClick={() => handleTripDelete(trip)}
          />
        </div>
      );
    });
  };

  return (
    <CustomAccordion title={title}>
      <div className="flex items-start flex-col ">
        {isLoading ? <Skeleton width="100%" height={100} /> : renderTrips()}
      </div>

      <AddWeeklyTrip day={title} dayVal={dayVal} />
      <CustomDialog onClose={handleOnClose} open={isDeleting}>
        <div className="p-5 text-center">
          <h1 className="text-2xl text-center text-cxBlue font-semibold mb-3">
            ¿Deseas eliminar el viaje?
          </h1>

          {/* Trips details */}
          <div className="flex flex-col w-full">
            <h2 className="text-xl mb-3 text-center font-semibold">
              {englishToSpanishWeekdays(selectedTrip?.dayOfWeek)}
            </h2>
            <div className="flex justify-center items-center">
              <p className="text-lg text-center overflow-hidden text-ellipsis whitespace-nowrap w-[6rem] font-semibold">
                {selectedTrip?.origin}
              </p>
              <ArrowRightAltIcon className="text-cxBlue text-2xl mx-2 " />
              <p className="text-lg text-center overflow-hidden text-ellipsis whitespace-nowrap w-[6rem] font-semibold  ">
                {selectedTrip?.destination}
              </p>
            </div>

            <p className="text-lg text-center opacity-70 mt-2 font-semibold">
              {dayjs(selectedTrip?.departureTime).format('HH:mm')}
            </p>
          </div>

          <div className="flex justify-between items-center mt-10">
            <div className="w-full p-2">
              <CustomButton variant="secondary" onClick={handleOnClose}>
                Cancelar
              </CustomButton>
            </div>
            <div className="w-full p-2">
              <CustomButton variant="primary" onClick={handleTripDeleteConfirm}>
                Si, eliminar
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomDialog>
      <CustomBackdrop open={loading} />
    </CustomAccordion>
  );
};

export default Day;
