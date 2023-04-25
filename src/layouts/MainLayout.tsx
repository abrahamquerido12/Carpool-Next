import React from 'react';
import CustomToast, { severity } from '../components/CustomToast';

interface ToastContextI {
  openToast: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void;
}

export const UseToastContext = React.createContext<ToastContextI>({
  openToast: () => {},
});

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');

  const handleClose = () => {
    setOpen(false);
  };

  const openToast = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-10 px-4 bg-white">
      <UseToastContext.Provider value={{ openToast }}>
        {children}
      </UseToastContext.Provider>
      <CustomToast
        handleClose={handleClose}
        message={message}
        severity={severity as severity}
        open={open}
      />
    </main>
  );
};

export default MainLayout;
