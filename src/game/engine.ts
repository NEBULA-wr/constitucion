export type GameMode = 'caso' | 'escape' | 'defiende' | 'batalla' | 'desafio';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface GameAnswerFeedback {
  isCorrect: boolean;
  scoreGained: number;
  streak: number;
  explanation: string;
  articleCited: string;
  articleNumber: number;
  newBadges: Badge[];
}

export interface CaseCitizen {
  id: string;
  title: string;
  characterName: string;
  characterRole: string;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    articleNumber: number;
  }[];
  category: string;
}

export interface ConstitutionalRiddle {
  id: string;
  sealName: string;
  sealColor: string;
  chamberDescription: string;
  riddleText: string;
  hints: string[];
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    articleNumber: number;
  }[];
}

export interface RightDefenseItem {
  id: string;
  situation: string;
  correctRightType: 'Vida y Dignidad' | 'Libertad y Seguridad' | 'Salud y Educación' | 'Medio Ambiente' | 'Reforma 2024';
  articleNumber: number;
  explanation: string;
}

export interface BattleRoundItem {
  id: string;
  prompt: string;
  timeLimitSecs: number;
  options: string[];
  correctIndex: number;
  articleNumber: number;
  explanation: string;
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'Primer Constituyente',
    description: 'Resolviste tu primera controversia ciudadana.',
    icon: 'Scroll'
  },
  {
    id: 'badge-streak-master',
    title: 'Escudo de Oro',
    description: 'Lograste una racha de 5 aciertos consecutivos.',
    icon: 'ShieldCheck'
  },
  {
    id: 'badge-magistrate',
    title: 'Magistrado Supremo',
    description: 'Descifraste los 3 Sellos en el Escape Constitucional.',
    icon: 'Crown'
  },
  {
    id: 'badge-speedy',
    title: 'Tribuno Relámpago',
    description: 'Respondiste correctamente en menos de 5 segundos.',
    icon: 'Zap'
  },
  {
    id: 'badge-reforma-2024',
    title: 'Guardián Pétreo',
    description: 'Dominaste el blindaje institucional de la Reforma 2024.',
    icon: 'Anchor'
  },
  {
    id: 'badge-champion',
    title: 'Padre de la Carta Magna',
    description: 'Alcanzaste más de 1,500 puntos de honor republicano.',
    icon: 'Award'
  }
];

