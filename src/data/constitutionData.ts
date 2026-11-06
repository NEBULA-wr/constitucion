export interface ConstitutionalArticle {
  number: number;
  title: string;
  category: 'principios' | 'derechos' | 'deberes' | 'poderes' | 'orden_constitucional' | 'reforma2024';
  officialText: string;
  simpleExplanation: string;
  practicalExample: string;
  keywords: string[];
  icon: string;
}

export interface HistoricalMilestone {
  year: number;
  title: string;
  location: string;
  summary: string;
  highlights: string[];
  significance: string;
  quote?: string;
  imageUrl?: string;
}

export interface PowerOfTheState {
  id: 'ejecutivo' | 'legislativo' | 'judicial' | 'tribunal-constitucional';
  name: string;
  leaderTitle: string;
  seat: string;
  seatDescription: string;
  constitutionArticles: string;
  functions: string[];
  checksAndBalances: string;
  color: string;
}

export const HISTORICAL_MILESTONES: HistoricalMilestone[] = [
  {
    year: 1844,
    title: "Constitución de San Cristóbal",
    location: "San Cristóbal, República Dominicana",
    summary: "El 6 de noviembre de 1844 se firma la primera Constitución dominicana, meses después de la proclamación de Independencia el 27 de febrero.",
    highlights: [
      "Inspirada en las constituciones de EE.UU., Francia y Cádiz de 1812.",
      "Consagró la soberanía de la nación y la división tripartita de poderes.",
      "Incluyó el polémico Artículo 210 exigido por Pedro Santana, que otorgaba facultades dictatoriales al presidente durante el estado de guerra."
    ],
    significance: "Nacimiento jurídico formal de la República Dominicana como Estado soberano e independiente.",
    quote: "Los dominicanos se constituyen en nación soberana bajo un gobierno esencialmente civil, republicano, popular, representativo, electivo y responsable."
  },
  {
    year: 1854,
    title: "Reformas de Febrero y Diciembre de 1854",
    location: "Santo Domingo",
    summary: "Se eliminó el controvertido Artículo 210 y se amplió el catálogo de libertades ciudadanas, fortaleciendo el rol del Poder Legislativo.",
    highlights: [
      "Derogación del régimen de excepción permanente.",
      "Fortalecimiento del Senado Consultor.",
      "Regulación de los estados de sitio."
    ],
    significance: "Primer gran intento de limitar el absolutismo presidencialista inicial."
  },
  {
    year: 1858,
    title: "Constitución Liberal de Moca",
    location: "Moca, Espaillat",
    summary: "Surgida de la Revolución de 1857 contra Buenaventura Báez. Considerada una de las constituciones más democráticas y progresistas del siglo XIX.",
    highlights: [
      "Consagró el sufragio universal directo.",
      "Abolición irrevocable de la pena de muerte por motivos políticos.",
      "Descentralización administrativa y autonomía municipal.",
      "Garantía inviolable de la libertad de prensa y reunión."
    ],
    significance: "El faro del liberalismo institucional dominicano redactado por los intelectuales del Cibao."
  },
  {
    year: 1963,
    title: "Constitución de Juan Bosch",
    location: "Santo Domingo",
    summary: "Proclamada el 29 de abril de 1963 bajo el gobierno del Prof. Juan Bosch tras décadas de tiranía trujillista. Una obra cumbre de justicia social.",
    highlights: [
      "Prohibición del latifundio y consagración del derecho de los trabajadores a participar en los beneficios de las empresas.",
      "Igualdad jurídica total de los hijos dentro y fuera del matrimonio.",
      "Educación laica y gratuita garantizada como derecho humano.",
      "Consagración del trabajo como base primordial de la organización social."
    ],
    significance: "La Constitución más avanzada en derechos sociales, económicos y laborales del Caribe en el siglo XX."
  },
  {
    year: 2010,
    title: "Revolución Constitucional de 2010",
    location: "Santo Domingo",
    summary: "Proclamada el 26 de enero de 2010. Transformó a la República Dominicana en un Estado Social y Democrático de Derecho con garantías efectivas.",
    highlights: [
      "Creación del Tribunal Constitucional (órgano supremo de interpretación).",
      "Creación del Tribunal Superior Electoral y del Consejo del Poder Judicial.",
      "Incorporación del Amparo, Habeas Data y acción directa de inconstitucionalidad.",
      "Extenso catálogo de derechos fundamentales de tercera generación (medio ambiente, patrimonio cultural, derechos del consumidor)."
    ],
    significance: "Modernización institucional total y establecimiento del modelo garantista contemporáneo."
  },
  {
    year: 2024,
    title: "Reforma de Blindaje Democrático 2024",
    location: "Asamblea Nacional, Santo Domingo",
    summary: "Proclamada el 27 de octubre de 2024. Diseñada para garantizar la estabilidad constitucional y despersonalizar las reformas presidenciales.",
    highlights: [
      "Cláusula Pétrea (Art. 268 & 278): Ningún gobernante podrá promover reformas para beneficiarse de una reelección o alterar los términos de su mandato.",
      "Independencia del Ministerio Público: El Procurador General de la República será propuesto al Consejo Nacional de la Magistratura con criterio técnico, no por libre decreto.",
      "Unificación de elecciones: A partir de mayo de 2032, las elecciones presidenciales, congresuales y municipales se celebrarán en un solo día.",
      "Reducción de la Cámara de Diputados de 190 a 170 escaños para mayor eficiencia legislativa."
    ],
    significance: "Cierre definitivo a los ciclos de modificaciones constitucionales por apetitos de reelección coyunturales."
  }
];

