const MONTHS = {
  janeiro: 'enero',
  febrero: 'febrero',
  fevereiro: 'febrero',
  marzo: 'marzo',
  março: 'marzo',
  abril: 'abril',
  mayo: 'mayo',
  maio: 'mayo',
  junio: 'junio',
  junho: 'junio',
  julio: 'julio',
  julho: 'julio',
  agosto: 'agosto',
  septiembre: 'septiembre',
  setembro: 'septiembre',
  octubre: 'octubre',
  outubro: 'octubre',
  noviembre: 'noviembre',
  novembro: 'noviembre',
  diciembre: 'diciembre',
  dezembro: 'diciembre',
  january: 'enero',
  february: 'febrero',
  march: 'marzo',
  april: 'abril',
  may: 'mayo',
  june: 'junio',
  july: 'julio',
  august: 'agosto',
  september: 'septiembre',
  october: 'octubre',
  november: 'noviembre',
  december: 'diciembre'
};

/** Format the historical date labels used by the static catalog pages. */
export function formatCatalogDate(value, locale) {
  if (!value || locale !== 'es') return value;

  let formatted = String(value);
  for (const [source, target] of Object.entries(MONTHS)) {
    formatted = formatted.replace(new RegExp(`\\b${source}\\b`, 'gi'), target);
  }
  return formatted
    .replace(/\bBCE\b/gi, 'a. C.')
    .replace(/\bBC\b/gi, 'a. C.')
    .replace(/\bCE\b/gi, 'd. C.')
    .replace(/\bAD\b/gi, 'd. C.')
    .replace(/a\.\s*C\./gi, 'a. C.')
    .replace(/d\.\s*C\./gi, 'd. C.');
}

export function localizeCatalogDates(items, locale) {
  if (locale !== 'es') return items;
  return items.map((item) => ({
    ...item,
    ...(item.period ? { period: formatCatalogDate(item.period, locale) } : {}),
    ...(item.lifespan ? { lifespan: formatCatalogDate(item.lifespan, locale) } : {})
  }));
}