export const CASOS_CIUDADANOS: CaseCitizen[] = [
  {
    id: 'caso-1',
    title: 'Detención Prolongada sin Juez',
    characterName: 'Pedro Martínez',
    characterRole: 'Ciudadano de Villa Mella',
    scenario: 'Pedro fue detenido preventivamente en un operativo policial el viernes a las 6:00 PM. Han pasado 60 horas y aún no ha sido llevado ante un juez ni se le han formulado cargos oficiales.',
    question: '¿Qué derecho fundamental ha sido vulnerado y qué acción jurídica constitucional corresponde?',
    options: [
      {
        id: 'opt-1a',
        text: 'Vulnera el Art. 40. Debe solicitarse un recurso de Habeas Corpus por exceder las 48 horas sin orden ni presentación judicial.',
        isCorrect: true,
        explanation: 'El Art. 40.5 de la Constitución dominicana exige presentar a todo detenido ante autoridad judicial dentro de las 48 horas.',
        articleNumber: 40
      },
      {
        id: 'opt-1b',
        text: 'La policía puede retener hasta 72 horas si es fin de semana según los reglamentos internos.',
        isCorrect: false,
        explanation: 'Falso: Ningún reglamento policial puede estar por encima de la Constitución (Art. 6 - Supremacía Constitucional). El límite es de 48 horas perentorias.',
        articleNumber: 6
      },
      {
        id: 'opt-1c',
        text: 'Se debe esperar al lunes laborable para presentar la queja ante el fiscal del distrito.',
        isCorrect: false,
        explanation: 'La libertad personal es una garantía continua; el Habeas Corpus puede ser interpuesto a cualquier hora en defensa de la libertad física.',
        articleNumber: 40
      }
    ],
    category: 'Libertad Personal'
  },
  {
    id: 'caso-2',
    title: 'Acceso a la Educación Pública',
    characterName: 'Doña Rosa y su nieta Camila',
    characterRole: 'Familia en San Cristóbal',
    scenario: 'El director de una escuela pública le exige a Doña Rosa pagar una "cuota obligatoria de matrícula de RD$ 2,500" para poder inscribir a Camila en quinto de primaria, alegando falta de pintura en el plantel.',
    question: '¿Cuál es el mandato de la Constitución frente a este cobro en una escuela pública?',
    options: [
      {
        id: 'opt-2a',
        text: 'El cobro es legal siempre que la asociación de padres lo haya acordado en asamblea general.',
        isCorrect: false,
        explanation: 'Incorrecto. Ningún acuerdo privado puede condicionar el derecho humano a la educación garantizado por la Carta Magna.',
        articleNumber: 63
      },
      {
        id: 'opt-2b',
        text: 'El Art. 63 consagra que en los establecimientos del Estado la educación es obligatoria y gratuita. El cobro es nulo de pleno derecho.',
        isCorrect: true,
        explanation: 'El Art. 63 numeral 3 establece taxativamente que la educación impartida por el Estado es gratuita y obligatoria.',
        articleNumber: 63
      },
      {
        id: 'opt-2c',
        text: 'Solo la educación universitaria está protegida con gratuidad absoluta en el país.',
        isCorrect: false,
        explanation: 'Al contrario: la gratuidad constitucional obligatoria abarca los niveles inicial, básico y medio.',
        articleNumber: 63
      }
    ],
    category: 'Derecho a la Educación'
  },
  {
    id: 'caso-3',
    title: 'Vertido Industrial en el Río Ozama',
    characterName: 'Comunidad La Ciénaga',
    characterRole: 'Junta de Vecinos',
    scenario: 'Una fábrica química está arrojando residuos tóxicos directamente al río Ozama de madrugada, provocando muerte de peces y enfermedades respiratorias en los niños de la ribera.',
    question: '¿Qué mecanismo constitucional asiste a los comunitarios para detener inmediatamente el daño ecológico?',
    options: [
      {
        id: 'opt-3a',
        text: 'Acción de Amparo Ambiental colectivo sustentada en el Art. 67 (Protección del Medio Ambiente).',
        isCorrect: true,
        explanation: 'El Art. 67 protege el medio ambiente sano para las generaciones presentes y futuras, y el Art. 72 faculta a cualquier persona a interponer el Amparo.',
        articleNumber: 67
      },
      {
        id: 'opt-3b',
        text: 'Esperar a que termine el año fiscal para que el Ministerio de Hacienda multe a la empresa.',
        isCorrect: false,
        explanation: 'La tutela judicial de los derechos fundamentales es inmediata y preferente; no tolera dilaciones administrativas.',
        articleNumber: 72
      },
      {
        id: 'opt-3c',
        text: 'Los vecinos no tienen personería jurídica si no son dueños del agua del río.',
        isCorrect: false,
        explanation: 'Los ríos y recursos naturales son bienes de dominio público de la Nación dominicana pertenecientes a todo el pueblo.',
        articleNumber: 15
      }
    ],
    category: 'Medio Ambiente'
  },
  {
    id: 'caso-4',
    title: 'La Cláusula Pétrea y la Reforma 2024',
    characterName: 'Lic. Valenzuela',
    characterRole: 'Profesor de Derecho Constitucional',
    scenario: 'Durante un debate político, un sector propone someter un proyecto de ley para autorizar al presidente en funciones a postularse para un tercer mandato consecutivo modificando la Carta Magna.',
    question: '¿Qué disponen los artículos 268 y 278 incorporados en la Reforma de 2024?',
    options: [
      {
        id: 'opt-4a',
        text: 'La Cláusula Pétrea prohíbe que cualquier funcionario electo se beneficie de una reforma a las reglas de permanencia durante su mandato.',
        isCorrect: true,
        explanation: 'Los Arts. 268 y 278 blindan las reglas de elección presidencial para evitar reformas constitucionales a conveniencia del gobernante de turno.',
        articleNumber: 268
      },
      {
        id: 'opt-4b',
        text: 'La reelección indefinida es permitida siempre que haya un plebiscito popular aprobatorio.',
        isCorrect: false,
        explanation: 'Falso. El modelo dominicano consagra el límite de dos períodos presidenciales y nunca más (sistema estadounidense/dominicano).',
        articleNumber: 124
      },
      {
        id: 'opt-4c',
        text: 'La Constitución de 2024 eliminó los límites temporales para facilitar la continuidad gubernamental.',
        isCorrect: false,
        explanation: 'Completamente incorrecto: la Reforma de 2024 tuvo como objetivo primordial blindar los límites presidenciales.',
        articleNumber: 278
      }
    ],
    category: 'Reforma 2024'
  }
];

