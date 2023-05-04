/* eslint-disable no-unused-vars */
import React from 'react';

import { place } from '../../types/trips';
import GooglePlaces from './GooglePlaces';

interface Props {
  value: place;
  onChange: (value: place) => void;
  isCeti?: boolean;
  onCetiChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextOrCeti = ({ value, onChange, isCeti, onCetiChange }: Props) => {
  return (
    <div className="flex flex-row items-center justify-start w-full mt-2">
      <div className="w-[70%] mr-2">
        <GooglePlaces
          placeholder="Origen"
          place={value}
          onChange={onChange}
          disabled={isCeti}
        />
      </div>

      <div className="flex flex-row items-center justify-center w-[20%]">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-200 rounded-md"
          checked={isCeti}
          onChange={(e) => onCetiChange && onCetiChange(e)}
        />
        <span className="text-gray-500 ml-2">CETI</span>
      </div>
    </div>
  );
};

export default TextOrCeti;
