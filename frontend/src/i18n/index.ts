// Dicionário de UI PT/EN/ES. O idioma é resolvido uma vez por carga de página
// (?lang → localStorage → navigator) e trocar de idioma recarrega a página,
// para que quiz e resultados sejam rebuscados já no idioma novo.
import type { PersonalityCategory, ProfileDimension } from '../types/quiz';
import localeConfig from './locales.json';
import { ES_AUTO_OVERRIDES } from './es-auto';

export type Lang = keyof typeof localeConfig;
export const SUPPORTED_LANGS = Object.keys(localeConfig) as Lang[];

const STORAGE_KEY = '12axes-lang';

// Idioma forçado pelo caminho: / sempre inglês, /br português, /es espanhol
// e /en continua como alias compatível do inglês.
function langForcedByPath(pathname: string): Lang | null {
  const path = (pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/');
  if (path === '/' || path === '/en' || path.startsWith('/en/')) return 'en';
  if (path === '/br' || path.startsWith('/br/')) return 'pt';
  if (path === '/es' || path.startsWith('/es/')) return 'es';
  return null;
}

function langPrefix(lang: Lang): string {
  return localeConfig[lang].pathPrefix;
}

function routeSuffix(pathname: string): string {
  let path = pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  for (const prefix of ['/en', '/br', '/es']) {
    if (path === prefix) return '/';
    if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length) || '/';
  }
  return path;
}

export function localizedPath(lang: Lang, pathname = typeof window === 'undefined' ? '/' : window.location.pathname): string {
  const suffix = routeSuffix(pathname);
  const prefix = langPrefix(lang);
  return prefix ? `${prefix}${suffix === '/' ? '' : suffix}` : suffix;
}

export function resolveLang(): Lang {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const forced = langForcedByPath(window.location.pathname);
  if (forced) {
    return forced;
  }
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'pt' || fromUrl === 'en' || fromUrl === 'es') {
    window.localStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl as Lang;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'pt' || stored === 'en' || stored === 'es') {
    return stored as Lang;
  }
  return 'en';
}

export const LANG: Lang = resolveLang();

export function setLang(lang: Lang) {
  window.localStorage.setItem(STORAGE_KEY, lang);
  const url = new URL(window.location.href);
  url.searchParams.delete('lang');
  // A rota define o idioma. Trocar de idioma conserva a página atual e muda
  // apenas o prefixo: /ideologies/x -> /es/ideologies/x.
  url.pathname = localizedPath(lang, url.pathname);
  window.location.href = url.toString();
}

interface QuizFormatStrings {
  label: string;
  questionCount: string;
  description: string;
  duration: string;
  action: string;
}

interface Strings {
  htmlLang: string;
  docTitle: string;
  loadingAnalysis: string;
  loadingQuiz: string;
  loadingResult: string;
  tryAgain: string;
  skipToContent: string;
  backToStartAria: string;
  mainNavAria: string;
  navHow: string;
  navAxes: string;
  navSpectrum: string;
  navFaq: string;
  navIdeologies: string;
  navPersonalities: string;
  navCountries: string;
  navSupport: string;
  langToggleLabel: string;
  langToggleAria: string;
  redoQuiz: string;
  religionLabel: string;
  religionQuestion: string;
  religionNone: string;
  religionNames: Record<'christianity' | 'judaism' | 'islam' | 'buddhism', string>;
  restartQuiz: string;
  heroEyebrow: string;
  h1Pre: string;
  h1Em: string;
  h1Post: string;
  introLead: string;
  startQuiz: string;
  seeAxes: string;
  heroLabels: string[];
  heroTeaserLabel: string;
  heroTeaserTag: string;
  formats: { short: QuizFormatStrings; extended: QuizFormatStrings; extreme: QuizFormatStrings };
  axisExplanations: Record<string, string>;
  axisInfoAria: (label: string) => string;
  closeLabel: string;
  personalityInfoAria: (name: string) => string;
  closenessTitle: string;
  closenessYou: string;
  homeAxes: Record<string, { label: string; leftPole: string; rightPole: string }>;
  spectrumItems: { id: string; label: string; tone: string; description: string }[];
  faqItems: { question: string; answer: string }[];
  howEyebrow: string;
  howTitle: string;
  howLead: string;
  steps: { title: string; text: string }[];
  axesGuideEyebrow: string;
  axesGuideTitle: string;
  axesGuideLead: string;
  discoveryEyebrow: string;
  discoveryTitle: string;
  discoveryLead: string;
  discoveryItems: { icon: string; title: string; text: string }[];
  exampleEyebrow: string;
  exampleTitle: string;
  exampleCaption: string;
  exampleCta: string;
  spectrumEyebrow: string;
  spectrumTitle: string;
  spectrumLead: string;
  faqTitle: string;
  faqLead: string;
  navStart: string;
  menuAria: string;
  roseAria: string;
  spectrumBarAria: string;
  footerTagline: string;
  versionsEyebrow: string;
  versionsTitle: string;
  versionsLead: string;
  variantEyebrow: string;
  variantTitlePre: string;
  variantTitleEm: string;
  backToStart: string;
  depthLabel: string;
  depthAria: (level: number) => string;
  recommended: string;
  formatNotes: string[];
  variantLead: string;
  quizNavAria: string;
  autoAdvance: string;
  back: string;
  next: string;
  calculating: string;
  seeResult: string;
  archetypeSkip: string;
  errMissingAnswer: string;
  errLoadQuiz: string;
  errCalc: string;
  errImage: string;
  errHttp: (status: number) => string;
  resultsEyebrow: string;
  resultsH1Pre: string;
  resultsH1Em: string;
  resultsLead: (count: number) => string;
  resultsLeadShared: string;
  resultsSummaryAria: string;
  metaAnswered: string;
  metaAxes: string;
  metaTop: string;
  axesSectionEyebrow: string;
  axesSectionTitle: string;
  proximityEyebrow: string;
  otherMatches: string;
  navOnThisPage: string;
  resultsNavAxes: string;
  resultsNavSignature: string;
  resultsNavCountries: string;
  resultsNavPersonalities: string;
  resultsNavAreas: string;
  resultsNavBooks: string;
  resultsNavIdeologies: string;
  countriesSectionTitle: string;
  countryCurrentTab: string;
  countryHistoricalTab: string;
  countriesDistantTitle: string;
  personalitiesSectionTitle: string;
  personalitiesByAreaTitle: string;
  dimensionsTitle: string;
  dimensionLabels: Record<ProfileDimension, string>;
  areasGeneralTitle: string;
  booksEyebrow: string;
  booksTitle: string;
  booksTopLabel: string;
  booksAuthorLabel: string;
  booksLead: string;
  booksWhy: (pct: number) => string;
  booksYearBc: (year: number) => string;
  booksCta: string;
  areasSectionTitle: string;
  areasTabsAria: string;
  areasGeneralTab: string;
  areasByAreaTab: string;
  personalitiesDistantTitle: string;
  ideologyDistantTitle: string;
  phraseTitle: string;
  phraseNote: (ideology: string) => string;
  signatureTitle: string;
  signatureUnusualLabel: string;
  signatureCommonLabel: string;
  signatureUnusualLead: (pole: string, percent: number) => string;
  signatureUnusualLeadMax: (pole: string) => string;
  signatureUnusualLeadBalanced: (axis: string, pole: string, percent: number) => string;
  signatureUnusualNote: (axis: string) => string;
  signatureCommonLead: (axis: string) => string;
  signatureCommonNote: (pole: string) => string;
  signatureCommonNoteBalanced: (axis: string) => string;
  tensionLabel: string;
  tensionCombo: (firstPole: string, secondPole: string) => string;
  tensionRare: (count: number, total: number) => string;
  tensionUnique: string;
  tensionExamples: (names: string) => string;
  tensionNote: (firstAxis: string, secondAxis: string) => string;
  signatureMedian: string;
  signatureYou: string;
  personalityCategories: Record<PersonalityCategory, string>;
  redoAnalysis: string;
  share: string;
  saveOrShare: string;
  generatingPng: string;
  downloadPdf: string;
  generatingPdf: string;
  report: {
    fileName: string;
    docLabel: string;
    profileEyebrow: string;
    headerLabel: (ideology: string) => string;
    kpiCountry: string;
    kpiPersonality: string;
    kpiAxes: string;
    kpiAnswered: (count: number) => string;
    tocTitle: string;
    generatedOn: (date: string) => string;
    axesIntro: string;
    intensityLegend: string;
    intensityLevels: [string, string, string, string];
    alsoClose: string;
    continued: string;
    areasIntro: string;
    booksIntro: string;
    aboutTitle: string;
    aboutText: string;
    ctaTitle: string;
  };
  shareFilePrefix: string;
  shareMessage: (
    ideology: string,
    ideologyPct: number,
    country: string,
    countryPct: number,
    personality: string,
    personalityPct: number
  ) => string;
  progress: (current: number, total: number) => string;
  progressDone: (percent: number) => string;
  archetypeHeader: string;
  archetypeStep: (current: number, total: number) => string;
  progressAria: (percent: number) => string;
  answersAria: string;
  countryKicker: string;
  flagLabel: string;
  flagHistoricLabel: string;
  flagAlt: (label: string, name: string) => string;
  flagUnavailable: string;
  flagUnavailableAria: (name: string) => string;
  personalityKicker: string;
  portraitAlt: (name: string) => string;
  portraitUnavailableAria: (name: string) => string;
  compatibilityAria: (pct: string) => string;
  matchWord: string;
  shareTitle: string;
  shareTopMatch: string;
  shareCountry: string;
  sharePersonality: string;
  shareResultLabel: string;
  shareMostCompatible: string;
  shareYourAxes: string;
  shareOtherPersonalities: string;
  shareNearbyCountries: string;
  shareFooterCta: string;
  shareFooterUrl: string;
  supportEyebrow: string;
  supportTitle: string;
  supportTitleEm: string;
  supportLead: string;
  supportAreas: { title: string; text: string }[];
  ossEyebrow: string;
  ossTitle: string;
  ossLead: string;
  ossCards: { title: string; text: string }[];
  ossBarText: string;
  ossPrimaryCta: string;
  ossSecondaryCta: string;
}

