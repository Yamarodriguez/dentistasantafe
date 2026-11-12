// Datos estructurados (JSON-LD) de cada página (Fase 4). Todo sale de site.json,
// paginas.json y contenido/; lo que está [pendiente] se omite (limpiar), nunca se inventa.
import { site, ruta } from './datos.js';
import { limpiar, real, fechaPagina } from './seo.js';
import hechos from '../data/hechos.json';

const abs = (p) => new URL(p, site.url).href;
const ID_CLINICA = abs('/#clinica');
const sinTitulo = (n) => n.replace(/^(Od\.|Dra?\.)\s*(Esp\.\s*)?/, '');

function clinica() {
  const s = site.sedes[0];
  return {
    '@type': 'Dentist',
    '@id': ID_CLINICA,
    name: site.nombre,
    url: abs('/'),
    logo: abs(site.logo),
    image: abs(site.logo),
    telephone: s.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.direccion,
      addressLocality: 'Santa Fe',
      addressRegion: 'Santa Fe',
      addressCountry: 'AR',
    },
    openingHours: s.horario,
    hasMap: s.mapa,
    areaServed: { '@type': 'City', name: 'Santa Fe' },
    medicalSpecialty: 'Dentistry',
    sameAs: Object.values(site.redes ?? {}),
    employee: site.profesionales.filter((p) => real(p.nombre)).map((p) => ({ '@id': abs(`/equipo/#${slugPersona(p)}`) })),
  };
}

const slugPersona = (p) => sinTitulo(p.nombre).toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');

function personas() {
  return site.profesionales.filter((p) => real(p.nombre)).map((p) => ({
    '@type': 'Person',
    '@id': abs(`/equipo/#${slugPersona(p)}`),
    name: sinTitulo(p.nombre),
    jobTitle: 'Odontólogo',
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
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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
    reviewedBy: autor ? { '@id': abs(`/equipo/#${slugPersona(autor)}`) } : undefined,
    dateModified: fechaPagina(pagina),
    citation: (c?.fuentes ?? []).map((id) => hechos.fuentes[id]?.url),
    about: {
      '@type': 'MedicalProcedure',
      name: pagina.nombre,
      description: pagina.description,
    },
    provider: { '@id': ID_CLINICA },
  };
}

/** Lista de objetos JSON-LD para una página. */
export function schemaDe(pagina) {
  const grafo = [];
  if (pagina.tipo === 'portada' || pagina.tipo === 'turnos') grafo.push(clinica());
  if (pagina.tipo === 'equipo') grafo.push(...personas());
  if (pagina.tipo === 'tratamiento') grafo.push(tratamiento(pagina));
  grafo.push(migas(pagina), preguntas(pagina));
  const limpio = limpiar(grafo);
  return limpio ? { '@context': 'https://schema.org', '@graph': limpio } : null;
}
