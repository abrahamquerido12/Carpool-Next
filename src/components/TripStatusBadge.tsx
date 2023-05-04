import Chip from '@mui/material/Chip';

interface TripsStatusBadgeI {
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
}

const TripStatusBadge = ({ status }: TripsStatusBadgeI) => {
  const label = () => {
    if (status === 'ACCEPTED') return 'Aceptado';
    if (status === 'PENDING') return 'Pendiente';
    return 'Rechazado';
  };

  const color = () => {
    if (status === 'ACCEPTED') return 'success';
    if (status === 'PENDING') return 'default';
    return 'error';
  };

  return <Chip className="rounded-md" label={label()} color={color()} />;
};

export default TripStatusBadge;
