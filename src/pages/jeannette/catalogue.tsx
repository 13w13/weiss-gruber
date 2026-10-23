import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ArrowUp, ArrowDown, Camera, X } from 'lucide-react';
import { GetStaticProps } from 'next';
import { Vitrail } from '@/types/images';
import { IMAGE_BASE_URL } from '@/lib/images';
import { s3ImageLoader } from '@/lib/imageLoader';
import { getWorks } from '@/lib/works';
import { toLocale, useT } from '@/i18n';
import { decadeOf, matchesQuery } from '@/lib/text';
import PageMeta from '@/components/layout/PageMeta'
import OtherVitrailLink from '@/components/layout/OtherVitrailLink'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'

export default function CatalogueRaisonne({ works }: { works: Vitrail[] }) {
  const t = useT();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc'); // Par défaut croissant (plus ancien)
  const [selectedDecades, setSelectedDecades] = useState<number[]>([]);
  const [buildingType, setBuildingType] = useState('');

  const decades = useMemo(
    () => Array.from(new Set(works.map((w) => decadeOf(w.year)).filter((d): d is number => d !== undefined))).sort((a, b) => a - b),
    [works],
  );
  const buildingTypes = useMemo(
    () => Array.from(new Set(works.map((w) => w.building_type).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr')),
    [works],
  );

  // Recherche sans accents sur tous les champs utiles, puis filtres décennie et type d'édifice
  const filteredWorks = works.filter((work) => {
    const d = decadeOf(work.year);
    if (selectedDecades.length && (d === undefined || !selectedDecades.includes(d))) return false;
    if (buildingType && work.building_type !== buildingType) return false;
    return matchesQuery(searchTerm, [
      work.title_fr, work.year, work.city, work.building_name, work.building_type,
      work.department, work.location_in_building, work.text_fr,
    ]);
  });

  // Tri par année
  const sortedWorks = [...filteredWorks].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
  });

  const filtering = searchTerm.trim() !== '' || selectedDecades.length > 0 || buildingType !== '';
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDecades([]);
    setBuildingType('');
  };
  const toggleDecade = (d: number) =>
    setSelectedDecades((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  // Fonction pour compter les photos (image principale + galerie)
  const getPhotoCount = (work: Vitrail) => 1 + (work.gallery_images?.length || 0);

  // Compter le nombre d'édifices uniques
  const uniqueBuildings = new Set(works.map(w => w.building_name)).size;
  const firstYear = works[0]?.year;
  const lastYear = works[works.length - 1]?.year;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <PageMeta
        title={t.catalogue.metaTitle}
        description={t.catalogue.metaDescription(works.length, firstYear, lastYear, uniqueBuildings)}
        path="/jeannette/catalogue"
      />
      <SiteHeader />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-light mb-4 md:mb-6 text-center">{t.catalogue.title}</h1>

          {/* Texte explicatif */}
          <div className="max-w-3xl mx-auto mb-6 md:mb-10 text-center">
            <p className="hidden sm:block text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              {t.catalogue.intro}
            </p>
            <p className="text-xs md:text-sm text-gray-600 italic">
              {t.catalogue.disclaimer}
            </p>
            <OtherVitrailLink className="mt-3" />
          </div>

          {/* Recherche, filtres et tri */}
          <div className="mb-6 md:mb-8 max-w-4xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder={t.catalogue.searchPlaceholder}
                  aria-label={t.catalogue.searchLabel}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md pl-10 text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              </div>

              <div className="flex gap-3">
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  aria-label={t.catalogue.buildingTypeLabel}
                  className="flex-1 sm:flex-none h-11 px-3 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="">{t.catalogue.allBuildings}</option>
                  {buildingTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center gap-2 h-11 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                  title={sortOrder === 'desc' ? t.catalogue.sortToOldest : t.catalogue.sortToNewest}
                >
                  {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  <span className="text-sm">{sortOrder === 'desc' ? t.catalogue.newest : t.catalogue.oldest}</span>
                </button>
              </div>
            </div>

            <div className="-mx-4 px-4 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap sm:justify-center" role="group" aria-label={t.catalogue.decadeFilter}>
                {decades.map((d) => {
                  const active = selectedDecades.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleDecade(d)}
                      className={`px-3 h-9 rounded-full border text-sm transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {d}s
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compteur de résultats */}
            <div className="flex justify-center items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700" aria-live="polite">
                {!filtering ? (
                  <span><strong>{uniqueBuildings}</strong> {t.common.buildings(uniqueBuildings)} • <strong>{works.length}</strong> {t.common.works(works.length)}</span>
                ) : (
                  <span>{t.catalogue.results(sortedWorks.length, works.length)}</span>
                )}
              </div>
              {filtering && (
                <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 h-9 px-3 text-sm text-gray-700 hover:text-blue-700">
                  <X className="w-4 h-4" /> {t.catalogue.clear}
                </button>
              )}
            </div>
          </div>

          {sortedWorks.length === 0 ? (
            <p className="text-center text-gray-600 py-12">{t.catalogue.empty}</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {sortedWorks.map((work) => (
                <Link key={work.id} href={`/jeannette/catalogue/${work.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-36 sm:h-64 bg-gray-200">
                    <Image
                      src={`${IMAGE_BASE_URL}/vitraux/${work.main_image}`}
                      alt={work.title_fr}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                      loader={s3ImageLoader}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                      <h2 className="text-sm sm:text-xl font-semibold flex-1 leading-snug">{work.title_fr}</h2>
                      {/* Badge nombre de photos sur le titre */}
                      <div className="hidden sm:flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{getPhotoCount(work)}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-base text-gray-600">{work.year}</p>
                    <p className="text-xs sm:text-base text-gray-600">{`${work.building_name}, ${work.city}`}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

// getStaticProps lit les données du fichier CSV au moment de la construction
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      works: getWorks(toLocale(locale)),
    },
  };
};