export const CONSTITUTIONAL_RIDDLES: ConstitutionalRiddle[] = [
  {
    id: 'sello-1',
    sealName: 'El Sello de la Soberanía',
    sealColor: '#002F6C',
    chamberDescription: 'Te encuentras en la Cámara de la Cuna de la Constitución en San Cristóbal, 1844. En el pedestal reposa un escudo con la cruz blanca.',
    riddleText: '«Ni reyes extranjeros ni mandos arbitrarios: solo de nosotros emana todo poder público. No estoy en una persona ni en un partido, resido en el pueblo entero. ¿Qué principio fundamental custodio?»',
    hints: [
      'Está consagrado en el Artículo 2 de la Constitución.',
      'Define de dónde brota toda la autoridad del gobierno civil.'
    ],
    options: [
      {
        id: 'r1-a',
        text: 'La Soberanía Popular (Art. 2)',
        isCorrect: true,
        explanation: 'Art. 2: «La soberanía reside exclusivamente en el pueblo, de quien emanan todos los poderes».',
        articleNumber: 2
      },
      {
        id: 'r1-b',
        text: 'El Veto Presidencial Absoluto',
        isCorrect: false,
        explanation: 'El veto presidencial es una atribución reglada, no el origen de la soberanía nacional.',
        articleNumber: 102
      },
      {
        id: 'r1-c',
        text: 'El Fuero Parlamentario',
        isCorrect: false,
        explanation: 'La inmunidad legislativa es una protección funcional de los legisladores, no la soberanía de la patria.',
        articleNumber: 86
      }
    ]
  },
  {
    id: 'sello-2',
    sealName: 'El Sello de la Dignidad Inviolable',
    sealColor: '#CE1126',
    chamberDescription: 'En la Galería de los Derechos del Hombre, una balanza dorada brilla sobre mármol crema. Una inscripción tallada en bronce interroga al visitante.',
    riddleText: '«Nazco con cada dominicano y extranjero en esta tierra. Nadie me otorga como regalo y ningún tribunal me puede despojar. Si me pisoteas, el Estado pierde toda legitimidad moral. ¿Qué derecho supremo soy?»',
    hints: [
      'El Artículo 38 la proclama sagrada, innata e inviolable.',
      'Es el fundamento mismo sobre el cual se levantan todos los demás derechos humanos.'
    ],
    options: [
      {
        id: 'r2-a',
        text: 'La Dignidad Humana (Art. 38)',
        isCorrect: true,
        explanation: 'Art. 38: «La dignidad del ser humano es sagrada, innata e inviolable; su respeto y protección constituyen una responsabilidad esencial de los poderes públicos».',
        articleNumber: 38
      },
      {
        id: 'r2-b',
        text: 'El Registro Mercantil',
        isCorrect: false,
        explanation: 'El registro mercantil es un trámite comercial, no un derecho fundamental humano.',
        articleNumber: 50
      },
      {
        id: 'r2-c',
        text: 'El Pasaporte Diplomático',
        isCorrect: false,
        explanation: 'Es un documento oficial de viaje, no la dignidad innata del ser humano.',
        articleNumber: 46
      }
    ]
  },
  {
    id: 'sello-3',
    sealName: 'El Sello de la Supremacía',
    sealColor: '#E5A93C',
    chamberDescription: 'En el Gran Salón del Tribunal Constitucional, una réplica gigante de la Carta Magna reposa abierta sobre un atril dorado.',
    riddleText: '«Si un ministro firma un decreto que me contradice, ese decreto se convierte en humo sin valor. Ni el Presidente está por encima de mis páginas. ¿Qué artículo fulmina con nulidad absoluta todo lo que me desafíe?»',
    hints: [
      'Es la piedra angular de todo el sistema legal dominicano.',
      'Declara que son nulos de pleno derecho todo acto contrario a la Constitución.'
    ],
    options: [
      {
        id: 'r3-a',
        text: 'El Artículo 6 — Supremacía de la Constitución',
        isCorrect: true,
        explanation: 'Art. 6: «Son nulos de pleno derecho toda ley, decreto, resolución, reglamento o acto contrarios a esta Constitución».',
        articleNumber: 6
      },
      {
        id: 'r3-b',
        text: 'El Reglamento de Tránsito de la Digesett',
        isCorrect: false,
        explanation: 'Los reglamentos de tránsito son normas subordinadas de rango inferior a las leyes y a la Constitución.',
        articleNumber: 6
      },
      {
        id: 'r3-c',
        text: 'El Código Postal Nacional',
        isCorrect: false,
        explanation: 'Es un sistema de codificación geográfica postal.',
        articleNumber: 1
      }
    ]
  }
];

