import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function CustomCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
