// Acceso único a los datos: todas las plantillas leen de aquí.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import site from '../data/site.json';
import mapa from '../data/paginas.json';
import { h2Problemas } from './enlazado.js';

export { site };

// Textos de la Fase 3: src/data/contenido/<slug>.json (o portada.json). Se pegan a su página.
const archivos = import.meta.glob('../data/contenido/*.json', { eager: true, import: 'default' });
const contenidos = Object.fromEntries(
  Object.entries(archivos).map(([ruta, c]) => [ruta.split('/').pop().replace('.json', ''), c])
);
const conContenido = (p) => {
  const c = contenidos[p.slug || 'portada'];
  return conProblemas(c ? { ...p, contenido: c, faq: c.faq?.length ? c.faq : p.faq } : p);
};
// Sección «Problemas bucales…» (enlazado.js): en la portada va antes del último H2 (pedir turno, que cierra la
// página); en índice, primera consulta y equipo, al final. Los tratamientos la ponen en su plantilla.
const conProblemas = (p) => {
  const h = p.tipo !== 'tratamiento' && h2Problemas(p.slug);
  if (!h) return p;
  const h2s = p.tipo === 'portada' ? [...p.h2s.slice(0, -1), h, p.h2s.at(-1)] : [...p.h2s, h];
  return { ...p, h2s };
};

/** Páginas que se publican (estado "si"), con su contenido si ya está escrito. */
export const paginas = mapa.paginas.filter((p) => p.estado === 'si').map(conContenido);

/** Ruta con barra final: "" → "/", "implantes-dentales" → "/implantes-dentales/". */
export const ruta = (slug) => (slug ? `/${slug}/` : '/');

// Páginas generales de un grupo (como COV: «Ortodoncia» y «Estética dental» tienen página propia, Yama 2026-11-16).
// Son de tipo tratamiento (misma plantilla), pero no salen en las listas de tratamientos: las enlaza el título del grupo.
export const hubs = paginas.filter((p) => p.tipo === 'tratamiento' && p.hub);
export const hubDe = (grupo) => hubs.find((h) => h.grupo === grupo);
export const tratamientos = paginas.filter((p) => p.tipo === 'tratamiento' && !p.hub);
/** Problemas bucales (síntomas): /problemas-bucales/ y una página por síntoma (estudio SEO 2026-11-16). */
export const problemas = paginas.filter((p) => p.tipo === 'problema');

// Orden de los grupos (portada, índice y menú): arriba Implantología y Ortodoncia; abajo Odontología general y Estética dental.
const ORDEN_GRUPOS = ['Implantología y prótesis', 'Ortodoncia', 'Odontología general', 'Estética dental'];
export const grupos = [...new Set(tratamientos.map((t) => t.grupo))]
  .sort((a, b) => ORDEN_GRUPOS.indexOf(a) - ORDEN_GRUPOS.indexOf(b));

export const sedePorId = (id) => site.sedes.find((s) => s.id === id);

/** Enlace de WhatsApp de una sede; si aún no hay número, lleva a /contacto/. */
export const enlaceTurno = (sede) =>
  sede?.whatsapp
    ? `https://wa.me/${sede.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, quiero pedir un turno en la clínica dental.')}`
    : '/contacto/';

/** Teléfono que se muestra y va a Google: el fijo si ya es real; si sigue [pendiente], el WhatsApp
 *  (es el número de la clínica). Así el nombre, la dirección y el teléfono coinciden en todas partes. */
export const telefonoDe = (sede) =>
  sede?.telefono && !sede.telefono.includes('[') ? sede.telefono : sede?.whatsapp || sede?.telefono;
export const etiquetaTelefono = (sede) =>
  sede?.telefono && !sede.telefono.includes('[') ? 'Teléfono' : 'Teléfono y WhatsApp';

/** Texto corto de un tratamiento para las tarjetas: su description sin la frase de la dirección
 *  (en el índice salía «En 9 de Julio 3288» 12 veces seguidas: repetición que no aporta). */
export const resumenTarjeta = (t) =>
  (t.description ?? '')
    .split(/(?<=\.)\s+/)
    .filter((f) => !site.sedes.some((s) => s.direccion && f.includes(s.direccion)) && !/^Clínica dental\.?$/.test(f))
    .join(' ');

/** Foto de site.json > fotos solo si el archivo existe en public/ (las provisionales no
 *  se suben a Git: en Netlify o en un clon limpio la sección sale sin foto, sin enlace roto). */
export const foto = (clave) => {
  const f = site.fotos?.[clave];
  const src = typeof f === 'string' ? f : f?.src;
  return src && existsSync(join(process.cwd(), 'public', src)) ? { src, alt: f.alt ?? '' } : null;
};

/** Texto de dato pendiente (el validador lo cuenta como resto). */
export const pendiente = (que) => `[Pendiente: ${que}]`;
