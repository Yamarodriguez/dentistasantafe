// Enlazado interno hacia «Problemas bucales» (Yama, 2026-11-16: «que aparezca en el menú y abajo de todo en la
// home y otras páginas con un H2 optimizado; armar interlinking»). Un solo sitio para decidir qué síntomas se
// enlazan desde cada página y con qué H2. El H2 lleva «problemas bucales» (clave de /problemas-bucales/), es
// distinto en cada página (nada de H2 idénticos repetidos) y no repite la palabra clave exacta del tratamiento
// (contenido.mjs la limita a 6-11). Solo enlaces con el nombre del síntoma: sin textos copiados de otra página.
const TODOS = ['encias-que-sangran', 'dolor-de-muela', 'diente-roto-empaste-caido', 'flemon-dental', 'sensibilidad-dental', 'diente-flojo'];

/** slug de la página → { t: H2, lista: síntomas enlazados (en orden) } */
export const SECCION_PROBLEMAS = {
  // Portada, índice y páginas de información: los 6.
  '': { t: 'Problemas bucales frecuentes: qué hacer y cuándo ir al dentista', lista: TODOS },
  tratamientos: { t: 'Problemas bucales frecuentes y el tratamiento que corresponde', lista: TODOS },
  'primera-consulta': { t: 'Problemas bucales por los que conviene pedir turno', lista: TODOS },
  'odontologos-santa-fe': { t: 'Problemas bucales que revisa nuestro equipo', lista: TODOS },
  // Tratamientos: los síntomas que llevan a ese tratamiento o que se le relacionan (según las fuentes de cada página).
  'implantes-dentales-santa-fe': { t: 'Problemas bucales que pueden llevar a un implante', lista: ['diente-flojo', 'diente-roto-empaste-caido', 'encias-que-sangran'] },
  'protesis-dentales-santa-fe': { t: 'Problemas bucales que pueden llevar a una corona', lista: ['diente-roto-empaste-caido', 'diente-flojo', 'dolor-de-muela'] },
  'ortodoncia-santa-fe': { t: 'Problemas bucales para consultar durante los brackets', lista: ['encias-que-sangran', 'dolor-de-muela', 'sensibilidad-dental'] },
  'ortodoncia-invisible-santa-fe': { t: 'Problemas bucales para consultar antes de los alineadores', lista: ['encias-que-sangran', 'sensibilidad-dental', 'dolor-de-muela'] },
  'carillas-dentales-santa-fe': { t: 'Problemas bucales para revisar antes de unas carillas', lista: ['diente-roto-empaste-caido', 'sensibilidad-dental', 'encias-que-sangran'] },
  'blanqueamiento-dental-santa-fe': { t: 'Problemas bucales para revisar antes de blanquear', lista: ['sensibilidad-dental', 'encias-que-sangran', 'diente-roto-empaste-caido'] },
  'tratamiento-de-conducto-santa-fe': { t: 'Problemas bucales que pueden llevar a una endodoncia', lista: ['dolor-de-muela', 'flemon-dental', 'diente-roto-empaste-caido'] },
  'periodoncia-santa-fe': { t: 'Problemas bucales de las encías: cuándo consultar', lista: ['encias-que-sangran', 'diente-flojo', 'flemon-dental', 'sensibilidad-dental'] },
  'limpieza-dental-santa-fe': { t: 'Problemas bucales que conviene revisar en los controles', lista: ['encias-que-sangran', 'dolor-de-muela', 'diente-roto-empaste-caido', 'sensibilidad-dental'] },
  'odontopediatra-santa-fe': { t: 'Problemas bucales en niños: cuándo consultar', lista: ['dolor-de-muela', 'diente-flojo', 'diente-roto-empaste-caido'] },
  'bruxismo-placa-de-relajacion-santa-fe': { t: 'Problemas bucales por apretar o rechinar los dientes', lista: ['sensibilidad-dental', 'diente-flojo', 'diente-roto-empaste-caido'] },
  'extraccion-muelas-de-juicio-santa-fe': { t: 'Problemas bucales que pueden llevar a sacar un diente', lista: ['dolor-de-muela', 'flemon-dental', 'diente-roto-empaste-caido'] },
};

/** Portada (Yama, 2026-11-16): cada problema en un recuadro con su nombre en H3 y una explicación corta debajo.
 *  Frases propias de la portada (no copiadas de cada página), solo con lo que dicen las fuentes de esa página. */
export const EXPLICACION = {
  'encias-que-sangran': 'La causa principal suele ser la placa acumulada en la línea de la encía. Si el sangrado se repite, conviene revisarlo.',
  'dolor-de-muela': 'Suele deberse a una caries, una infección o una irritación del diente. Si dura más de uno o dos días, conviene consultar.',
  'diente-roto-empaste-caido': 'Conviene revisarlo pronto, aunque no duela: el odontólogo evalúa si alcanza con un arreglo, una corona o una endodoncia.',
  'flemon-dental': 'Es la hinchazón por una infección en un diente y no se va sola. Con dificultad para respirar o tragar, hay que ir a una guardia.',
  'sensibilidad-dental': 'Molestia con el frío, el calor o lo ácido cuando se desgasta la cobertura que protege el diente o la encía se retira.',
  'diente-flojo': 'Puede ser un síntoma de la enfermedad de las encías, que a menudo avanza sin molestias. Conviene consultar sin esperar a que duela.',
};

/** H2 listo para Secciones.astro (sin antetítulo: los antetítulos llevan «en Santa Fe» y ya hay de sobra). */
export const h2Problemas = (slug) => {
  const s = SECCION_PROBLEMAS[slug ?? ''];
  return s ? { t: s.t, bloque: 'problemas-enlaces', lista: s.lista, ante: false } : null;
};

/** En cada página de problema: los otros síntomas, empezando por los más cercanos. */
const CERCANOS = {
  'encias-que-sangran': ['diente-flojo', 'sensibilidad-dental', 'flemon-dental'],
  'dolor-de-muela': ['flemon-dental', 'diente-roto-empaste-caido', 'sensibilidad-dental'],
  'diente-roto-empaste-caido': ['dolor-de-muela', 'sensibilidad-dental', 'flemon-dental'],
  'flemon-dental': ['dolor-de-muela', 'encias-que-sangran', 'diente-flojo'],
  'sensibilidad-dental': ['dolor-de-muela', 'diente-roto-empaste-caido', 'encias-que-sangran'],
  'diente-flojo': ['encias-que-sangran', 'flemon-dental', 'dolor-de-muela'],
};
export const otrosProblemas = (slug) => [...new Set([...(CERCANOS[slug] ?? []), ...TODOS])].filter((s) => s !== slug);
