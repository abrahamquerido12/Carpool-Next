import React from 'react';

import { TextField } from '@mui/material';

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCeti?: boolean;
  onCetiChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextOrCeti = ({ value, onChange, isCeti, onCetiChange }: Props) => {
  return (
    <div className="flex flex-row items-center justify-start w-full mt-2">
      <TextField
        variant="outlined"
        size="small"
        type="text"
        placeholder="Origen"
        className="w-[70%] mr-2"
        disabled={isCeti}
        value={value}
        onChange={(e) =>
          onChange && onChange(e as React.ChangeEvent<HTMLInputElement>)
        }
      />
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
