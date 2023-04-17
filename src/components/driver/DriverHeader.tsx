import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import IconButton from '@mui/material/IconButton';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import React from 'react';

const DriverHeader = () => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-full flex justify-end items-center">
      {/* icon button mui */}

      <IconButton onClick={handleClick}>
        <AccountCircleOutlinedIcon fontSize="large" className="text-cxBlue" />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => router.push('/driver/weekly-trips')}>
          <EventRepeatIcon fontSize="small" className="text-cxBlue mr-2" />
          Viajes semanales
        </MenuItem>
        <MenuItem onClick={() => router.push('/driver/add-car')}>
          <DirectionsCarFilledOutlinedIcon
            fontSize="small"
            className="text-cxBlue mr-2"
          />
          Mi vehículo
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DriverHeader;
