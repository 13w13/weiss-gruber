import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { Vitrail } from '@/types/images';
import { getWorks } from '@/lib/works';
import { toLocale, useT } from '@/i18n';
import PageMeta from '@/components/layout/PageMeta'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

const ArtworksMap = dynamic(() => import('@/components/map/ArtworksMap'), {
  ssr: false,
  loading: () => <div className="h-[55vh] md:h-[65vh] rounded-xl bg-gray-100 animate-pulse" />,
});

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return { props: { works: getWorks(toLocale(locale)) } };
};

export default function Carte({ works }: { works: Vitrail[] }) {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <PageMeta
        title={t.map.metaTitle}
        description={t.map.metaDescription}
        path="/jeannette/carte"
      />
      <SiteHeader />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-light mb-2">{t.map.title}</h1>
          <p className="text-gray-600 mb-5">
            {t.map.intro}
            <span className="block mt-1 text-sm text-gray-500">
              {t.map.legend}
            </span>
          </p>

          <ArtworksMap works={works} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
