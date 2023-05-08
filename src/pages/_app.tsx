import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React, { useCallback, useMemo } from 'react';
import CustomToast, { severity } from '../components/CustomToast';

interface ToastContextI {
  openToast: (
    // eslint-disable-next-line no-unused-vars
    message: string,
    // eslint-disable-next-line no-unused-vars
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void;
}

export const UseToastContext = React.createContext<ToastContextI>({
  openToast: () => {},
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');

  const handleClose = () => {
    setOpen(false);
  };

  const openToast = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    },
    []
  );

  const values = useMemo(() => ({ openToast }), [openToast]);

  return (
    <SessionProvider session={session}>
      <UseToastContext.Provider value={values}>
        <Component {...pageProps} />
        <CustomToast
          handleClose={handleClose}
          message={message}
          severity={severity as severity}
          open={open}
        />
      </UseToastContext.Provider>
    </SessionProvider>
  );
}
