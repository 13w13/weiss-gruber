import { Html, Head, Main, NextScript } from "next/document";
import { IMAGE_BASE_URL } from '@/lib/images';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnects */}
        <link rel="preconnect" href={IMAGE_BASE_URL} crossOrigin="anonymous" />

        {/* Meta tags communs ; titre, description et image sont définis page par page (PageMeta) */}
        <meta property="og:site_name" content="Weiss Gruber" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
