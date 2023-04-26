/* eslint-disable no-unused-vars */
import Autocomplete from '@mui/material/Autocomplete';

import TextField from '@mui/material/TextField';
import { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { place } from '../../types/trips';

interface Props {
  place: place;

  // eslint-disable-next-line no-unused-vars
  onChange: (value: place) => void;

  placeholder?: string;
  disabled?: boolean;
}

const GooglePlaces = ({ place, onChange, placeholder, disabled }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const [places, setPlaces] = useState([]);

  const {
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: 'MX',
      },
    },
  });

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleSearch = (e: any) => {
    if (!e) return;
    setSearchValue(e.target.value);
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log('📍 Coordinates: ', { lat, lng });

        onChange({
          description,
          latitude: lat,
          longitude: lng,
        });
      });
    };

  const flatPlaces = data.map((item) => item.description);

  return (
    <div ref={ref} className="w-full">
      <Autocomplete
        disabled={disabled}
        disablePortal
        id="combo-box-demo"
        options={flatPlaces}
        sx={{ width: 300 }}
        onChange={(event: any, newValue: string | null) => {
          handleSelect({
            description: newValue as string,
          })();
        }}
        onInputChange={(event, newInputValue) => {
          handleSearch(event);
        }}
        value={place?.description}
        className="w-full"
        placeholder={placeholder || 'Buscar dirección'}
        defaultValue={place?.description}
        renderInput={(params) => <TextField {...params} className="w-full" />}
      />
    </div>
  );
};

export default GooglePlaces;
