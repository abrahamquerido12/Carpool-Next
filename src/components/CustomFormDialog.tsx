// custom dialog based on mui

import * as React from 'react';

import Dialog from '@mui/material/Dialog';

export interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomDialog = ({ open, onClose, children }: CustomDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
};

export default CustomDialog;