const pt: Strings = {
  htmlLang: 'pt-BR',
  docTitle: '12 Axes — Quiz Político e Teste Ideológico em 12 Eixos',
  loadingAnalysis: 'Carregando análise política...',
  loadingQuiz: 'Carregando quiz...',
  loadingResult: 'Carregando resultado...',
  tryAgain: 'Tentar novamente',
  skipToContent: 'Pular para o conteúdo',
  backToStartAria: 'Voltar para o início',
  mainNavAria: 'Navegação principal',
  navHow: 'Como funciona',
  navAxes: '12 Eixos',
  navSpectrum: 'Espectro',
  navFaq: 'FAQ',
  navIdeologies: 'Ideologias',
  navPersonalities: 'Personalidades',
  navCountries: 'Países',
  navSupport: 'Perfil',
  langToggleLabel: 'EN',
  langToggleAria: 'Switch to English',
  redoQuiz: 'Refazer quiz',
  religionLabel: 'Religião',
  religionQuestion: 'Você segue alguma religião? Usamos isso só para ajustar as recomendações.',
  religionNone: 'Sem religião',
  religionNames: { christianity: 'Cristianismo', judaism: 'Judaísmo', islam: 'Islamismo', buddhism: 'Budismo' },
  restartQuiz: 'Reiniciar quiz',
  heroEyebrow: 'Descoberta política',
  h1Pre: 'Você sabe mesmo qual é a sua ',
  h1Em: 'ideologia política',
  h1Post: '?',
  introLead:
    'Talvez você esteja se classificando errado. Em poucos minutos, descubra sua ideologia real, o país que mais pensa como você e o líder político mais parecido com suas ideias.',
  startQuiz: 'Descobrir meu perfil',
  seeAxes: 'Ver os 12 eixos',
  heroLabels: ['Gratuito', 'Anônimo', 'Rápido', 'Resultado imediato'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Exemplo de resultado',
  formats: {
    short: {
      label: 'Curta',
      questionCount: '36 perguntas',
      description: 'Resultado rápido, ideal para uma primeira leitura do seu perfil',
      duration: 'Aprox. 5 min',
      action: 'Começar versão curta'
    },
    extended: {
      label: 'Completa',
      questionCount: '60 perguntas',
      description: 'Mais precisão para aproximar seu resultado dos perfis ideológicos.',
      duration: 'Aprox. 9 min',
      action: 'Começar versão completa'
    },
    extreme: {
      label: 'Extrema',
      questionCount: '240 perguntas',
      description: 'Saiba exatamente a síntese do seu pensamento com 100% de precisão.',
      duration: 'Aprox. 30 min',
      action: 'Começar versão extrema'
    }
  },
  axisInfoAria: (label) => `O que significa o eixo ${label}?`,
  closeLabel: 'Fechar',
  personalityInfoAria: (name) => `Ver detalhes de ${name}`,
  closenessTitle: 'O que te aproxima',
  closenessYou: 'Você',
  axisExplanations: {
    estrutura:
      'Mede se você prefere poder distribuído entre estados, municípios e comunidades locais ou um Estado nacional unitário com leis e comando mais uniformes.',
    representacao:
      'Compara confiança em eleições, oposição e instituições democráticas com preferência por liderança forte, tecnocracia, monarquia ou regimes autoritários.',
    poder:
      'Avalia o equilíbrio entre ordem, vigilância, punição e controle estatal versus privacidade, liberdade individual e autonomia civil.',
    imigracao:
      'Observa se você valoriza assimilação cultural, idioma e identidade nacional ou multiculturalismo, abertura migratória e pluralidade de costumes.',
    diplomacia:
      'Analisa sua posição sobre Forças Armadas, armamento, dissuasão e intervenção militar em contraste com negociação, pacifismo e organismos internacionais.',
    intervencao:
      'Mede a inclinação entre não intervencionismo externo e soberania nacional mais assertiva, nacionalismo geopolítico e defesa ativa de interesses nacionais.',
    economia:
      'Compara preferência por propriedade pública, estatais e serviços coletivos com propriedade privada, privatização e protagonismo empresarial.',
    controle:
      'Avalia planejamento estatal, regulação e política econômica ativa contra livre mercado, baixa interferência, autonomia monetária e competição.',
    comercio:
      'Mede protecionismo, soberania produtiva e defesa da indústria nacional contra globalismo, livre comércio e integração econômica internacional.',
    religiao:
      'Compara laicidade, separação entre religião e Estado e crítica a privilégios religiosos com influência pública da fé e valores religiosos.',
    moral:
      'Avalia progressismo cultural, direitos civis e mudanças sociais em contraste com tradição, família, costumes e conservadorismo moral.',
    tecnologia:
      'Mede entusiasmo por tecnologia, IA, engenharia genética e desenvolvimento técnico contra cautela biológica, ambiental e preservacionista.'
  },
  homeAxes: {},
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Esquerda radical',
      tone: 'darkred',
      description:
        'Comunismo revolucionário ou totalitário de partido único, com economia planificada, forte centralização e concentração do poder do Estado.'
    },
    {
      id: 'left',
      label: 'Esquerda',
      tone: 'green',
      description:
        'Defende social-democracia, progressismo e maior intervenção do Estado na economia dentro da democracia liberal.'
    },
    {
      id: 'center',
      label: 'Centro',
      tone: 'gray',
      description:
        'Busca equilíbrio entre esquerda e direita, mercado e Estado, reformas e estabilidade, com posicionamento político moderado ou pragmático.'
    },
    {
      id: 'right',
      label: 'Direita',
      tone: 'blue',
      description:
        'Defende conservadorismo, liberalismo econômico e nacionalismo moderado dentro da democracia liberal.'
    },
    {
      id: 'right-extreme',
      label: 'Extrema direita',
      tone: 'navy',
      description:
        'Fascismo, nacionalismo racial e teocracias opressivas, com rejeição explícita da democracia e concentração autoritária do poder.'
    },
    {
      id: 'third-position',
      label: 'Terceira posição',
      tone: 'purple',
      description:
        'Síntese nacionalista e corporativista que rejeita tanto o capitalismo liberal quanto o marxismo, fora do eixo tradicional esquerda-direita.'
    },
    {
      id: 'libertarian',
      label: 'Libertário',
      tone: 'amber',
      description:
        'Defende Estado mínimo, livre mercado, propriedade privada e liberdades individuais, sem propor a abolição total do Estado.'
    },
    {
      id: 'anarchist',
      label: 'Anarquista',
      tone: 'charcoal',
      description:
        'Rejeita o Estado e toda autoridade coercitiva, defendendo organização social livre, voluntária e autogerida, de esquerda ou de direita.'
    }
  ],
  faqItems: [
    {
      question: 'O teste é confiável?',
      answer:
        'O teste político 12 Axes é confiável como ferramenta de leitura e comparação de posicionamento político. Ele usa perguntas distribuídas por 12 eixos para reduzir vieses de um único tema, mas não substitui estudo, debate ou análise acadêmica.'
    },
    {
      question: 'Quanto tempo demora?',
      answer:
        'A versão curta demora cerca de 5 minutos. A versão completa leva aproximadamente 9 minutos. A versão extrema, com 240 perguntas, pode levar cerca de 30 minutos.'
    },
    {
      question: 'Posso refazer?',
      answer:
        'Sim. Você pode refazer o quiz político quantas vezes quiser, inclusive escolhendo outra profundidade para comparar se o resultado muda.'
    },
    {
      question: 'Existe resposta certa?',
      answer:
        'Não existe resposta certa. O teste ideológico mede preferências sobre democracia, monarquia, federalismo, imigração, religião na política, política econômica, comércio internacional, liberalismo, conservadorismo, progressismo e outros temas.'
    },
    {
      question: 'Como o algoritmo calcula?',
      answer:
        'Cada resposta soma pontos em um polo específico. O algoritmo calcula percentuais por eixo, compara seu vetor ideológico com perfis de correntes políticas, países e personalidades, e retorna as maiores compatibilidades.'
    },
    {
      question: 'O resultado muda?',
      answer:
        'Pode mudar se suas opiniões mudarem, se você responder com mais nuance ou se fizer uma versão mais longa. A versão extrema tende a reduzir oscilações por usar mais perguntas.'
    },
    {
      question: 'O teste é científico?',
      answer:
        'O 12 Axes não é um instrumento científico validado clinicamente. Ele é um teste político educativo, inspirado em modelos de espectro político e quiz ideológico, útil para reflexão e comparação.'
    },
    {
      question: 'Posso compartilhar?',
      answer:
        'Sim. Ao terminar, você pode compartilhar seu resultado para discutir ideologia política, espectro político, esquerda, direita, centro e os 12 eixos com outras pessoas.'
    },
    {
      question: 'O teste coleta dados?',
      answer:
        'O teste é anônimo e não exige cadastro. As respostas são usadas para calcular o resultado no momento do quiz, sem pedir nome, e-mail ou identificação pessoal.'
    },
    {
      question: 'Posso responder pelo celular?',
      answer:
        'Sim. A interface foi pensada para celular e desktop, então você pode fazer o teste político pelo navegador do smartphone.'
    }
  ],
  howEyebrow: 'Como funciona',
  howTitle: 'Como funciona o quiz político 12 Axes',
  howLead:
    'Um teste de ideologia política simples e visual: você responde a afirmações, o 12 Axes calcula seus percentuais e mostra onde você está no espectro político em cada dimensão.',
  steps: [
    {
      title: 'Responda às perguntas',
      text: 'Concorde ou discorde de afirmações sobre economia, Estado, liberdades civis, valores, religião, política externa e tecnologia.'
    },
    {
      title: 'Análise em 12 eixos',
      text: 'Cada resposta posiciona você em 12 eixos ideológicos independentes - do livre mercado ao planejamento, do nacionalismo ao globalismo.'
    },
    {
      title: 'Descubra seu perfil',
      text: 'Receba seu perfil ideológico, ideologias mais compatíveis, país mais próximo, personalidade relacionada e resultado por eixo.'
    }
  ],
  axesGuideEyebrow: '12 eixos',
  axesGuideTitle: 'O que significa cada eixo?',
  axesGuideLead:
    'O teste ideológico 12 Axes analisa federalismo, representação política, democracia, eleições, imigração, comércio internacional, religião na política, política econômica, moral e tecnologia em dimensões separadas.',
  discoveryEyebrow: 'O que você vai descobrir',
  discoveryTitle: 'Um retrato completo das suas convicções políticas',
  discoveryLead:
    'Mais do que esquerda ou direita: seu resultado mostra com quem, onde e com que intensidade suas ideias realmente combinam.',
  discoveryItems: [
    { icon: 'ideology', title: 'Sua ideologia', text: 'Qual corrente política combina com você' },
    { icon: 'country', title: 'Seu país', text: 'Que nação pensa parecido com você' },
    { icon: 'personality', title: 'Seu líder político', text: 'Qual figura histórica é seu par ideológico' },
    { icon: 'spectrum', title: 'Seu espectro', text: 'Onde você fica entre esquerda e direita' },
    { icon: 'profile', title: 'Seu perfil', text: 'Um retrato completo das suas convicções' },
    { icon: 'compatibility', title: 'Compatibilidade', text: 'O quanto você realmente concorda com sua própria ideologia' }
  ],
  exampleEyebrow: 'Exemplo real',
  exampleTitle: 'É assim que fica o seu resultado',
  exampleCaption: 'Exemplo ilustrativo com dados reais do catálogo do 12 Axes.',
  exampleCta: 'Quero ver o meu resultado',
  spectrumEyebrow: 'Espectro político',
  spectrumTitle: 'Descubra seu espectro político',
  spectrumLead:
    'O resultado ajuda a visualizar seu posicionamento político entre esquerda, direita e centro, além de identificar formas mais radicais, autoritárias ou libertárias que não cabem nesse eixo, como extrema direita, esquerda radical, terceira posição, libertarianismo e anarquismo.',
  faqTitle: 'Perguntas frequentes',
  faqLead: 'Tudo o que as pessoas costumam perguntar antes de fazer o teste.',
  navStart: 'Começar',
  menuAria: 'Abrir menu',
  roseAria: 'Rosa dos 12 eixos',
  spectrumBarAria: 'Barra do espectro político com as oito categorias',
  footerTagline: 'Quiz político independente · 12axes.lol',
  versionsEyebrow: 'Versões',
  versionsTitle: 'Escolha a profundidade',
  versionsLead:
    'Comece pelo quiz rápido ou aprofunde sua análise para um retrato mais preciso do seu perfil ideológico. Todas as versões usam os mesmos 12 eixos e retornam o resultado imediatamente.',
  variantEyebrow: 'Escolha o formato',
  variantTitlePre: 'Você quer velocidade ou ',
  variantTitleEm: 'precisão?',
  backToStart: 'Voltar ao início',
  depthLabel: 'Profundidade',
  depthAria: (level) => `Profundidade ${level} de 3`,
  recommended: 'Recomendada',
  formatNotes: ['Todas as versões usam os mesmos 12 eixos', 'Anônimo, sem cadastro', 'Resultado imediato'],
  variantLead:
    'A versão curta revela o resultado de forma rápida. A completa aumenta a precisão para aproximar melhor seu resultado dos perfis ideológicos.',
  quizNavAria: 'Navegação do quiz',
  autoAdvance: 'Avançar ao responder',
  back: 'Voltar',
  next: 'Avançar',
  calculating: 'Calculando…',
  seeResult: 'Ver resultado',
  archetypeSkip: 'Pular',
  errMissingAnswer: 'Ainda falta responder esta pergunta antes de ver o resultado.',
  errLoadQuiz: 'Não foi possível carregar o quiz.',
  errCalc: 'Não foi possível calcular o resultado.',
  errImage: 'Não foi possível gerar a imagem do resultado.',
  errHttp: (status) => `Erro HTTP ${status}`,
  resultsEyebrow: 'Análise concluída',
  resultsH1Pre: 'Seu perfil ',
  resultsH1Em: 'ideológico',
  resultsLead: (count) =>
    `Análise baseada em ${count} respostas distribuídas em 12 dimensões fundamentais da ideologia política. Confira sua posição em cada eixo e suas correspondências ideológicas.`,
  resultsLeadShared:
    'Resultado compartilhado: a posição em cada um dos 12 eixos políticos e as correspondências ideológicas calculadas a partir dele. Faça o teste para descobrir o seu.',
  resultsSummaryAria: 'Resumo da análise',
  metaAnswered: 'Perguntas respondidas',
  metaAxes: 'Eixos analisados',
  metaTop: 'Top match',
  axesSectionEyebrow: 'Eixos políticos',
  axesSectionTitle: 'Resultado percentual por eixo',
  proximityEyebrow: 'Proximidade ideológica',
  otherMatches: 'Outras correspondências',
  navOnThisPage: 'Nesta página',
  resultsNavAxes: 'Os 12 eixos',
  resultsNavSignature: 'O que te distingue',
  resultsNavCountries: 'Países',
  resultsNavPersonalities: 'Personalidades',
  resultsNavAreas: 'Áreas de atuação',
  resultsNavBooks: 'Para ler',
  resultsNavIdeologies: 'Outras ideologias',
  countriesSectionTitle: 'Países mais próximos de você',
  countryCurrentTab: 'País atual',
  countryHistoricalTab: 'Experiência histórica',
  countriesDistantTitle: 'Os mais distantes de você',
  personalitiesSectionTitle: 'Personalidades mais próximas de você',
  personalitiesByAreaTitle: 'Também próximos, por área de atuação',
  dimensionsTitle: 'Também próximos, por dimensão do seu perfil',
  dimensionLabels: {
    political: 'Politicamente',
    social: 'Socialmente',
    economic: 'Economicamente',
  },
  booksEyebrow: 'Para ir além',
  booksTitle: 'Para ler',
  booksTopLabel: 'Mais próxima de você',
  booksAuthorLabel: 'Autor',
  booksLead: 'Uma obra de cada uma das personalidades mais próximas dos seus resultados.',
  booksWhy: (pct) => `${pct}% compatível`,
  booksYearBc: (year) => `${year} a.C.`,
  booksCta: 'Ver na Amazon',
  areasGeneralTitle: 'Os mais próximos dos seus resultados',
  areasSectionTitle: 'Os mais próximos por área de atuação',
  areasTabsAria: 'Modo de exibição das personalidades',
  areasGeneralTab: 'Compatibilidade geral',
  areasByAreaTab: 'Área de atuação',
  personalitiesDistantTitle: 'As mais distantes de você',
  ideologyDistantTitle: 'A ideologia mais distante de você',
  phraseTitle: 'Uma frase que te descreve',
  phraseNote: (ideology) => `É assim que alguém do ${ideology} resumiria a sociedade que quer.`,
  signatureTitle: 'O que te distingue',
  signatureUnusualLabel: 'Sua posição mais incomum',
  signatureCommonLabel: 'Sua posição mais comum',
  signatureUnusualLead: (pole, percent) => `Você puxa mais para ${pole.toLowerCase()} que ${Math.round(percent)}% das ideologias do catálogo.`,
  signatureUnusualLeadMax: (pole) => `Nenhuma ideologia do catálogo puxa tanto para ${pole.toLowerCase()} quanto você.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Sua posição em ${axis} é de meio-termo. Mesmo assim, isso já te coloca mais para ${pole.toLowerCase()} que ${Math.round(percent)}% das ideologias do catálogo.`,
  signatureUnusualNote: (axis) => `De todos os 12 eixos, ${axis} é onde você mais se afasta do conjunto. É o traço que mais te diferencia.`,
  signatureCommonLead: (axis) => `Sua posição em ${axis} é praticamente a mediana do catálogo.`,
  signatureCommonNote: (pole) => `Aqui você está em terreno comum. Não puxa para ${pole.toLowerCase()} nem para o polo oposto.`,
  signatureCommonNoteBalanced: (axis) => `Você fica no centro em ${axis}, e o catálogo também. É onde seu perfil menos se distingue.`,
  tensionLabel: 'Sua tensão interna',
  tensionCombo: (firstPole, secondPole) => `${firstPole} e ${secondPole} ao mesmo tempo`,
  tensionRare: (count, total) => `Só ${count} das ${total} ideologias do catálogo juntam essas duas posições.`,
  tensionUnique: 'Nenhuma ideologia do catálogo junta essas duas posições.',
  tensionExamples: (names) => `Quem chega perto: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `No catálogo, ${firstAxis} e ${secondAxis} costumam andar na mesma direção. Você inverte esse padrão.`,
  signatureMedian: 'Mediana das ideologias',
  signatureYou: 'Você',
  personalityCategories: {
    politico: 'Política',
    religioso: 'Religião',
    economista: 'Economia',
    filosofo: 'Filosofia',
    teorico: 'Teoria política',
    empresario: 'Empresariado',
    intelectual: 'Vida intelectual',
    ativista: 'Ativismo',
  },
  redoAnalysis: 'Refazer análise',
  share: 'Compartilhar',
  saveOrShare: 'Compartilhar resultado',
  generatingPng: 'Gerando PNG...',
  generatingPdf: 'Gerando PDF...',
  downloadPdf: 'Download PDF',
  report: {
    fileName: '12axes-relatorio',
    docLabel: 'Relatório completo',
    profileEyebrow: 'Seu perfil ideológico',
    headerLabel: (ideology) => `Relatório do perfil político · ${ideology}`,
    kpiCountry: 'País mais próximo',
    kpiPersonality: 'Personalidade',
    kpiAxes: 'Eixos analisados',
    kpiAnswered: (count) => `${count} perguntas respondidas`,
    tocTitle: 'Neste relatório',
    generatedOn: (date) => `Gerado em ${date}`,
    axesIntro: 'Sua posição em cada um dos 12 eixos. A barra parte do centro (50%) em direção ao polo para onde você pende; o selo indica a intensidade.',
    intensityLegend: 'Intensidade',
    intensityLevels: ['Equilibrado · até 57%', 'Inclinado · 58 a 72%', 'Forte · 73 a 87%', 'Muito forte · 88% ou mais'],
    alsoClose: 'Também próximos, por dimensão do seu perfil',
    continued: 'continuação',
    areasIntro: 'As personalidades do catálogo cujo perfil nos 12 eixos mais se parece com o seu.',
    booksIntro: 'Uma obra de cada uma das personalidades mais próximas dos seus resultados. Links na versão online do resultado.',
    aboutTitle: 'Sobre este relatório',
    aboutText: 'O 12 Axes compara suas respostas com perfis de ideologias, países e personalidades nos mesmos 12 eixos. A compatibilidade mede proximidade entre perfis; não é diagnóstico científico nem rótulo definitivo. Suas respostas não são armazenadas.',
    ctaTitle: 'Refaça o teste ou compartilhe'
  },
  shareFilePrefix: '12axes-perfil',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `Descobri meu perfil ideológico no Quiz Político 12 Axes!\n\n` +
    `💡 Ideologia mais compatível:\n` +
    `${ideology} - ${ideologyPct}% de compatibilidade\n\n` +
    `🌎 País/Nação mais compatível:\n` +
    `${country} - ${countryPct}% de compatibilidade\n\n` +
    `👤 Personalidade mais compatível:\n` +
    `${personality} - ${personalityPct}% de compatibilidade\n\n` +
    `👉 Faça o teste e compartilhe seu resultado:\nhttps://12axes.lol/`,
  progress: (current, total) => `Pergunta ${current} de ${total}`,
  progressDone: (percent) => `${percent}% concluído`,
  archetypeHeader: 'Identificando seu arquétipo',
  archetypeStep: (current, total) => `${current} de ${total}`,
  progressAria: (percent) => `Progresso do quiz: ${percent}%`,
  answersAria: 'Opções de resposta',
  countryKicker: 'País mais compatível',
  flagLabel: 'Bandeira',
  flagHistoricLabel: 'Bandeira / símbolo histórico',
  flagAlt: (label, name) => `${label} de ${name}`,
  flagUnavailable: 'Bandeira indisponível',
  flagUnavailableAria: (name) => `Bandeira indisponível de ${name}`,
  personalityKicker: 'Personalidade mais compatível',
  portraitAlt: (name) => `Retrato de ${name}`,
  portraitUnavailableAria: (name) => `Retrato indisponível de ${name}`,
  compatibilityAria: (pct) => `Compatibilidade: ${pct} por cento`,
  matchWord: 'match',
  shareTitle: 'Seu perfil ideológico | 12axes.lol',
  shareTopMatch: 'Top match',
  shareCountry: 'País mais compatível',
  sharePersonality: 'Personalidade',
  shareResultLabel: 'MEU RESULTADO',
  shareMostCompatible: 'MAIS COMPATÍVEL',
  shareYourAxes: 'SEUS 12 EIXOS',
  shareOtherPersonalities: 'OUTRAS PERSONALIDADES',
  shareNearbyCountries: 'PAÍSES PRÓXIMOS',
  shareFooterCta: 'DESCUBRA SEU PERFIL',
  shareFooterUrl: '12AXES.LOL',
  supportEyebrow: 'LEIA SEU PERFIL',
  supportTitle: 'O que seu perfil',
  supportTitleEm: ' político mede',
  supportLead:
    'Um quiz político é mais útil quando mostra mais do que um único rótulo entre esquerda e direita. Este perfil separa suas respostas em dimensões políticas para revelar onde suas opiniões são consistentes, misturadas ou ainda estão se formando.',
  supportAreas: [
    { title: 'Economia e propriedade', text: 'Serviços públicos, propriedade privada, planejamento e mercados.' },
    { title: 'Poder e instituições', text: 'Democracia, representação, federalismo, segurança e liberdade.' },
    { title: 'Cultura e sociedade', text: 'Imigração, religião, moralidade, identidade e mudança social.' },
    { title: 'Visão internacional', text: 'Diplomacia, intervenção, interesses nacionais e comércio global.' },
    { title: 'Tecnologia e futuro', text: 'Tecnologia, biologia, inovação e preservação.' }
  ],
  ossEyebrow: 'INTERPRETE O RESULTADO',
  ossTitle: 'Um perfil político é mais do que um rótulo',
  ossLead: 'Seu resultado combina pontuações em 12 dimensões políticas com perfis de comparação. Use as compatibilidades para explorar semelhanças, não como uma identidade fixa ou uma recomendação política.',
  ossCards: [
    { title: 'Leia os eixos primeiro', text: 'Cada pontuação mostra a força da inclinação das suas respostas em uma dimensão política.' },
    { title: 'Compare o padrão', text: 'As compatibilidades com ideologias e perfis se baseiam em várias dimensões, não em uma única resposta.' },
    { title: 'Observe as misturas', text: 'É normal ter posições diferentes sobre economia, cultura, poder, liberdade e política externa.' },
    { title: 'Use o resultado como ponto de partida', text: 'Um perfil político pode ajudar você a fazer perguntas melhores e entender suas próprias opiniões.' }
  ],
  ossBarText: 'Explore seu perfil político em 12 dimensões e entenda como o resultado é calculado.',
  ossPrimaryCta: 'Começar o quiz político',
  ossSecondaryCta: 'Como a pontuação funciona',
};

