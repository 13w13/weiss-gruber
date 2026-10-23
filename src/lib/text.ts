// Recherche insensible à la casse et aux accents : « eglise » trouve « Église ».
export function normalizeText(value: string | undefined | null): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase()
    .trim();
}

// Chaque mot de la requête doit apparaître dans au moins un des champs.
export function matchesQuery(query: string, fields: (string | undefined | null)[]): boolean {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = fields.map(normalizeText).join(' ');
  return terms.every((term) => haystack.includes(term));
}

export function decadeOf(year: string | number | undefined): number | undefined {
  const y = typeof year === 'number' ? year : parseInt(String(year ?? ''), 10);
  return Number.isFinite(y) ? Math.floor(y / 10) * 10 : undefined;
}
