// backdrop from mui

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface Props {
  open: boolean;
}

const CustomBackdrop: React.FC<Props> = ({ open }) => {
  return (
    <Backdrop
      open={open}
      className="z-1400"
      style={{
        zIndex: 1400,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CustomBackdrop;
