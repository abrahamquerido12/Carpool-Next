import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type severity = 'success' | 'error' | 'info' | 'warning';

interface CustomToastProps {
  severity: severity;
  message: string;
  open: boolean;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export default function CustomToast(props: CustomToastProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={props.open}
      autoHideDuration={3000}
      onClose={props.handleClose}
    >
      <Alert
        onClose={props.handleClose}
        severity={props.severity}
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