export const RIGHT_DEFENSE_ITEMS: RightDefenseItem[] = [
  {
    id: 'rd-1',
    situation: 'Un agente policial detiene a un ciudadano sin orden de arresto y lo retiene incomunicado durante 3 días.',
    correctRightType: 'Libertad y Seguridad',
    articleNumber: 40,
    explanation: 'Viola el Art. 40 (Libertad y seguridad personal; límite estricto de 48 horas).'
  },
  {
    id: 'rd-2',
    situation: 'Un centro de salud de urgencia niega atender a una persona en paro cardíaco por no portar tarjeta de seguro.',
    correctRightType: 'Salud y Educación',
    articleNumber: 61,
    explanation: 'El Art. 61 tutela el derecho fundamental a la salud integral de toda persona.'
  },
  {
    id: 'rd-3',
    situation: 'Una empresa minera arroja químicos tóxicos en la cabecera de una cuenca hídrica protegida.',
    correctRightType: 'Medio Ambiente',
    articleNumber: 67,
    explanation: 'El Art. 67 prohíbe la degradación de los recursos naturales y la contaminación de las fuentes de agua.'
  },
  {
    id: 'rd-4',
    situation: 'Un gobernante intenta promover una ley para extender retroactivamente su período presidencial a 6 años.',
    correctRightType: 'Reforma 2024',
    articleNumber: 278,
    explanation: 'El Art. 278 prohíbe que un funcionario se beneficie durante su mandato de reformas a su régimen electoral.'
  },
  {
    id: 'rd-5',
    situation: 'Un detenido es sometido a tratos crueles, denigrantes o torturas psicológicas durante su interrogatorio.',
    correctRightType: 'Vida y Dignidad',
    articleNumber: 38,
    explanation: 'El Art. 38 y Art. 42 prohíben de manera absoluta la tortura y los tratos inhumanos.'
  }
];