const en: Strings = {
  htmlLang: 'en',
  docTitle: '12 Axes — Political Quiz and Ideology Test across 12 Axes',
  loadingAnalysis: 'Loading political analysis...',
  loadingQuiz: 'Loading quiz...',
  loadingResult: 'Loading results...',
  tryAgain: 'Try again',
  skipToContent: 'Skip to content',
  backToStartAria: 'Back to start',
  mainNavAria: 'Main navigation',
  navHow: 'How it works',
  navAxes: '12 Axes',
  navSpectrum: 'Spectrum',
  navFaq: 'FAQ',
  navIdeologies: 'Ideologies',
  navPersonalities: 'Personalities',
  navCountries: 'Countries',
  navSupport: 'Profile guide',
  langToggleLabel: 'PT',
  langToggleAria: 'Mudar para português',
  redoQuiz: 'Retake quiz',
  religionLabel: 'Religion',
  religionQuestion: 'Do you follow a religion? We only use this to tailor your recommendations.',
  religionNone: 'No religion',
  religionNames: { christianity: 'Christianity', judaism: 'Judaism', islam: 'Islam', buddhism: 'Buddhism' },
  restartQuiz: 'Restart quiz',
  heroEyebrow: 'Political discovery',
  h1Pre: 'Do you really know your ',
  h1Em: 'political ideology',
  h1Post: '?',
  introLead:
    'You might be labeling yourself wrong. In a few minutes, discover your real ideology, the country that thinks most like you, and the political leader closest to your ideas.',
  startQuiz: 'Discover my profile',
  seeAxes: 'See the 12 axes',
  heroLabels: ['Free', 'Anonymous', 'Fast', 'Instant result'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Example result',
  formats: {
    short: {
      label: 'Short',
      questionCount: '36 questions',
      description: 'A quick result, ideal for a first reading of your profile',
      duration: 'About 5 min',
      action: 'Start short version'
    },
    extended: {
      label: 'Full',
      questionCount: '60 questions',
      description: 'More precision to bring your result closer to the ideological profiles.',
      duration: 'About 9 min',
      action: 'Start full version'
    },
    extreme: {
      label: 'Extreme',
      questionCount: '240 questions',
      description: 'Know the exact synthesis of your thinking with 100% precision.',
      duration: 'About 30 min',
      action: 'Start extreme version'
    }
  },
  axisInfoAria: (label) => `What does the ${label} axis mean?`,
  closeLabel: 'Close',
  personalityInfoAria: (name) => `See details about ${name}`,
  closenessTitle: 'What brings you closer',
  closenessYou: 'You',
  axisExplanations: {
    estrutura:
      'Measures whether you prefer power distributed among states, cities, and local communities or a unitary national state with more uniform laws and command.',
    representacao:
      'Compares trust in elections, opposition, and democratic institutions with a preference for strong leadership, technocracy, monarchy, or authoritarian regimes.',
    poder:
      'Evaluates the balance between order, surveillance, punishment, and state control versus privacy, individual freedom, and civil autonomy.',
    imigracao:
      'Looks at whether you value cultural assimilation, language, and national identity or multiculturalism, open migration, and plurality of customs.',
    diplomacia:
      'Analyzes your position on armed forces, weapons, deterrence, and military intervention in contrast with negotiation, pacifism, and international organizations.',
    intervencao:
      'Measures the leaning between external non-interventionism and more assertive national sovereignty, geopolitical nationalism, and active defense of national interests.',
    economia:
      'Compares a preference for public ownership, state companies, and collective services with private property, privatization, and business leadership.',
    controle:
      'Evaluates state planning, regulation, and active economic policy against free markets, low interference, monetary autonomy, and competition.',
    comercio:
      'Measures protectionism, productive sovereignty, and defense of national industry against globalism, free trade, and international economic integration.',
    religiao:
      'Compares secularism, separation of religion and state, and criticism of religious privileges with the public influence of faith and religious values.',
    moral:
      'Evaluates cultural progressivism, civil rights, and social change in contrast with tradition, family, customs, and moral conservatism.',
    tecnologia:
      'Measures enthusiasm for technology, AI, genetic engineering, and technical development against biological, environmental, and preservationist caution.'
  },
  homeAxes: {
    estrutura: { label: 'Structure', leftPole: 'Federal', rightPole: 'Unitary' },
    representacao: { label: 'Representation', leftPole: 'Democracy', rightPole: 'Autocracy' },
    poder: { label: 'Power', leftPole: 'Security', rightPole: 'Liberty' },
    imigracao: { label: 'Immigration', leftPole: 'Assimilation', rightPole: 'Multiculturalism' },
    diplomacia: { label: 'Diplomacy', leftPole: 'Militarist', rightPole: 'Pacifist' },
    intervencao: { label: 'Intervention', leftPole: 'Non-interventionist', rightPole: 'Nationalist' },
    economia: { label: 'Economy', leftPole: 'Public', rightPole: 'Private' },
    controle: { label: 'Control', leftPole: 'Planning', rightPole: 'Free market' },
    comercio: { label: 'Trade', leftPole: 'Protectionism', rightPole: 'Globalism' },
    religiao: { label: 'Religion', leftPole: 'Irreligious', rightPole: 'Religious' },
    moral: { label: 'Morality', leftPole: 'Progressive', rightPole: 'Traditionalist' },
    tecnologia: { label: 'Technology', leftPole: 'Technology', rightPole: 'Biology' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Radical left',
      tone: 'darkred',
      description:
        'Revolutionary or totalitarian single-party communism, with a planned economy, strong centralization, and concentrated state power.'
    },
    {
      id: 'left',
      label: 'Left',
      tone: 'green',
      description:
        'Advocates social democracy, progressivism, and greater state intervention in the economy within liberal democracy.'
    },
    {
      id: 'center',
      label: 'Center',
      tone: 'gray',
      description:
        'Seeks balance between left and right, market and state, reform and stability, with a moderate or pragmatic political stance.'
    },
    {
      id: 'right',
      label: 'Right',
      tone: 'blue',
      description:
        'Advocates conservatism, economic liberalism, and moderate nationalism within liberal democracy.'
    },
    {
      id: 'right-extreme',
      label: 'Far-right',
      tone: 'navy',
      description:
        'Fascism, racial nationalism, and oppressive theocracies, with explicit rejection of democracy and authoritarian concentration of power.'
    },
    {
      id: 'third-position',
      label: 'Third position',
      tone: 'purple',
      description:
        'A nationalist, corporatist synthesis that rejects both liberal capitalism and Marxism, outside the traditional left-right axis.'
    },
    {
      id: 'libertarian',
      label: 'Libertarian',
      tone: 'amber',
      description:
        'Advocates a minimal state, free markets, private property, and individual liberties, without proposing the total abolition of the state.'
    },
    {
      id: 'anarchist',
      label: 'Anarchist',
      tone: 'charcoal',
      description:
        'Rejects the state and all coercive authority, advocating free, voluntary, and self-managed social organization, from the left or the right.'
    }
  ],
  faqItems: [
    {
      question: 'Is the test reliable?',
      answer:
        'The 12 Axes political test is reliable as a tool for reading and comparing political positions. It uses questions spread across 12 axes to reduce single-topic bias, but it does not replace study, debate, or academic analysis.'
    },
    {
      question: 'How long does it take?',
      answer:
        'The short version takes about 5 minutes. The full version takes roughly 9 minutes. The extreme version, with 240 questions, can take about 30 minutes.'
    },
    {
      question: 'Can I retake it?',
      answer:
        'Yes. You can retake the political quiz as many times as you like, including choosing another depth to compare whether your result changes.'
    },
    {
      question: 'Is there a right answer?',
      answer:
        'There is no right answer. The ideology test measures preferences about democracy, monarchy, federalism, immigration, religion in politics, economic policy, international trade, liberalism, conservatism, progressivism, and other topics.'
    },
    {
      question: 'How does the algorithm calculate?',
      answer:
        'Each answer adds points to a specific pole. The algorithm calculates percentages per axis, compares your ideological vector with the profiles of political currents, countries, and personalities, and returns the highest compatibilities.'
    },
    {
      question: 'Does the result change?',
      answer:
        'It can change if your opinions change, if you answer with more nuance, or if you take a longer version. The extreme version tends to reduce fluctuations by using more questions.'
    },
    {
      question: 'Is the test scientific?',
      answer:
        '12 Axes is not a clinically validated scientific instrument. It is an educational political test, inspired by political spectrum models and ideology quizzes, useful for reflection and comparison.'
    },
    {
      question: 'Can I share it?',
      answer:
        'Yes. When you finish, you can share your result to discuss political ideology, the political spectrum, left, right, center, and the 12 axes with other people.'
    },
    {
      question: 'Does the test collect data?',
      answer:
        'The test is anonymous and requires no sign-up. Answers are used to calculate the result at quiz time, without asking for your name, email, or personal identification.'
    },
    {
      question: 'Can I take it on my phone?',
      answer:
        'Yes. The interface was designed for mobile and desktop, so you can take the political test in your smartphone browser.'
    }
  ],
  howEyebrow: 'How it works',
  howTitle: 'How the 12 Axes political quiz works',
  howLead:
    'A simple, visual political ideology test: you respond to statements, 12 Axes calculates your percentages, and shows where you stand on the political spectrum in each dimension.',
  steps: [
    {
      title: 'Answer the questions',
      text: 'Agree or disagree with statements about the economy, the state, civil liberties, values, religion, foreign policy, and technology.'
    },
    {
      title: 'Analysis across 12 axes',
      text: 'Each answer positions you on 12 independent ideological axes - from free markets to planning, from nationalism to globalism.'
    },
    {
      title: 'Discover your profile',
      text: 'Receive your ideological profile, most compatible ideologies, closest country, related personality, and per-axis results.'
    }
  ],
  axesGuideEyebrow: '12 axes',
  axesGuideTitle: 'What does each axis mean?',
  axesGuideLead:
    'The 12 Axes ideology test analyzes federalism, political representation, democracy, elections, immigration, international trade, religion in politics, economic policy, morality, and technology in separate dimensions.',
  discoveryEyebrow: 'What you will discover',
  discoveryTitle: 'A complete portrait of your political convictions',
  discoveryLead:
    'More than left or right: your result shows who, where, and how strongly your ideas actually align.',
  discoveryItems: [
    { icon: 'ideology', title: 'Your ideology', text: 'Which political current matches you' },
    { icon: 'country', title: 'Your country', text: 'Which nation thinks most like you' },
    { icon: 'personality', title: 'Your political leader', text: 'Which historical figure is your ideological match' },
    { icon: 'spectrum', title: 'Your spectrum', text: 'Where you fall between left and right' },
    { icon: 'profile', title: 'Your profile', text: 'A complete portrait of your convictions' },
    { icon: 'compatibility', title: 'Compatibility', text: 'How much you truly agree with your own ideology' }
  ],
  exampleEyebrow: 'Real example',
  exampleTitle: "Here's what your result looks like",
  exampleCaption: 'Illustrative example using real data from the 12 Axes catalog.',
  exampleCta: 'I want to see my result',
  spectrumEyebrow: 'Political spectrum',
  spectrumTitle: 'Discover your political spectrum',
  spectrumLead:
    'The result helps you visualize your political position between left, right, and center, and also identifies more radical, authoritarian, or libertarian forms that fall outside that axis, such as far-right, radical left, third position, libertarianism, and anarchism.',
  faqTitle: 'Frequently asked questions',
  faqLead: 'Everything people usually ask before taking the test.',
  navStart: 'Start',
  menuAria: 'Open menu',
  roseAria: 'Rose of the 12 axes',
  spectrumBarAria: 'Political spectrum bar with the eight categories',
  footerTagline: 'Independent political quiz · 12axes.lol',
  versionsEyebrow: 'Versions',
  versionsTitle: 'Choose the depth',
  versionsLead:
    'Start with the quick quiz or go deeper for a more precise portrait of your ideological profile. All versions use the same 12 axes and return the result immediately.',
  variantEyebrow: 'Choose the format',
  variantTitlePre: 'Do you want speed or ',
  variantTitleEm: 'precision?',
  backToStart: 'Back to start',
  depthLabel: 'Depth',
  depthAria: (level) => `Depth ${level} of 3`,
  recommended: 'Recommended',
  formatNotes: ['All versions use the same 12 axes', 'Anonymous, no sign-up', 'Instant result'],
  variantLead:
    'The short version reveals the result quickly. The full version increases precision to bring your result closer to the ideological profiles.',
  quizNavAria: 'Quiz navigation',
  autoAdvance: 'Advance on answer',
  back: 'Back',
  next: 'Next',
  calculating: 'Calculating…',
  seeResult: 'See results',
  archetypeSkip: 'Skip',
  errMissingAnswer: 'You still need to answer this question before seeing the result.',
  errLoadQuiz: 'Could not load the quiz.',
  errCalc: 'Could not calculate the result.',
  errImage: 'Could not generate the result image.',
  errHttp: (status) => `HTTP error ${status}`,
  resultsEyebrow: 'Analysis complete',
  resultsH1Pre: 'Your ideological ',
  resultsH1Em: 'profile',
  resultsLead: (count) =>
    `Analysis based on ${count} answers distributed across 12 fundamental dimensions of political ideology. Check your position on each axis and your ideological matches.`,
  resultsLeadShared:
    'Shared result: the position on each of the 12 political axes and the ideological matches calculated from it. Take the test to discover yours.',
  resultsSummaryAria: 'Analysis summary',
  metaAnswered: 'Questions answered',
  metaAxes: 'Axes analyzed',
  metaTop: 'Top match',
  axesSectionEyebrow: 'Political axes',
  axesSectionTitle: 'Percentage result per axis',
  proximityEyebrow: 'Ideological proximity',
  otherMatches: 'Other matches',
  navOnThisPage: 'On this page',
  resultsNavAxes: 'The 12 axes',
  resultsNavSignature: 'What sets you apart',
  resultsNavCountries: 'Countries',
  resultsNavPersonalities: 'Figures',
  resultsNavAreas: 'Fields',
  resultsNavBooks: 'Further reading',
  resultsNavIdeologies: 'Other ideologies',
  countriesSectionTitle: 'Countries closest to you',
  countryCurrentTab: 'Present-day',
  countryHistoricalTab: 'Historical',
  countriesDistantTitle: 'Furthest from you',
  personalitiesSectionTitle: 'Figures closest to you',
  personalitiesByAreaTitle: 'Also close to you, by field',
  dimensionsTitle: 'Also close to you, by dimension of your profile',
  dimensionLabels: {
    political: 'Politically',
    social: 'Socially',
    economic: 'Economically',
  },
  booksEyebrow: 'Go further',
  booksTitle: 'Further reading',
  booksTopLabel: 'Closest to you',
  booksAuthorLabel: 'Author',
  booksLead: 'One work by each of the figures closest to your results.',
  booksWhy: (pct) => `${pct}% compatible`,
  booksYearBc: (year) => `${year} BC`,
  booksCta: 'See on Amazon',
  areasGeneralTitle: 'The closest figures to your results',
  areasSectionTitle: 'The closest figures by field',
  areasTabsAria: 'How figures are grouped',
  areasGeneralTab: 'Overall compatibility',
  areasByAreaTab: 'Field',
  personalitiesDistantTitle: 'Furthest from you',
  ideologyDistantTitle: 'The ideology furthest from you',
  phraseTitle: 'A sentence that describes you',
  phraseNote: (ideology) => `This is how someone from ${ideology} would sum up the society they want.`,
  signatureTitle: 'What sets you apart',
  signatureUnusualLabel: 'Your most unusual position',
  signatureCommonLabel: 'Your most typical position',
  signatureUnusualLead: (pole, percent) => `You lean further toward ${pole.toLowerCase()} than ${Math.round(percent)}% of the ideologies in the catalog.`,
  signatureUnusualLeadMax: (pole) => `No ideology in the catalog leans as far toward ${pole.toLowerCase()} as you do.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Your position on ${axis} is middle of the road. Even so, that puts you further toward ${pole.toLowerCase()} than ${Math.round(percent)}% of the ideologies in the catalog.`,
  signatureUnusualNote: (axis) => `Of all 12 axes, ${axis} is where you depart most from the field. It is the trait that sets you apart.`,
  signatureCommonLead: (axis) => `Your position on ${axis} sits almost exactly at the catalog median.`,
  signatureCommonNote: (pole) => `This is common ground. You lean neither toward ${pole.toLowerCase()} nor to the opposite pole.`,
  signatureCommonNoteBalanced: (axis) => `You sit at the centre on ${axis}, and so does the catalog. This is where your profile stands out least.`,
  tensionLabel: 'Your internal tension',
  tensionCombo: (firstPole, secondPole) => `${firstPole} and ${secondPole} at the same time`,
  tensionRare: (count, total) => `Only ${count} of the ${total} ideologies in the catalog hold both of these positions.`,
  tensionUnique: 'No ideology in the catalog holds both of these positions.',
  tensionExamples: (names) => `Closest matches: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `In the catalog, ${firstAxis} and ${secondAxis} usually move together. You reverse that pattern.`,
  signatureMedian: 'Ideology median',
  signatureYou: 'You',
  personalityCategories: {
    politico: 'Politics',
    religioso: 'Religion',
    economista: 'Economics',
    filosofo: 'Philosophy',
    teorico: 'Political theory',
    empresario: 'Business',
    intelectual: 'Intellectual life',
    ativista: 'Activism',
  },
  redoAnalysis: 'Retake analysis',
  share: 'Share',
  saveOrShare: 'Share result',
  generatingPng: 'Generating PNG...',
  generatingPdf: 'Generating PDF...',
  downloadPdf: 'Download PDF',
  report: {
    fileName: '12axes-report',
    docLabel: 'Full report',
    profileEyebrow: 'Your ideological profile',
    headerLabel: (ideology) => `Political profile report · ${ideology}`,
    kpiCountry: 'Closest country',
    kpiPersonality: 'Figure',
    kpiAxes: 'Axes analyzed',
    kpiAnswered: (count) => `${count} questions answered`,
    tocTitle: 'In this report',
    generatedOn: (date) => `Generated on ${date}`,
    axesIntro: 'Your position on each of the 12 axes. The bar starts at the center (50%) and extends toward the pole you lean to; the badge shows the intensity.',
    intensityLegend: 'Intensity',
    intensityLevels: ['Balanced · up to 57%', 'Leaning · 58 to 72%', 'Strong · 73 to 87%', 'Very strong · 88% or more'],
    alsoClose: 'Also close, by dimension of your profile',
    continued: 'continued',
    areasIntro: 'The figures in the catalog whose profile across the 12 axes most resembles yours.',
    booksIntro: 'One work by each of the figures closest to your results. Links in the online version of the result.',
    aboutTitle: 'About this report',
    aboutText: '12 Axes compares your answers with profiles of ideologies, countries and figures on the same 12 axes. Compatibility measures closeness between profiles; it is not a scientific diagnosis or a definitive label. Your answers are not stored.',
    ctaTitle: 'Retake the quiz or share it'
  },
  shareFilePrefix: '12axes-profile',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `I discovered my ideological profile on the 12 Axes Political Quiz!\n\n` +
    `💡 Most compatible ideology:\n` +
    `${ideology} - ${ideologyPct}% compatibility\n\n` +
    `🌎 Most compatible country/nation:\n` +
    `${country} - ${countryPct}% compatibility\n\n` +
    `👤 Most compatible personality:\n` +
    `${personality} - ${personalityPct}% compatibility\n\n` +
    `👉 Take the test and share your result:\nhttps://12axes.lol/en`,
  progress: (current, total) => `Question ${current} of ${total}`,
  progressDone: (percent) => `${percent}% complete`,
  archetypeHeader: 'Identifying your archetype',
  archetypeStep: (current, total) => `${current} of ${total}`,
  progressAria: (percent) => `Quiz progress: ${percent}%`,
  answersAria: 'Answer options',
  countryKicker: 'Most compatible country',
  flagLabel: 'Flag',
  flagHistoricLabel: 'Flag / historical symbol',
  flagAlt: (label, name) => `${label} of ${name}`,
  flagUnavailable: 'Flag unavailable',
  flagUnavailableAria: (name) => `Flag unavailable for ${name}`,
  personalityKicker: 'Most compatible personality',
  portraitAlt: (name) => `Portrait of ${name}`,
  portraitUnavailableAria: (name) => `Portrait unavailable for ${name}`,
  compatibilityAria: (pct) => `Compatibility: ${pct} percent`,
  matchWord: 'match',
  shareTitle: 'My ideological profile | 12axes.lol',
  shareTopMatch: 'Top match',
  shareCountry: 'Most compatible country',
  sharePersonality: 'Personality',
  shareResultLabel: 'MY RESULT',
  shareMostCompatible: 'MOST COMPATIBLE',
  shareYourAxes: 'YOUR 12 AXES',
  shareOtherPersonalities: 'OTHER PERSONALITIES',
  shareNearbyCountries: 'NEARBY COUNTRIES',
  shareFooterCta: 'DISCOVER YOUR PROFILE',
  shareFooterUrl: '12AXES.LOL',
  supportEyebrow: 'READ YOUR PROFILE',
  supportTitle: 'What your political',
  supportTitleEm: ' profile measures',
  supportLead:
    'A political quiz is more useful when it shows more than a single left–right label. This profile separates your answers into political dimensions so you can see where your views are consistent, mixed, or still developing.',
  supportAreas: [
    { title: 'Economy and ownership', text: 'Public services, private property, planning, and markets.' },
    { title: 'Power and institutions', text: 'Democracy, representation, federalism, security, and liberty.' },
    { title: 'Culture and society', text: 'Immigration, religion, morality, identity, and social change.' },
    { title: 'International outlook', text: 'Diplomacy, intervention, national interests, and global trade.' },
    { title: 'Technology and the future', text: 'Technology, biology, innovation, and preservation.' }
  ],
  ossEyebrow: 'INTERPRETING THE RESULT',
  ossTitle: 'A political profile is more than a label',
  ossLead: 'Your result combines scores across 12 political dimensions with comparison profiles. Use the matches as a way to explore similarities, not as a fixed identity or political recommendation.',
  ossCards: [
    { title: 'Read the axes first', text: 'Each score shows how strongly your answers lean toward one side of a political dimension.' },
    { title: 'Compare the pattern', text: 'Ideology and profile matches are based on similarities across multiple dimensions, not on one answer.' },
    { title: 'Look for mixed views', text: 'It is normal to hold different positions on economics, culture, power, liberty, and foreign policy.' },
    { title: 'Use the result as a starting point', text: 'A political profile can help you ask better questions and understand your own views more clearly.' }
  ],
  ossBarText: 'Explore your political profile across 12 dimensions and learn how the result is calculated.',
  ossPrimaryCta: 'Start the political quiz',
  ossSecondaryCta: 'How the scoring works',
};

// Spanish is a first-class locale. The shared dictionary keeps every UI key
// present, while the reviewed Spanish overrides below take precedence over
// the machine-assisted fallback resource. Future locales only need another
// registry entry, dictionary, and data overlay.
function mergeLocale(base: any, override: any): any {
  if (Array.isArray(override)) return override;
  if (override && typeof override === 'object') {
    const merged = { ...(base ?? {}) };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = mergeLocale(merged[key], value);
    }
    return merged;
  }
  return override;
}

