import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import React, { useCallback, useMemo, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import CustomToast, { severity } from '../components/CustomToast';
import UserProvider from '../contexts/userCtx';

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
  const [queryClient] = useState(() => new QueryClient());

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
    <QueryClientProvider client={queryClient} contextSharing>
      <SessionProvider session={session}>
        <Hydrate state={pageProps.dehydratedState}>
          <UserProvider>
            <UseToastContext.Provider value={values}>
              <Component {...pageProps} />
              <CustomToast
                handleClose={handleClose}
                message={message}
                severity={severity as severity}
                open={open}
              />
            </UseToastContext.Provider>
          </UserProvider>
        </Hydrate>
      </SessionProvider>
    </QueryClientProvider>
  );
}
