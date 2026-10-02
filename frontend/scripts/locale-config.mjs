import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
export const LOCALE_CONFIG = JSON.parse(readFileSync(join(root, '../src/i18n/locales.json'), 'utf8'));
export const LOCALES = Object.keys(LOCALE_CONFIG);

export function localePrefix(locale) {
  return LOCALE_CONFIG[locale]?.pathPrefix ?? '';
}

export function localizedPath(locale, basePath = '/') {
  const prefix = localePrefix(locale);
  const normalized = `/${String(basePath).replace(/^\/+/, '')}`.replace(/\/$/, '') || '/';
  return prefix ? `${prefix}${normalized === '/' ? '' : normalized}` : normalized;
}

export function hreflangLinks(site, basePath = '/') {
  return LOCALES
    .map((locale) => {
      const config = LOCALE_CONFIG[locale];
      return `    <link rel="alternate" hreflang="${config.hreflang}" href="${site}${localizedPath(locale, basePath)}" />`;
    })
    .concat(`    <link rel="alternate" hreflang="x-default" href="${site}${localizedPath('en', basePath)}" />`)
    .join('\n');
}
