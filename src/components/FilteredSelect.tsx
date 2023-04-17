import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface FilteredSelectProps {
  options: string[];
  label: string;

  value: string | null;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function FilteredSelect(props: FilteredSelectProps) {
  return (
    <Autocomplete
      disabled={props.disabled}
      disablePortal
      id="combo-box-demo"
      value={props.value}
      options={props.options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          disabled={props.disabled}
          value={props.value}
        />
      )}
      onChange={(event, value) => props.onChange(value as string)}
    />
  );
}
