import Link from 'next/link';
import { CONTACT_EMAIL, NAV_ITEMS } from '@/lib/site';
import { useT } from '@/i18n';
import ViewCounter from './ViewCounter';

export default function SiteFooter() {
  const t = useT();
  return (
    <footer className="bg-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm space-y-3">
        <nav aria-label={t.nav.footerLabel}>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-blue-700">{t.nav[item.key]}</Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-blue-700">{t.nav.contact}</a>
            </li>
          </ul>
        </nav>
        <p>&copy; {new Date().getFullYear()} Weiss Gruber. {t.nav.rights}</p>
        <ViewCounter />
      </div>
    </footer>
  );
}
