import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  value: Dayjs;
  setValue: (value: Dayjs) => void;
}

const CustomTimePicker = ({ value, setValue }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        className="w-full"
        value={value || dayjs(new Date())}
        onChange={(newValue) => setValue(newValue as Dayjs)}
      />
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
