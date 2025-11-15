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
        
        {/* Meta tags */}
        <meta name="description" content="Site dédié à Jeannette Weiss-Gruber, peintre-verrier française. Catalogue raisonné de ses créations de vitraux." />
        <meta property="og:title" content="Jeannette Weiss-Gruber - Peintre-verrier" />
        <meta property="og:description" content="Catalogue raisonné des œuvres de Jeannette Weiss-Gruber, peintre-verrier française" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
