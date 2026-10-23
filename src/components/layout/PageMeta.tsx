import Head from 'next/head';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { LOCALES, localePrefix, useLocale } from '@/i18n';

const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

interface PageMetaProps {
  title: string;
  description: string;
  path: string; // chemin sans préfixe de langue, ex. /jeannette/catalogue
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

// Titre, description, URL canonique, versions linguistiques et aperçu de partage propres à chaque page
export default function PageMeta({ title, description, path, image, type = 'website', jsonLd }: PageMetaProps) {
  const locale = useLocale();
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${localePrefix(locale)}${path}`;
  const ogImage = image ?? DEFAULT_IMAGE;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${SITE_URL}${localePrefix(l)}${path}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${path}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'fr_FR'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      )}
    </Head>
  );
}
