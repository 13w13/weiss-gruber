export const SITE_URL = 'https://www.weiss-gruber.art';
export const SITE_NAME = 'Jeannette Weiss Gruber';
export const CONTACT_EMAIL = 'siweiss@proton.me';

// Les libellés viennent de src/i18n/ui.ts (clé `nav`)
export const NAV_ITEMS = [
  { href: '/jeannette', key: 'home' },
  { href: '/jeannette/biography', key: 'biography' },
  { href: '/jeannette/catalogue', key: 'catalogue' },
  { href: '/jeannette/carte', key: 'map' },
  { href: '/jeannette/publications', key: 'publications' },
] as const;
