import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface FilteredSelectProps {
  options: string[];
  label: string;

  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function FilteredSelect(props: FilteredSelectProps) {
  return (
    <Autocomplete
      disabled={props.disabled}
      disablePortal
      id="combo-box-demo"
      options={props.options}
      renderInput={(params) => (
        <TextField {...params} label={props.label} disabled={props.disabled} />
      )}
      onChange={(event, value) => props.onChange(value as string)}
    />
  );
}
