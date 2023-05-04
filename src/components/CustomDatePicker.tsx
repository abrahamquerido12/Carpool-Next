import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';

interface Props {
  value: dayjs.Dayjs;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: dayjs.Dayjs) => void;
}

export default function CustomDatePicker({ value, onChange }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        defaultValue={dayjs(new Date())}
        value={value}
        onChange={(newValue) => onChange(newValue as dayjs.Dayjs)}
      />
    </LocalizationProvider>
  );
}
