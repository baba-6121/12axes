// Gera páginas estáticas de SEO (ideologias, países, personalidades) em PT e EN
// a partir dos JSONs do backend. Roda após o `vite build` e escreve direto em dist/.
// Fonte estrutural: backend/src/main/resources/data (PT). Textos EN vêm dos
// overlays em data/i18n/en/*.json (chaveados por id, com fallback para PT).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ideologiesIndexPage, IDEOLOGIES_CSS } from './ideologies-index.mjs';
import { personalitiesIndexPage, PERSONALITIES_CSS } from './personalities-index.mjs';
import { personalityPage, PROFILE_CSS } from './personality-page.mjs';
import { ideologyPage } from './ideology-page.mjs';
import { countryPage, COUNTRY_PAGE_CSS } from './country-page.mjs';
import { countriesIndexPage, COUNTRIES_CSS } from './countries-index.mjs';
import { LOCALE_CONFIG, LOCALES, hreflangLinks, localePrefix } from './locale-config.mjs';
import { localizeCatalogDates } from './locale-format.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, '../backend/src/main/resources/data');
const DIST = join(ROOT, 'dist');
const SITE = 'https://12axes.lol';
const GOOGLE_ANALYTICS_SNIPPET = `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FDMHT7SPDC"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FDMHT7SPDC');
    </script>
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "yqyqv31blm");
    </script>`;

const readJson = (path) => JSON.parse(readFileSync(join(DATA_DIR, path), 'utf8'));

const baseAxes = readJson('axes.json');
const baseIdeologies = readJson('ideologies.json');
const baseCountries = readJson('countries.json');
const basePersonalities = readJson('personalities.json');
const ideologyProfiles = new Map(readJson('ideology-profiles.json').map((p) => [p.ideologyId, p.vector]));
const countryProfiles = new Map(readJson('countries-profiles.json').map((p) => [p.countryId, p.vector]));
const personalityProfiles = new Map(readJson('personality-profiles.json').map((p) => [p.personalityId, p.vector]));

function overlay(base, locale, file, fallback = base) {
  if (locale === 'pt') return base;
  const path = join(DATA_DIR, 'i18n', locale, file);
  if (!existsSync(path)) {
    if (locale === 'es') {
      return fallback;
    }
    console.warn(`[i18n] overlay ausente: ${locale}/${file} — usando fallback`);
    return fallback;
  }
  const byId = new Map(JSON.parse(readFileSync(path, 'utf8')).map((item) => [item.id, item]));
  return fallback.map((item) => {
    const tr = byId.get(item.id);
    if (!tr && locale !== 'es') console.warn(`[i18n] sem tradução ${locale}: ${file} → ${item.id} (fallback)`);
    return tr ? { ...item, ...tr } : item;
  });
}

