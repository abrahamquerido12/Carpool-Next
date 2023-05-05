import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  title: string;
  description: string;
  open: boolean;
  handleClose: () => void;
  handleAgree: () => void;
  agreeText: string;
  disagreeText: string;
}

export default function AlertDialog({
  title,
  description,
  open,
  handleClose,
  agreeText,
  disagreeText,
  handleAgree,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{disagreeText}</Button>
        <Button onClick={handleAgree} autoFocus>
          {agreeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
