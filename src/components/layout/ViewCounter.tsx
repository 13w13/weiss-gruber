import { useEffect, useState } from 'react';
import { useLocale, useT } from '@/i18n';

// Affiche le nombre de visites ; rien tant que la base du compteur n'est pas branchée
export default function ViewCounter() {
  const t = useT();
  const locale = useLocale();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/views', { method: 'POST' })
      .then((res) => (res.ok ? res.json() : { total: null }))
      .then((data: { total: number | null }) => { if (!cancelled) setTotal(data.total); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (total === null || total === 0) return null;
  return <p className="tabular-nums">{t.nav.views(total.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR'))}</p>;
}
