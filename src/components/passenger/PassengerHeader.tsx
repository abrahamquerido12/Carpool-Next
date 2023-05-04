import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import IconButton from '@mui/material/IconButton';
import { signOut } from 'next-auth/react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import React from 'react';

const PassengerHeader = () => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    signOut();
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
        <MenuItem onClick={() => router.push('/passenger/search-trips')}>
          <SearchOutlinedIcon fontSize="small" className="text-cxBlue mr-2" />
          Buscar Viajes
        </MenuItem>
        <MenuItem onClick={handleSignout}>
          <ExitToAppOutlinedIcon
            fontSize="small"
            className="text-cxBlue mr-2"
          />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PassengerHeader;