const STR = {
  pt: {
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    prefix: '/br',
    home: 'Início',
    navIdeologies: 'Ideologias',
    navCountries: 'Países',
    navPersonalities: 'Personalidades',
    takeTheTest: 'Fazer o teste',
    axesTitle: 'Perfil nos 12 eixos',
    ctaTitle: 'E você, onde está no espectro político?',
    ctaText: 'Responda ao quiz e descubra suas compatibilidades com ideologias, países e personalidades nos 12 eixos.',
    currentCountry: 'País atual',
    historicalRegime: (period) => `Regime histórico${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    imageSource: 'Fonte da imagem',
    homeAria: '12 Axes — página inicial',
    balanced: 'Equilibrado',
    intensity: ['Equilibrado', 'Inclinado', 'Forte', 'Muito forte'],
    subjectPrefix: (name, kind) => (kind === 'ideology' ? `o ${name}` : name),
    ideologyTitle: (name) => `${name} — o que é e posição nos 12 eixos políticos | 12 Axes`,
    countryTitle: (name) => `${name} — perfil político nos 12 eixos | 12 Axes`,
    personalityTitle: (name) => `${name} — posição política nos 12 eixos | 12 Axes`,
    ideologyHeadline: (name) => `${name} — posição política nos 12 eixos`,
    countryHeadline: (name) => `${name} — perfil político nos 12 eixos`,
    ideologiesIndexTitle: (n) => `Ideologias políticas: lista completa com ${n} correntes | 12 Axes`,
    ideologiesIndexDesc: (n) => `Explore ${n} ideologias políticas — do comunismo ao libertarianismo — com descrição e posição em 12 eixos. Descubra a sua com o quiz político 12 Axes.`,
    ideologiesIndexHeading: 'Ideologias políticas',
    countriesIndexTitle: (n) => `Perfis políticos de ${n} países e regimes históricos | 12 Axes`,
    countriesIndexDesc: (n) => `Compare o perfil político de ${n} países e regimes históricos em 12 eixos — democracia, economia, liberdades e mais. Descubra seu país mais compatível.`,
    countriesIndexHeading: 'Países e regimes',
    personalitiesIndexTitle: (n) => `${n} personalidades políticas e suas posições | 12 Axes`,
    personalitiesIndexDesc: (n) => `Veja a posição política de ${n} personalidades históricas e contemporâneas em 12 eixos. Descubra com quem você mais se parece no quiz 12 Axes.`,
    personalitiesIndexHeading: 'Personalidades políticas'
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    prefix: '',
    home: 'Home',
    navIdeologies: 'Ideologies',
    navCountries: 'Countries',
    navPersonalities: 'Personalities',
    takeTheTest: 'Take the test',
    axesTitle: 'Profile across the 12 axes',
    ctaTitle: 'Where do you stand on the political spectrum?',
    ctaText: 'Take the quiz and discover your compatibility with ideologies, countries, and personalities across the 12 axes.',
    currentCountry: 'Modern country',
    historicalRegime: (period) => `Historical regime${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Flag: ${name}`,
    imageSource: 'Image source',
    homeAria: '12 Axes — home page',
    balanced: 'Balanced',
    intensity: ['Balanced', 'Leaning', 'Strong', 'Very strong'],
    subjectPrefix: (name) => name,
    ideologyTitle: (name) => `${name} — what it is and its position on the 12 political axes | 12 Axes`,
    countryTitle: (name) => `${name} — political profile across the 12 axes | 12 Axes`,
    personalityTitle: (name) => `${name} — political position on the 12 axes | 12 Axes`,
    ideologyHeadline: (name) => `${name} — political position on the 12 axes`,
    countryHeadline: (name) => `${name} — political profile across the 12 axes`,
    ideologiesIndexTitle: (n) => `Political ideologies: full list of ${n} currents | 12 Axes`,
    ideologiesIndexDesc: (n) => `Explore ${n} political ideologies — from communism to libertarianism — with descriptions and positions on 12 axes. Find yours with the 12 Axes political quiz.`,
    ideologiesIndexHeading: 'Political ideologies',
    countriesIndexTitle: (n) => `Political profiles of ${n} countries and historical regimes | 12 Axes`,
    countriesIndexDesc: (n) => `Compare the political profile of ${n} countries and historical regimes across 12 axes — democracy, economy, liberties, and more. Find your most compatible country.`,
    countriesIndexHeading: 'Countries and regimes',
    personalitiesIndexTitle: (n) => `${n} political personalities and their positions | 12 Axes`,
    personalitiesIndexDesc: (n) => `See the political position of ${n} historical and contemporary personalities across 12 axes. Discover who you resemble most with the 12 Axes quiz.`,
    personalitiesIndexHeading: 'Political personalities'
  }
};

STR.es = {
  ...STR.en,
  htmlLang: 'es',
  ogLocale: 'es_ES',
  prefix: '/es',
  home: 'Inicio',
  navIdeologies: 'Ideologías',
  navCountries: 'Países',
  navPersonalities: 'Personalidades',
  takeTheTest: 'Hacer el test',
  axesTitle: 'Perfil en los 12 ejes',
  ctaTitle: '¿Dónde te sitúas en el espectro político?',
  ctaText: 'Haz el quiz y descubre tu compatibilidad con ideologías, países y personalidades en los 12 ejes.',
  currentCountry: 'País actual',
  historicalRegime: (period) => `Régimen histórico${period ? ` · ${period}` : ''}`,
  flagAlt: (name) => `Bandera: ${name}`,
  imageSource: 'Fuente de la imagen',
  homeAria: '12 Axes — página de inicio',
  balanced: 'Equilibrado',
  intensity: ['Equilibrado', 'Tendencia', 'Fuerte', 'Muy fuerte'],
  subjectPrefix: (name) => name,
  ideologyTitle: (name) => `${name} — qué es y su posición en los 12 ejes políticos | 12 Axes`,
  countryTitle: (name) => `${name} — perfil político en los 12 ejes | 12 Axes`,
  personalityTitle: (name) => `${name} — posición política en los 12 ejes | 12 Axes`,
  ideologyHeadline: (name) => `${name} — posición política en los 12 ejes`,
  countryHeadline: (name) => `${name} — perfil político en los 12 ejes`,
  ideologiesIndexTitle: (n) => `Ideologías políticas: lista completa de ${n} corrientes | 12 Axes`,
  ideologiesIndexDesc: (n) => `Explora ${n} ideologías políticas con descripciones y posiciones en 12 ejes. Descubre la tuya con el quiz político de 12 Axes.`,
  ideologiesIndexHeading: 'Ideologías políticas',
  countriesIndexTitle: (n) => `Perfiles políticos de ${n} países y regímenes históricos | 12 Axes`,
  countriesIndexDesc: (n) => `Compara el perfil político de ${n} países y regímenes históricos en 12 ejes. Descubre el país más compatible contigo.`,
  countriesIndexHeading: 'Países y regímenes',
  personalitiesIndexTitle: (n) => `${n} personalidades políticas y sus posiciones | 12 Axes`,
  personalitiesIndexDesc: (n) => `Consulta la posición política de ${n} personalidades históricas y contemporáneas en 12 ejes.`,
  personalitiesIndexHeading: 'Personalidades políticas'
};

function groupBy(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function truncate(text, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

// ── Páginas de índice ───────────────────────────────────────────────────────
function buildIndexes(L) {
  const p = L.s.prefix;
  const n = { i: L.ideologies.length, c: L.countries.length, p: L.personalities.length };

  return [
    ideologiesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: ideologyProfiles,
      title: L.s.ideologiesIndexTitle(n.i),
      description: L.s.ideologiesIndexDesc(n.i)
    }),
    countriesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: countryProfiles,
      title: L.s.countriesIndexTitle(n.c),
      description: L.s.countriesIndexDesc(n.c)
    }),
    personalitiesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: personalityProfiles,
      title: L.s.personalitiesIndexTitle(n.p),
      description: L.s.personalitiesIndexDesc(n.p)
    })
  ];
}

// ── Montagem por locale ─────────────────────────────────────────────────────
function buildLocaleContext(locale) {
  const englishIdeologies = overlay(baseIdeologies, 'en', 'ideologies.json');
  const englishCountries = overlay(baseCountries, 'en', 'countries.json');
  const englishPersonalities = overlay(basePersonalities, 'en', 'personalities.json');
  const fallbackIdeologies = locale === 'es' ? englishIdeologies : baseIdeologies;
  const fallbackCountries = locale === 'es' ? englishCountries : baseCountries;
  const fallbackPersonalities = locale === 'es' ? englishPersonalities : basePersonalities;
  const ideologies = overlay(baseIdeologies, locale, 'ideologies.json', fallbackIdeologies);
  const countries = localizeCatalogDates(overlay(baseCountries, locale, 'countries.json', fallbackCountries), locale);
  const personalities = localizeCatalogDates(overlay(basePersonalities, locale, 'personalities.json', fallbackPersonalities), locale);
  return {
    locale,
    s: { ...STR[locale], prefix: localePrefix(locale) },
    axes: overlay(baseAxes, locale, 'axes.json', locale === 'es' ? overlay(baseAxes, 'en', 'axes.json') : baseAxes),
    ideologies,
    countries,
    personalities,
    countryById: new Map(countries.map((c) => [c.id, c])),
    personalityById: new Map(personalities.map((p) => [p.id, p])),
    ideologiesByCountry: groupBy(ideologies, (i) => i.countryId),
    ideologiesByPersonality: groupBy(ideologies, (i) => i.personalityId)
  };
}

function writePage(prefix, { basePath, html }) {
  const file = join(DIST, `${(prefix + basePath).replace(/^\//, '')}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return prefix + basePath;
}

// ── Homes /, /br, /es e /en ─────────────────────────────────────────────────
// A raiz é a versão inglesa. /br e /es são versões explícitas; /en continua
// como alias compatível e usa a raiz como canonical.
function replaceBetween(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Marcador não encontrado no index.html: ${startMarker} … ${endMarker}`);
  }
  return html.slice(0, start) + replacement + html.slice(end);
}

function buildHomeVariants() {
  const index = readFileSync(join(DIST, 'index.html'), 'utf8');

  // Rotas do app servidas como arquivos físicos (via cleanUrls), sem depender
  // do rewrite de SPA. results.html fica sem canonical/hreflang para que cada
  // URL de resultado compartilhado possa ser indexada individualmente.
  writeFileSync(join(DIST, '240questions.html'), index);
  const results = index
    .replace(/^\s*<link rel="canonical"[^\n]*\n/m, '')
    .replace(/^\s*<link rel="alternate" hreflang=[^\n]*\n/gm, '');
  writeFileSync(join(DIST, 'results.html'), results);

  const enSeoBlock = `<!-- Primary SEO -->
    <title>Political Quiz and Ideology Test across 12 Axes | 12axes.lol</title>
    <meta
      name="description"
      content="Try a Political Quiz and Ideology Test across 12 Axes. Explore your views on economy, liberty, culture, diplomacy, technology, and more."
    />
    <meta
      name="keywords"
      content="political test, ideology test, political spectrum, political position, political ideology, left, right, center, liberalism, conservatism, progressivism, libertarianism, socialism, capitalism, democracy, federalism, immigration, international trade, religion in politics, economic policy, political representation, 12 axes, 12axes, political quiz, elections, monarchy, political compass"
    />
    <meta name="author" content="12 Axes" />
    <meta name="application-name" content="12 Axes" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="language" content="English" />
    <link rel="canonical" href="https://12axes.lol/" />
${hreflangLinks(SITE, '/')}

    `;

  const enOgBlock = `<!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="https://12axes.lol/" />
    <meta property="og:title" content="12 Axes — Political Quiz and Ideology Test across 12 Axes" />
    <meta
      property="og:description"
      content="Discover your political position in 5 minutes. A free political quiz that maps your political spectrum, political ideology, and 12 axes."
    />
    <meta property="og:image" content="https://12axes.lol/logo.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="12 Axes logo — a 12-axis political quiz" />

    `;

  const enTwitterBlock = `<!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="12 Axes — Political Quiz and Ideology Test across 12 Axes" />
    <meta
      name="twitter:description"
      content="Discover your political position in 5 minutes with a free political quiz in English."
    />
    <meta name="twitter:image" content="https://12axes.lol/logo.png" />

    `;

  const enWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '12 Axes',
    alternateName: ['12 Axes Political Quiz', '12 Axes Ideology Test'],
    url: 'https://12axes.lol/',
    description:
      'A political quiz and ideology test that maps your political position across 12 axes and returns your political spectrum, compatible ideologies, closest country, and related personality.',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    inLanguage: 'en',
    isAccessibleForFree: true,
    image: 'https://12axes.lol/logo.png',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    keywords:
      'political test, ideology test, political spectrum, political position, political ideology, left, right, center, liberalism, conservatism, progressivism, libertarianism, socialism, capitalism, democracy, federalism, immigration, international trade, religion in politics, economic policy, political representation, 12 axes, political quiz, elections, monarchy',
    about: [
      'Political structure',
      'Democratic representation',
      'Elections',
      'Monarchy',
      'Civil liberties',
      'Immigration',
      'Diplomacy',
      'Intervention',
      'Economic policy',
      'Capitalism',
      'Socialism',
      'Free markets',
      'International trade',
      'Religion in politics',
      'Morality',
      'Technology',
      'Liberalism',
      'Conservatism',
      'Progressivism',
      'Libertarianism'
    ]
  };

  const enFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['Is the test reliable?', 'The 12 Axes political test is reliable as a tool for reading and comparing political positions. It uses questions spread across 12 axes to reduce single-topic bias, but it does not replace study, debate, or academic analysis.'],
      ['How long does it take?', 'The short version takes about 5 minutes. The full version takes roughly 9 minutes. The extreme version, with 240 questions, can take about 30 minutes.'],
      ['Can I retake it?', 'Yes. You can retake the political quiz as many times as you like, including choosing another depth to compare whether your result changes.'],
      ['Is there a right answer?', 'There is no right answer. The ideology test measures preferences about democracy, monarchy, federalism, immigration, religion in politics, economic policy, international trade, liberalism, conservatism, progressivism, and other topics.'],
      ['How does the algorithm calculate?', 'Each answer adds points to a specific pole. The algorithm calculates percentages per axis, compares your ideological vector with the profiles of political currents, countries, and personalities, and returns the highest compatibilities.'],
      ['Does the result change?', 'It can change if your opinions change, if you answer with more nuance, or if you take a longer version. The extreme version tends to reduce fluctuations by using more questions.'],
      ['Is the test scientific?', '12 Axes is not a clinically validated scientific instrument. It is an educational political test, inspired by political spectrum models and ideology quizzes, useful for reflection and comparison.'],
      ['Can I share it?', 'Yes. When you finish, you can share your result to discuss political ideology, the political spectrum, left, right, center, and the 12 axes with other people.'],
      ['Does the test collect data?', 'The test is anonymous and requires no sign-up. Answers are used to calculate the result at quiz time, without asking for your name, email, or personal identification.'],
      ['Can I take it on my phone?', 'Yes. The interface was designed for mobile and desktop, so you can take the political test in your smartphone browser.']
    ].map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };

  const enJsonLdBlocks = [JSON.stringify(enWebApp), JSON.stringify(enFaq)];

  let en = index.replace(/<html lang="[^"]+">/, '<html lang="en">');
  en = replaceBetween(en, '<!-- Primary SEO -->', '<!-- Icons -->', enSeoBlock);
  en = replaceBetween(en, '<!-- Open Graph -->', '<!-- Twitter -->', enOgBlock);
  en = replaceBetween(en, '<!-- Twitter -->', '<style>', enTwitterBlock);
  // Troca apenas o conteúdo dos dois blocos ld+json (WebApplication e FAQ),
  // preservando os scripts do app que o Vite injeta no <head>.
  let ldIndex = 0;
  en = en.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (block) =>
    ldIndex < enJsonLdBlocks.length
      ? `<script type="application/ld+json">${enJsonLdBlocks[ldIndex++]}</script>`
      : block
  );
  if (ldIndex !== enJsonLdBlocks.length) {
    throw new Error(`Esperava 2 blocos ld+json no index.html, encontrei ${ldIndex}`);
  }
  // / is the canonical English entry point. Keep /en for old links.
  writeFileSync(join(DIST, 'index.html'), en);
  writeFileSync(join(DIST, 'en.html'), en);

  const br = index
    .replace(/<html lang="[^"]+">/, '<html lang="pt-BR">')
    .replace(/<title>[^<]+<\/title>/, '<title>Quiz político e teste ideológico em 12 eixos | 12axes.lol</title>')
    .replace(/<meta\n\s+name="description"\n\s+content="[^"]+"\n\s+\/>/, '<meta name="description" content="Descubra sua posição política em 5 minutos com um quiz político e teste ideológico gratuito em 12 eixos." />')
    .replace(/<meta name="language" content="[^"]+" \/>/, '<meta name="language" content="Portuguese" />')
    .replace(/<link rel="canonical" href="[^"]+" \/>/, '<link rel="canonical" href="https://12axes.lol/br" />')
    .replace(/<link rel="alternate" hreflang=[^\n]+\n/g, '');
  const brLocalized = br
    .replace(/<meta property="og:locale" content="[^"]+" \/>/, '<meta property="og:locale" content="pt_BR" />')
    .replace(/<meta property="og:url" content="[^"]+" \/>/, '<meta property="og:url" content="https://12axes.lol/br" />')
    .replace(/<meta property="og:title" content="[^"]+" \/>/, '<meta property="og:title" content="12 Axes — Quiz político e teste ideológico em 12 eixos" />')
    .replace(/<meta name="twitter:title" content="[^"]+" \/>/, '<meta name="twitter:title" content="12 Axes — Quiz político e teste ideológico em 12 eixos" />')
    .replace(/"url"\s*:\s*"https:\/\/12axes\.lol\//g, '"url":"https://12axes.lol/br');
  const brHeadLinks = hreflangLinks(SITE, '/');
  writeFileSync(join(DIST, 'br.html'), brLocalized.replace('</head>', `${brHeadLinks}\n  </head>`));

  const es = en
    .replace(/<html lang="[^"]+">/, '<html lang="es">')
    .replace(/<title>[^<]+<\/title>/, '<title>Political Quiz and Ideology Test across 12 Axes en español | 12axes.lol</title>')
    .replace(/<meta\n\s+name="description"\n\s+content="[^"]+"\n\s+\/>/, '<meta name="description" content="Haz un Political Quiz and Ideology Test across 12 Axes y explora tus opiniones sobre economía, libertad, cultura, diplomacia y tecnología." />')
    .replace(/<meta name="language" content="[^"]+" \/>/, '<meta name="language" content="Spanish" />')
    .replace(/<link rel="canonical" href="[^"]+" \/>/, '<link rel="canonical" href="https://12axes.lol/es" />')
    .replace(/<link rel="alternate" hreflang=[^\n]+\n/g, '')
    .replace(/<meta property="og:locale" content="[^"]+" \/>/, '<meta property="og:locale" content="es_ES" />')
    .replace(/<meta property="og:url" content="[^"]+" \/>/, '<meta property="og:url" content="https://12axes.lol/es" />')
    .replace(/<meta property="og:title" content="[^"]+" \/>/, '<meta property="og:title" content="12 Axes — Political Quiz and Ideology Test across 12 Axes" />')
    .replace(/<meta name="twitter:title" content="[^"]+" \/>/, '<meta name="twitter:title" content="12 Axes — Political Quiz and Ideology Test across 12 Axes" />')
    .replace(/<meta\n\s+name="twitter:description"\n\s+content="[^"]+"\n\s+\/>/, '<meta name="twitter:description" content="Descubre tu posición política con un quiz gratuito en español." />')
    .replace(/"inLanguage":"en"/g, '"inLanguage":"es"')
    .replace(/"url":"https:\/\/12axes\.lol\//g, '"url":"https://12axes.lol/es');
  writeFileSync(join(DIST, 'es.html'), es.replace('</head>', `${hreflangLinks(SITE, '/')}\n  </head>`));
}

const allPaths = [];
for (const locale of LOCALES) {
  const L = buildLocaleContext(locale);
  const profileCtx = {
    locale,
    site: SITE,
    gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
    escapeHtml,
    truncate,
    profiles: { ideology: ideologyProfiles, country: countryProfiles, personality: personalityProfiles }
  };
  const pages = [
    ...buildIndexes(L),
    ...L.ideologies.map((i) => ideologyPage(L, i, profileCtx)),
    ...L.countries.map((c) => countryPage(L, c, profileCtx)),
    ...L.personalities.map((p) => personalityPage(L, p, profileCtx))
  ];
  for (const page of pages) allPaths.push(writePage(L.s.prefix, page));
}

buildHomeVariants();

writeFileSync(join(DIST, 'ideologies.css'), IDEOLOGIES_CSS);
writeFileSync(join(DIST, 'personalities.css'), PERSONALITIES_CSS);
writeFileSync(join(DIST, 'profile.css'), PROFILE_CSS + COUNTRY_PAGE_CSS);
writeFileSync(join(DIST, 'countries.css'), COUNTRIES_CSS);

const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = ['/', '/br', '/es', ...allPaths]
  .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Geradas ${allPaths.length} páginas (${LOCALES.join(', ')}) + sitemap.xml + robots.txt + ideologies.css + personalities.css + profile.css + countries.css em dist/`);