export const POWERS_OF_STATE: PowerOfTheState[] = [
  {
    id: 'ejecutivo',
    name: 'Poder Ejecutivo',
    leaderTitle: 'Presidente de la República',
    seat: 'Palacio Nacional',
    seatDescription: 'Construido en mármol dominicano en 1947, sede de la administración general del Estado.',
    constitutionArticles: 'Artículos 122 al 148',
    functions: [
      'Jefe de Estado, de Gobierno y autoridad suprema de las Fuerzas Armadas y Policía Nacional.',
      'Promulgar y hacer ejecutar las leyes dictadas por el Congreso Nacional.',
      'Dirigir la política exterior y celebrar tratados internacionales.',
      'Administrar la hacienda pública y remitir el Presupuesto General de la Nación.',
      'Nombrar a ministros y funcionarios de la administración pública.'
    ],
    checksAndBalances: 'Debe rendir cuentas anuales el 27 de febrero ante la Asamblea Nacional. Sus decretos están sujetos a control constitucional por el Tribunal Constitucional y sus gastos auditados por la Cámara de Cuentas.',
    color: '#002F6C'
  },
  {
    id: 'legislativo',
    name: 'Poder Legislativo',
    leaderTitle: 'Presidente del Senado & Presidente de la Cámara de Diputados',
    seat: 'Congreso Nacional',
    seatDescription: 'Centro de los Héroes, Santo Domingo. Estructura bicameral representativa.',
    constitutionArticles: 'Artículos 76 al 121',
    functions: [
      'Bicameral: Senado (32 senadores, 1 por provincia y 1 por el Distrito Nacional) y Cámara de Diputados.',
      'Legislar y fiscalizar en representación del pueblo dominicano.',
      'Aprobar o rechazar tratados internacionales y contratos del Estado.',
      'Aprobar el Presupuesto General del Estado.',
      'Elegir a los miembros de la Junta Central Electoral y de la Cámara de Cuentas (Senado).'
    ],
    checksAndBalances: 'Puede interpelar ministros, someter a juicio político a altos funcionarios públicos y rechazar las observaciones presidenciales a las leyes con dos terceras partes.',
    color: '#CE1126'
  },
  {
    id: 'judicial',
    name: 'Poder Judicial',
    leaderTitle: 'Presidente de la Suprema Corte de Justicia',
    seat: 'Palacio de Justicia del Centro de los Héroes',
    seatDescription: 'Órgano rector de la administración de justicia ordinaria en toda la geografía nacional.',
    constitutionArticles: 'Artículos 149 al 183',
    functions: [
      'Administrar justicia para resolver controversias entre personas físicas o morales y el Estado.',
      'Garantizar los derechos reconocidos en la Constitución y las leyes procesales.',
      'La Suprema Corte de Justicia es el tribunal de máxima jerarquía ordinaria (corte de casación).',
      'El Consejo del Poder Judicial administra la carrera judicial y disciplina interna.'
    ],
    checksAndBalances: 'Independencia funcional y presupuestaria garantizada por la Constitución. Sus jueces son designados por el Consejo Nacional de la Magistratura.',
    color: '#E5A93C'
  },
  {
    id: 'tribunal-constitucional',
    name: 'Tribunal Constitucional',
    leaderTitle: 'Presidente del Tribunal Constitucional',
    seat: 'Sede del Tribunal Constitucional de la República Dominicana',
    seatDescription: 'Creado por la Constitución de 2010 como órgano supremo y autónomo de control constitucional.',
    constitutionArticles: 'Artículos 184 al 189',
    functions: [
      'Garantizar la supremacía de la Constitución sobre todas las leyes y decretos.',
      'Defender el orden constitucional y la protección irrevocable de los derechos fundamentales.',
      'Conocer acciones directas de inconstitucionalidad contra leyes, decretos y reglamentos.',
      'Revisar decisiones jurisdiccionales que hayan vulnerado derechos fundamentales.',
      'Sus decisiones son definitivas, irrevocables y constituyen precedentes vinculantes para todos los poderes públicos.'
    ],
    checksAndBalances: 'Órgano extrapoder. Ninguna ley, tribunal o presidente puede desacatar sus sentencias sin incurrir en violación a la Carta Magna.',
    color: '#00A3B4'
  }
];

