import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const content = {
    nav: { home: "Home", biography: "Biography", catalogue: "Catalogue Raisonné", map: "Map" },
    familyMembers: { title: "Family Artists", jeannette: "Jeannette Weiss Gruber", frederic: "Frédéric Weiss", camille: "Camille Weiss" },
  };

  const t = content;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold mr-6">
            Weiss-Gruber
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              Jeannette Weiss Gruber
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 mt-1">
                <Link href="/jeannette" className="block px-4 py-2 hover:bg-gray-100">{t.familyMembers.jeannette}</Link>
                <Link href="/frederic" className="block px-4 py-2 hover:bg-gray-100">{t.familyMembers.frederic}</Link>
                <Link href="/camille" className="block px-4 py-2 hover:bg-gray-100">{t.familyMembers.camille}</Link>
              </div>
            )}
          </div>
        </div>
        <ul className="flex space-x-6">
          <li><Link href="/jeannette" className="hover:text-blue-600 transition-colors">{t.nav.home}</Link></li>
          <li><Link href="/jeannette/biography" className="hover:text-blue-600 transition-colors">{t.nav.biography}</Link></li>
          <li><Link href="/jeannette/catalogue" className="text-blue-600">{t.nav.catalogue}</Link></li>
          <li><Link href="/jeannette/carte" className="hover:text-blue-600 transition-colors">{t.nav.map}</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;