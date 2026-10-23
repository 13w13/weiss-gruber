import { useRouter } from 'next/router';
import { UI, type UiStrings } from './ui';

export type Locale = 'fr' | 'en';
export const LOCALES: Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';

export function toLocale(value: string | undefined): Locale {
  return value === 'en' ? 'en' : 'fr';
}

export function useLocale(): Locale {
  return toLocale(useRouter().locale);
}

// Textes d'interface dans la langue de la page
export function useT(): UiStrings {
  return UI[useLocale()];
}

// Préfixe d'URL de la langue (la langue par défaut n'en a pas)
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}
