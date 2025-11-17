import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnects */}
        <link rel="preconnect" href="https://weiss-gruber-jeanette.s3.fr-par.scw.cloud" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://xrarrp4wrvauwge7.public.blob.vercel-storage.com" crossOrigin="anonymous" />

        {/* Meta tags */}
        <meta name="description" content="Explorer les réalisations de la peintre-verrier Jeannette Weiss Gruber" />
        <meta property="og:title" content="Jeannette Weiss Gruber - Peintre-verrier" />
        <meta property="og:description" content="Explorer les réalisations de la peintre-verrier Jeannette Weiss Gruber" />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Weiss Gruber" />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