export const BATTLE_ROUNDS: BattleRoundItem[] = [
  {
    id: 'bat-1',
    prompt: '¿En qué fecha y ciudad fue proclamada la primera Constitución dominicana?',
    timeLimitSecs: 12,
    options: [
      '6 de noviembre de 1844 en San Cristóbal',
      '27 de febrero de 1844 en Santo Domingo',
      '16 de agosto de 1863 en Santiago',
      '29 de abril de 1963 en La Vega'
    ],
    correctIndex: 0,
    articleNumber: 1,
    explanation: 'La Carta Magna fundacional nació el 6 de noviembre de 1844 en la villa de San Cristóbal.'
  },
  {
    id: 'bat-2',
    prompt: '¿Qué órgano es el garante supremo de la Constitución creado en la reforma del 2010?',
    timeLimitSecs: 10,
    options: [
      'El Tribunal Constitucional',
      'La Cámara de Cuentas',
      'La Defensoría Policial',
      'La Junta Central Electoral'
    ],
    correctIndex: 0,
    articleNumber: 184,
    explanation: 'El Tribunal Constitucional (Art. 184) garantiza la supremacía y el orden constitucional de la República.'
  },
  {
    id: 'bat-3',
    prompt: '¿Cuál es la regla fundamental de la Reforma 2024 sobre el Procurador General de la República?',
    timeLimitSecs: 12,
    options: [
      'El Presidente lo propone al Consejo Nacional de la Magistratura para dotarlo de independencia técnica',
      'Es elegido por votación popular directa cada 2 años',
      'Es un cargo vitalicio no sujeto a escrutinio',
      'Es nombrado por el Senado de manera irrevocable'
    ],
    correctIndex: 0,
    articleNumber: 171,
    explanation: 'La Reforma 2024 desvincula la designación puramente discrecional del Procurador General para fortalecer la lucha contra la impunidad.'
  },
  {
    id: 'bat-4',
    prompt: 'Según el Artículo 37 de la Constitución, ¿cuándo es aplicable la pena de muerte en la República Dominicana?',
    timeLimitSecs: 8,
    options: [
      'En ningún caso (está prohibida de manera absoluta)',
      'Solo en casos de traición militar en guerra extranjera',
      'Cuando lo aprueben las dos cámaras del Congreso',
      'Para delitos de lesa humanidad confirmados'
    ],
    correctIndex: 0,
    articleNumber: 37,
    explanation: 'El Art. 37 establece: «No podrá establecerse, pronunciarse ni aplicarse, en ningún caso, la pena de muerte».'
  }
];

export interface GameState {
  currentMode: GameMode;
  score: number;
  streak: number;
  maxStreak: number;
  lives: number;
  unlockedBadgeIds: string[];
  completedCasos: string[];
  unlockedSeals: string[];
  totalQuestionsAnswered: number;
  totalCorrect: number;
  rankTitle: string;
}

export function createInitialGameState(): GameState {
  return {
    currentMode: 'caso',
    score: 0,
    streak: 0,
    maxStreak: 0,
    lives: 3,
    unlockedBadgeIds: [],
    completedCasos: [],
    unlockedSeals: [],
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    rankTitle: 'Novicio Constituyente'
  };
}

export function calculatePoints(basePoints: number, streak: number, responseTimeSecs?: number): number {
  const streakBonus = Math.min(streak * 25, 200);
  let speedBonus = 0;
  if (responseTimeSecs !== undefined) {
    if (responseTimeSecs < 4) speedBonus = 100;
    else if (responseTimeSecs < 7) speedBonus = 50;
    else if (responseTimeSecs < 10) speedBonus = 25;
  }
  return basePoints + streakBonus + speedBonus;
}

export function determineRank(score: number): string {
  if (score >= 2000) return 'Padre de la Carta Magna';
  if (score >= 1400) return 'Magistrado del Tribunal Constitucional';
  if (score >= 900) return 'Tribuno de la República';
  if (score >= 500) return 'Defensor de los Derechos';
  if (score >= 200) return 'Estudioso de las Leyes';
  return 'Novicio Constituyente';
}

export function checkNewBadges(state: GameState, responseTimeSecs?: number): Badge[] {
  const newBadges: Badge[] = [];

  const addIfNew = (badgeId: string) => {
    if (!state.unlockedBadgeIds.includes(badgeId)) {
      const b = ALL_BADGES.find(item => item.id === badgeId);
      if (b) {
        newBadges.push(b);
        state.unlockedBadgeIds.push(badgeId);
      }
    }
  };

  if (state.totalCorrect >= 1) {
    addIfNew('badge-first-step');
  }

  if (state.streak >= 5 || state.maxStreak >= 5) {
    addIfNew('badge-streak-master');
  }

  if (state.unlockedSeals.length >= 3) {
    addIfNew('badge-magistrate');
  }

  if (responseTimeSecs !== undefined && responseTimeSecs <= 4) {
    addIfNew('badge-speedy');
  }

  if (state.completedCasos.includes('caso-4')) {
    addIfNew('badge-reforma-2024');
  }

  if (state.score >= 1500) {
    addIfNew('badge-champion');
  }

  return newBadges;
}
