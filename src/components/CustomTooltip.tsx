import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  title: string;
  customClass?: string;
}

const CustomTooltip = ({ title, customClass }: Props) => {
  return (
    <Tooltip title={title}>
      <InfoOutlinedIcon className={customClass} />
    </Tooltip>
  );
};

export default CustomTooltip;