export const CONSTITUTION_ARTICLES: ConstitutionalArticle[] = [
  {
    number: 1,
    title: "Organización del Estado",
    category: "principios",
    officialText: "El pueblo dominicano constituye una Nación organizada en Estado libre e independiente, con el nombre de República Dominicana. Su gobierno es esencialmente civil, republicano, democrático y representativo.",
    simpleExplanation: "La República Dominicana es un país libre, soberano y gobernado por civiles electos democráticamente por los ciudadanos.",
    practicalExample: "Ningún líder militar puede asumir el poder por la fuerza, y nadie puede vender o ceder la soberanía de la patria a otra nación.",
    keywords: ["soberanía", "democracia", "república", "independiente", "civil"],
    icon: "Shield"
  },
  {
    number: 6,
    title: "Supremacía de la Constitución",
    category: "principios",
    officialText: "Todas las personas y los órganos que ejercen potestades públicas están sujetos a la Constitución, norma suprema y fundamento del ordenamiento jurídico del Estado. Son nulos de pleno derecho toda ley, decreto, resolución, reglamento o acto contrarios a esta Constitución.",
    simpleExplanation: "La Constitución está por encima de todos: del Presidente, de los ministros, de los policías y de los jueces. Si una ley viola la Constitución, no tiene validez legal alguna.",
    practicalExample: "Si el Congreso aprobase una ley que prohíba a las mujeres votar o a los periodistas opinar, esa ley es automáticamente nula porque contradice la Carta Magna.",
    keywords: ["supremacía", "ley", "nulo", "norma suprema", "orden jurídico"],
    icon: "Crown"
  },
  {
    number: 7,
    title: "Estado Social y Democrático de Derecho",
    category: "principios",
    officialText: "La República Dominicana es un Estado Social y Democrático de Derecho, organizado en forma de República unitaria, fundado en el respeto de la dignidad humana, los derechos fundamentales, el trabajo, la soberanía popular y la separación e independencia de los poderes públicos.",
    simpleExplanation: "El Estado dominicano no solo debe evitar abusos, sino que tiene la obligación activa de garantizar bienestar social, educación, salud y dignidad a su población.",
    practicalExample: "El Estado está obligado a construir hospitales, escuelas y asegurar pensiones para dignificar la vida de sus habitantes.",
    keywords: ["estado social", "democracia", "dignidad", "derecho"],
    icon: "Building"
  },
  {
    number: 37,
    title: "Derecho a la Vida",
    category: "derechos",
    officialText: "El derecho a la vida es inviolable desde la concepción hasta la muerte. No podrá establecerse, pronunciarse ni aplicarse, en ningún caso, la pena de muerte.",
    simpleExplanation: "La vida es el derecho humano fundamental más sagrado. En República Dominicana la pena de muerte está terminantemente prohibida.",
    practicalExample: "Incluso frente al peor delito concebible, los tribunales dominicanos no pueden condenar a un reo a muerte.",
    keywords: ["vida", "pena de muerte", "inviolable", "derecho"],
    icon: "Heart"
  },
  {
    number: 38,
    title: "Dignidad Humana",
    category: "derechos",
    officialText: "El Estado se fundamenta en el respeto a la dignidad de la persona y se organiza para la protección real y efectiva de los derechos fundamentales que le son inherentes. La dignidad del ser humano es sagrada, innata e inviolable; su respeto y protección constituyen una responsabilidad esencial de los poderes públicos.",
    simpleExplanation: "Cada ser humano tiene un valor absoluto que nadie le puede arrebatar. Nadie puede ser tratado como un objeto ni humillado por ninguna autoridad.",
    practicalExample: "Las autoridades no pueden torturar ni exhibir humillantemente a los detenidos para escarnio público.",
    keywords: ["dignidad", "sagrada", "humana", "persona", "respeto"],
    icon: "Sparkles"
  },
  {
    number: 39,
    title: "Derecho a la Igualdad",
    category: "derechos",
    officialText: "Todas las personas nacen libres e iguales ante la ley, reciben la misma protección y trato de las instituciones, autoridades y demás personas y gozan de los mismos derechos, libertades y oportunidades, sin ninguna discriminación por razones de género, color, edad, discapacidad, nacionalidad, vínculos familiares, lengua, religión, opinión política o filosófica, condición social o personal.",
    simpleExplanation: "Nadie es más ni menos ante la ley dominicana. No se permite discriminar a nadie por su color de piel, género, religión, riqueza u opinión.",
    practicalExample: "Una empresa no puede rechazar a una persona para un empleo calificado solo por ser mujer o por su color de piel.",
    keywords: ["igualdad", "no discriminación", "género", "ley", "libres"],
    icon: "Scale"
  },
  {
    number: 40,
    title: "Derecho a la Libertad y Seguridad Personal",
    category: "derechos",
    officialText: "Toda persona tiene derecho a la libertad y a la seguridad personal. Nadie podrá ser reducido a prisión ni cohibido en su libertad sin orden motivada y escrita de juez competente, salvo el caso de flagrante delito. Toda persona privada de su libertad debe ser presentada ante autoridad judicial competente dentro de las cuarenta y ocho horas siguientes.",
    simpleExplanation: "Nadie puede ser arrestado sin una orden judicial escrita (a menos que lo atrapen cometiendo el delito in fraganti), y no pueden retenerte más de 48 horas sin presentarte ante un juez.",
    practicalExample: "Si la policía detiene a un ciudadano en una redada sin orden judicial, deben liberarlo o presentarlo ante un juez antes de 48 horas.",
    keywords: ["libertad", "arresto", "48 horas", "seguridad", "juez", "habeas corpus"],
    icon: "LockKeyhole"
  },
  {
    number: 49,
    title: "Libertad de Expresión e Información",
    category: "derechos",
    officialText: "Toda persona tiene derecho a expresar libremente sus pensamientos, ideas y opiniones, por cualquier medio, sin que pueda establecerse censura previa. Toda persona tiene derecho a la información pública veraz, oportuna e imparcial.",
    simpleExplanation: "Puedes opinar, criticar, publicar e investigar sin que el gobierno censure tus ideas antes de que las digas. También tienes derecho a saber qué hace el gobierno con tus impuestos.",
    practicalExample: "Un periodista puede investigar y publicar denuncias de corrupción sin pedirle permiso al gobierno.",
    keywords: ["expresión", "opinión", "prensa", "información", "censura"],
    icon: "Megaphone"
  },
  {
    number: 61,
    title: "Derecho a la Salud",
    category: "derechos",
    officialText: "Toda persona tiene derecho a la salud integral. En consecuencia, el Estado debe velar por la protección de la salud de todas las personas, el acceso al agua potable, el mejoramiento de la alimentación, de los servicios sanitarios, las condiciones higiénicas, el saneamiento ambiental, así como procurar los medios para la prevención y tratamiento de las enfermedades.",
    simpleExplanation: "El Estado tiene el deber ineludible de garantizar que todos tengamos acceso a hospitales, agua potable y tratamientos médicos.",
    practicalExample: "Una emergencia hospitalaria no puede negar la atención de vida a un paciente por no tener dinero en ese instante.",
    keywords: ["salud", "agua potable", "hospitales", "bienestar"],
    icon: "Stethoscope"
  },
  {
    number: 62,
    title: "Derecho al Trabajo",
    category: "derechos",
    officialText: "El trabajo es un derecho, un deber y una función social que se ejerce con la protección y asistencia del Estado. Es finalidad esencial del Estado fomentar el empleo digno y remunerado. Se garantiza el salario igual por trabajo de igual valor, sin discriminación de género ni de ningún otro tipo.",
    simpleExplanation: "Tienes derecho a un empleo digno con salario justo. Una mujer y un hombre que realizan el mismo trabajo con la misma eficiencia deben cobrar exactamente lo mismo.",
    practicalExample: "A igual puesto y responsabilidad, la empresa debe pagar el mismo salario básico sin importar el género.",
    keywords: ["trabajo", "salario igual", "empleo", "laboral"],
    icon: "Briefcase"
  },
  {
    number: 63,
    title: "Derecho a la Educación",
    category: "derechos",
    officialText: "Toda persona tiene derecho a una educación integral, de calidad, permanente, en igualdad de condiciones y oportunidades, sin más limitaciones que las derivadas de sus aptitudes, vocación y aspiraciones. La educación es obligatoria en los niveles inicial, básico y medio. En los establecimientos del Estado es gratuita.",
    simpleExplanation: "La educación pública es un derecho obligatorio y totalmente gratuito desde el nivel inicial hasta el bachillerato.",
    practicalExample: "Ninguna escuela pública puede cobrar una tarifa obligatoria para inscribir a un niño en la escuela.",
    keywords: ["educación", "gratuita", "escuela", "formación"],
    icon: "GraduationCap"
  },
  {
    number: 67,
    title: "Protección del Medio Ambiente",
    category: "derechos",
    officialText: "Es deber del Estado prevenir la contaminación, proteger y mantener el medio ambiente en provecho de las presentes y futuras generaciones. Se prohíbe la introducción, depósito y tránsito por el territorio nacional de desechos tóxicos y peligrosos.",
    simpleExplanation: "Naturaleza, ríos, playas y bosques protegidos para nosotros y para nuestros hijos. Está prohibido traer basura tóxica del extranjero.",
    practicalExample: "Está prohibido talar ilegalmente en el Parque Nacional Los Haitises o verter químicos tóxicos en los ríos Yaque del Norte y Ozama.",
    keywords: ["medio ambiente", "ríos", "ecología", "desechos tóxicos"],
    icon: "TreePine"
  },
  {
    number: 75,
    title: "Deberes Fundamentales",
    category: "deberes",
    officialText: "Los derechos fundamentales reconocidos en esta Constitución determinan la existencia de un orden de responsabilidad jurídica y moral que obliga la conducta del hombre y la mujer en sociedad. Se declaran como deberes fundamentales de las personas: Acatar y cumplir la Constitución y las leyes; Votar; Tributar de acuerdo con la ley; Defender la patria; Proteger los recursos naturales y el patrimonio cultural.",
    simpleExplanation: "No solo tenemos derechos, también tenemos deberes esenciales: cumplir las leyes, pagar nuestros impuestos justamente, votar responsablemente y cuidar nuestro país.",
    practicalExample: "Votar en las elecciones y no arrojar basura a las calles son deberes cívicos fundamentales.",
    keywords: ["deberes", "tributar", "votar", "cumplir la ley", "patria"],
    icon: "Compass"
  },
  {
    number: 268,
    title: "Forma de Gobierno y Cláusula Pétrea (Reforma 2024)",
    category: "reforma2024",
    officialText: "Ninguna modificación a la Constitución podrá versar sobre la forma de gobierno que deberá ser siempre civil, republicano, democrático y representativo. Tampoco podrá versar sobre las reglas de elección presidencial establecidas en las disposiciones de la presente Constitución.",
    simpleExplanation: "Esta es la 'Cláusula Pétrea': Ningún gobernante podrá cambiar la Constitución para extender su propio mandato o alterar las reglas para su beneficio personal.",
    practicalExample: "Un presidente con mayoría en el Congreso no puede eliminar el límite de dos períodos presidenciales para perpetuarse en el poder.",
    keywords: ["cláusula pétrea", "reforma 2024", "reelección", "mandato"],
    icon: "Anchor"
  },
  {
    number: 278,
    title: "Ejercicio de la Reelección Presidencial (Reforma 2024)",
    category: "reforma2024",
    officialText: "Ningún funcionario electo popularmente podrá beneficiarse de una reforma constitucional durante su mandato, cuando la misma verse sobre las reglas de postulación, elección y permanencia del cargo que ostenta.",
    simpleExplanation: "El principio de despersonalización: las reglas electorales no pueden acomodarse a la medida del que esté gobernando en ese momento.",
    practicalExample: "Si se modifica el período presidencial de 4 a 5 años, el presidente en funciones no puede aprovechar ese año extra; solo aplicará para futuros presidentes.",
    keywords: ["reelección", "mandato", "despersonalización", "reforma 2024"],
    icon: "Hourglass"
  }
];

export const CONSTITUTION_STATS = {
  totalArticles: 278,
  totalTitles: 15,
  firstYear: 1844,
  reformsCount: 40,
  latestReformYear: 2024,
  fundamentalRightsCount: 38
};
