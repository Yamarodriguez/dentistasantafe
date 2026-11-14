// Datos estructurados (JSON-LD) de cada página (Fase 4). Todo sale de site.json,
// paginas.json y contenido/; lo que está [pendiente] se omite (limpiar), nunca se inventa.
import { site, ruta, tratamientos } from './datos.js';
import { limpiar, real, fechaPagina } from './seo.js';
import hechos from '../data/hechos.json';
import { sinNegrita } from './texto.js';

const abs = (p) => new URL(p, site.url).href;
const ID_CLINICA = abs('/#clinica');
const sinTitulo = (n) => n.replace(/^(Od\.|Dra?\.)\s*(Esp\.\s*)?/, '');

const DIAS = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };
/** "Mo-Fr 08:00-20:00" (o varios separados por coma) → openingHoursSpecification. */
function horarioEstructurado(texto) {
  if (!real(texto)) return undefined;
  const orden = Object.keys(DIAS);
  return texto.split(',').map((tramo) => {
    const m = tramo.trim().match(/^(\w\w)(?:-(\w\w))?\s+(\d\d:\d\d)-(\d\d:\d\d)$/);
    if (!m) return undefined;
    const [, d1, d2, abre, cierra] = m;
    const dias = orden.slice(orden.indexOf(d1), orden.indexOf(d2 ?? d1) + 1).map((d) => DIAS[d]);
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: dias, opens: abre, closes: cierra };
  }).filter(Boolean);
}

/** Foto real del consultorio u odontólogo para el schema (no las de stock ni las provisionales). */
const fotoClinica = () => site.profesionales.map((p) => p.foto).filter(Boolean).map(abs);

function clinica() {
  const s = site.sedes[0];
  return {
    '@type': 'Dentist',
    '@id': ID_CLINICA,
    name: site.nombre,
    url: abs('/'),
    logo: abs(site.logo),
    image: [abs(site.logo), ...fotoClinica()],
    priceRange: s.precios,
    knowsLanguage: 'es',
    openingHoursSpecification: horarioEstructurado(s.horarioSchema),
    availableService: tratamientos.map((t) => ({
      '@type': 'MedicalProcedure',
      name: t.nombre,
      url: abs(ruta(t.slug)),
    })),
    telephone: s.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.direccion,
      addressLocality: 'Santa Fe',
      addressRegion: 'Santa Fe',
      postalCode: s.codigoPostal,
      addressCountry: 'AR',
    },
    openingHours: s.horarioSchema,
    hasMap: s.mapa,
    areaServed: { '@type': 'City', name: 'Santa Fe' },
    medicalSpecialty: 'Dentistry',
    sameAs: Object.values(site.redes ?? {}),
    employee: site.profesionales.filter((p) => real(p.nombre)).map((p) => ({ '@id': abs(`/dentistas-santa-fe/#${slugPersona(p)}`) })),
  };
}

const slugPersona = (p) => sinTitulo(p.nombre).toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');

function personas() {
  return site.profesionales.filter((p) => real(p.nombre)).map((p) => ({
    '@type': 'Person',
    '@id': abs(`/dentistas-santa-fe/#${slugPersona(p)}`),
    name: sinTitulo(p.nombre),
    jobTitle: 'Odontólogo',
    image: p.foto ? abs(p.foto) : undefined,
    honorificPrefix: p.nombre.match(/^(Od\.|Dra?\.)/)?.[1],
    knowsAbout: p.especialidad,
    identifier: real(p.matricula) ? { '@type': 'PropertyValue', name: 'Matrícula', value: p.matricula } : undefined,
    worksFor: { '@id': ID_CLINICA },
  }));
}

function migas(pagina) {
  if (!pagina.slug) return undefined;
  const items = [{ name: 'Inicio', item: abs('/') }];
  if (pagina.tipo === 'tratamiento') items.push({ name: 'Tratamientos', item: abs('/tratamientos/') });
  items.push({ name: pagina.nombre ?? pagina.h1, item: abs(ruta(pagina.slug)) });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({ '@type': 'ListItem', position: i + 1, ...x })),
  };
}

function preguntas(pagina) {
  const faq = (pagina.faq ?? []).filter((f) => real(f.q) && real(f.a));
  if (!faq.length) return undefined;
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: sinNegrita(f.a) } })),
  };
}

function tratamiento(pagina) {
  const c = pagina.contenido;
  const autor = c?.autor && site.profesionales.find((p) => p.nombre === c.autor);
  return {
    '@type': 'MedicalWebPage',
    '@id': abs(ruta(pagina.slug)),
    url: abs(ruta(pagina.slug)),
    name: pagina.title,
    description: pagina.description,
    inLanguage: site.idioma,
    lastReviewed: c?.revisado,
    reviewedBy: autor ? { '@id': abs(`/dentistas-santa-fe/#${slugPersona(autor)}`) } : undefined,
    dateModified: fechaPagina(pagina),
    citation: (c?.fuentes ?? []).map((id) => hechos.fuentes[id]?.url),
    isPartOf: { '@id': abs('/#web') },
    about: {
      '@type': 'MedicalProcedure',
      name: pagina.nombre,
      description: pagina.description,
      url: abs(ruta(pagina.slug)),
    },
    // Lo que un asistente de voz o de IA puede leer en voz alta: el resumen y la entrada.
    speakable: c?.resumen?.length ? { '@type': 'SpeakableSpecification', cssSelector: ['.resumen', '.entrada'] } : undefined,
    provider: { '@id': ID_CLINICA },
  };
}

function web() {
  return {
    '@type': 'WebSite',
    '@id': abs('/#web'),
    url: abs('/'),
    name: site.nombre,
    inLanguage: site.idioma,
    publisher: { '@id': ID_CLINICA },
  };
}

/** Lista de objetos JSON-LD para una página. La clínica (Dentist) va completa en todas
 *  las páginas: Google no une datos de páginas distintas, así que el «provider» de cada
 *  tratamiento y el «worksFor» del equipo apuntan a algo definido en la misma página. */
export function schemaDe(pagina) {
  const grafo = [];
  if (pagina.tipo !== 'legal') grafo.push(clinica(), web());
  if (pagina.tipo === 'equipo') grafo.push(...personas());
  if (pagina.tipo === 'tratamiento') grafo.push(tratamiento(pagina));
  grafo.push(migas(pagina), preguntas(pagina));
  const limpio = limpiar(grafo);
  return limpio ? { '@context': 'https://schema.org', '@graph': limpio } : null;
}
