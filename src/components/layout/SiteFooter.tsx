import Link from 'next/link';
import { CONTACT_EMAIL, NAV_ITEMS } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm space-y-3">
        <nav aria-label="Liens du pied de page">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-blue-700">{item.label}</Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-blue-700">Contact</a>
            </li>
          </ul>
        </nav>
        <p>&copy; {new Date().getFullYear()} Weiss Gruber. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
