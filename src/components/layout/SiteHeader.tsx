import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, SITE_NAME } from '@/lib/site';

function isActive(pathname: string, href: string) {
  return href === '/jeannette' ? pathname === href : pathname.startsWith(href);
}

export default function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Ferme le menu mobile à chaque navigation et avec la touche Échap
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1100] bg-white/95 backdrop-blur border-b border-gray-200">
      <nav className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4" aria-label="Navigation principale">
        <Link href="/jeannette" className="text-lg md:text-xl font-semibold whitespace-nowrap">
          {SITE_NAME}
        </Link>

        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(router.pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${active ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="md:hidden -mr-2 inline-flex items-center justify-center w-11 h-11 rounded-md text-gray-800 hover:bg-gray-100"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <>
          <div className="md:hidden fixed inset-0 top-14 bg-black/30" aria-hidden="true" onClick={() => setOpen(false)} />
          <ul id="menu-mobile" className="md:hidden absolute left-0 right-0 top-14 bg-white border-b border-gray-200 shadow-lg py-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(router.pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center min-h-12 px-6 text-lg ${active ? 'text-blue-700 font-medium bg-blue-50' : 'text-gray-800 active:bg-gray-100'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </header>
  );
}
