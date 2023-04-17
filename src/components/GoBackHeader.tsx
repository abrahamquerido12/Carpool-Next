// add left arrow icon from mui icons

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton } from '@mui/material';

interface Props {
  onClick: () => void;
}

const GoBackHeader = ({ onClick }: Props) => {
  return (
    <div className="flex items-center justify-between w-full ">
      <IconButton onClick={onClick} color="inherit" aria-label="back">
        <KeyboardBackspaceIcon />
      </IconButton>
    </div>
  );
};

export default GoBackHeader;
