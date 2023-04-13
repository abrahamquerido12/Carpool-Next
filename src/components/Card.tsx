import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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
