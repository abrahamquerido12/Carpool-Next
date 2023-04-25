import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import UserProvider from '../contexts/userCtx';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient} contextSharing>
      <SessionProvider session={session}>
        <Hydrate state={pageProps.dehydratedState}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </Hydrate>
      </SessionProvider>
    </QueryClientProvider>
  );
}