const es: Strings = {
  ...mergeLocale(en, ES_AUTO_OVERRIDES),
  htmlLang: 'es',
  docTitle: 'Political Quiz and Ideology Test across 12 Axes | 12axes.lol',
  loadingAnalysis: 'Analizando tu perfil…',
  loadingQuiz: 'Cargando el quiz político…',
  loadingResult: 'Calculando tu resultado…',
  tryAgain: 'Intentar de nuevo',
  skipToContent: 'Saltar al contenido',
  mainNavAria: 'Navegación principal',
  navHow: 'Cómo funciona',
  navAxes: '12 ejes',
  navSpectrum: 'Espectro',
  navFaq: 'Preguntas frecuentes',
  navIdeologies: 'Ideologías',
  navPersonalities: 'Personalidades',
  navCountries: 'Países',
  navSupport: 'Perfil',
  langToggleLabel: 'ES',
  langToggleAria: 'Cambiar idioma',
  redoQuiz: 'Repetir el quiz',
  restartQuiz: 'Reiniciar el quiz',
  heroEyebrow: 'QUIZ POLÍTICO Y TEST IDEOLÓGICO',
  introLead: 'Descubre tu posición política en 12 dimensiones y compara tu perfil con ideologías, países y personalidades.',
  startQuiz: 'Empezar el quiz',
  seeAxes: 'Ver los 12 ejes',
  heroTeaserLabel: 'Tu perfil político',
  heroTeaserTag: '12 dimensiones',
  axisInfoAria: (label) => `Más información sobre ${label}`,
  closeLabel: 'Cerrar',
  personalityInfoAria: (name) => `Más información sobre ${name}`,
  closenessTitle: 'Compatibilidad',
  closenessYou: 'Tú',
  howEyebrow: 'CÓMO FUNCIONA',
  howTitle: 'Una lectura más amplia de tus opiniones',
  howLead: 'El quiz distribuye tus respuestas en 12 ejes políticos para mostrar patrones, matices y combinaciones de ideas.',
  axesGuideEyebrow: 'LOS 12 EJES',
  discoveryEyebrow: 'DESCUBRE TU PERFIL',
  exampleEyebrow: 'EJEMPLO DE RESULTADO',
  exampleCta: 'Explorar este resultado',
  spectrumEyebrow: 'ESPECTRO POLÍTICO',
  faqTitle: 'Preguntas frecuentes',
  faqLead: 'Respuestas sobre el quiz político, el cálculo y la interpretación del resultado.',
  navStart: 'Empezar',
  menuAria: 'Abrir menú',
  backToStart: 'Volver al inicio',
  depthLabel: 'Profundidad',
  recommended: 'Recomendado',
  back: 'Atrás',
  next: 'Siguiente',
  calculating: 'Calculando…',
  seeResult: 'Ver resultado',
  archetypeSkip: 'Omitir',
  errMissingAnswer: 'Aún debes responder esta pregunta antes de ver el resultado.',
  errLoadQuiz: 'No se pudo cargar el quiz.',
  errCalc: 'No se pudo calcular el resultado.',
  errImage: 'No se pudo generar la imagen del resultado.',
  errHttp: (status) => `Error HTTP ${status}`,
  resultsEyebrow: 'Análisis completo',
  resultsH1Pre: 'Tu perfil ',
  resultsH1Em: 'ideológico',
  resultsLead: (count) => `Análisis basado en ${count} respuestas distribuidas en 12 dimensiones fundamentales de la ideología política.`,
  resultsLeadShared: 'Resultado compartido: tu posición en los 12 ejes políticos y las compatibilidades calculadas a partir de ella.',
  resultsSummaryAria: 'Resumen del análisis',
  metaAnswered: 'Preguntas respondidas',
  metaAxes: 'Ejes analizados',
  metaTop: 'Mayor compatibilidad',
  axesSectionEyebrow: 'Ejes políticos',
  axesSectionTitle: 'Resultado porcentual por eje',
  proximityEyebrow: 'Proximidad ideológica',
  otherMatches: 'Otras compatibilidades',
  countriesSectionTitle: 'Países más cercanos a ti',
  countryCurrentTab: 'Actuales',
  countryHistoricalTab: 'Históricos',
  countriesDistantTitle: 'Más alejados de ti',
  personalitiesSectionTitle: 'Personalidades más cercanas a ti',
  booksEyebrow: 'Para profundizar',
  booksTitle: 'Lecturas recomendadas',
  booksCta: 'Ver en Amazon',
  redoAnalysis: 'Repetir el análisis',
  share: 'Compartir',
  saveOrShare: 'Compartir resultado',
  generatingPng: 'Generando PNG…',
  generatingPdf: 'Generando PDF…',
  downloadPdf: 'Descargar PDF',
  shareTitle: 'Mi perfil ideológico | 12axes.lol',
  shareTopMatch: 'Mayor compatibilidad',
  shareCountry: 'País más compatible',
  sharePersonality: 'Personalidad',
  shareResultLabel: 'MI RESULTADO',
  shareMostCompatible: 'MAYOR COMPATIBILIDAD',
  shareYourAxes: 'TUS 12 EJES',
  shareOtherPersonalities: 'OTRAS PERSONALIDADES',
  shareNearbyCountries: 'PAÍSES CERCANOS',
  shareFooterCta: 'DESCUBRE TU PERFIL',
  shareFooterUrl: '12AXES.LOL',
  axisExplanations: {
    estrutura: 'Mide si prefieres distribuir el poder entre estados, ciudades y comunidades locales o un Estado nacional unitario con leyes y dirección más uniformes.',
    representacao: 'Compara la confianza en las elecciones, la oposición y las instituciones democráticas con la preferencia por un liderazgo fuerte, la tecnocracia, la monarquía o regímenes autoritarios.',
    poder: 'Evalúa el equilibrio entre orden, vigilancia, castigo y control estatal frente a la privacidad, la libertad individual y la autonomía civil.',
    imigracao: 'Observa si valoras la asimilación cultural, el idioma y la identidad nacional o el multiculturalismo, la migración abierta y la pluralidad de costumbres.',
    diplomacia: 'Analiza tu posición sobre fuerzas armadas, armas, disuasión e intervención militar frente a la negociación, el pacifismo y las organizaciones internacionales.',
    intervencao: 'Mide la inclinación entre el no intervencionismo exterior y una soberanía nacional más activa, el nacionalismo geopolítico y la defensa de los intereses nacionales.',
    economia: 'Compara la preferencia por la propiedad pública, las empresas estatales y los servicios colectivos con la propiedad privada, la privatización y el liderazgo empresarial.',
    controle: 'Evalúa la planificación estatal, la regulación y la política económica activa frente a los mercados libres, la baja intervención y la competencia.',
    comercio: 'Mide el proteccionismo, la soberanía productiva y la defensa de la industria nacional frente al globalismo, el libre comercio y la integración económica internacional.',
    religiao: 'Compara el laicismo, la separación entre religión y Estado y la crítica a los privilegios religiosos con la influencia pública de la fe y los valores religiosos.',
    moral: 'Evalúa el progresismo cultural, los derechos civiles y el cambio social frente a la tradición, la familia, las costumbres y el conservadurismo moral.',
    tecnologia: 'Mide el entusiasmo por la tecnología, la inteligencia artificial, la ingeniería genética y el desarrollo técnico frente a la cautela biológica, ambiental y preservacionista.'
  },
  supportEyebrow: 'LEE TU PERFIL',
  supportTitle: 'Qué mide tu perfil ',
  supportTitleEm: 'político',
  ossEyebrow: 'INTERPRETA EL RESULTADO',
  ossTitle: 'Un perfil político es más que una etiqueta',
  ossLead: 'Tu resultado combina puntuaciones en 12 dimensiones políticas con perfiles de comparación. Úsalo para explorar similitudes, no como una identidad fija.',
  ossPrimaryCta: 'Empezar el quiz político',
  ossSecondaryCta: 'Cómo funciona la puntuación',
  progress: (current, total) => `Pregunta ${current} de ${total}`,
  progressDone: (percent) => `${percent}% completado`,
  archetypeHeader: 'Identificando tu arquetipo',
  archetypeStep: (current, total) => `${current} de ${total}`,
  progressAria: (percent) => `Progreso del quiz: ${percent}%`,
  answersAria: 'Opciones de respuesta',
  countryKicker: 'País más compatible',
  flagLabel: 'Bandera',
  flagHistoricLabel: 'Bandera o símbolo histórico',
  flagAlt: (label, name) => `${label} de ${name}`,
  flagUnavailable: 'Bandera no disponible',
  flagUnavailableAria: (name) => `Bandera no disponible para ${name}`,
  personalityKicker: 'Personalidad más compatible',
  portraitAlt: (name) => `Retrato de ${name}`,
  portraitUnavailableAria: (name) => `Retrato no disponible de ${name}`,
  compatibilityAria: (pct) => `Compatibilidad: ${pct} por ciento`,
  matchWord: 'compatibilidad',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `Descubrí mi perfil ideológico en el Political Quiz de 12 Axes.\n\n` +
    `Ideología más compatible: ${ideology} (${ideologyPct}%)\n` +
    `País más compatible: ${country} (${countryPct}%)\n` +
    `Personalidad más compatible: ${personality} (${personalityPct}%)\n\n` +
    `Haz el test: https://12axes.lol/`
};

export const t: Strings = LANG === 'en' ? en : LANG === 'es' ? es : pt;
