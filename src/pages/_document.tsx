import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  return (
    <Html lang="en">
      <Head>
        {/* 
      eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          type="text/javascript"
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places `}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
