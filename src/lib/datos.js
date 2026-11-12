// Acceso único a los datos: todas las plantillas leen de aquí.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import site from '../data/site.json';
import mapa from '../data/paginas.json';

export { site };

// Textos de la Fase 3: src/data/contenido/<slug>.json (o portada.json). Se pegan a su página.
const archivos = import.meta.glob('../data/contenido/*.json', { eager: true, import: 'default' });
const contenidos = Object.fromEntries(
  Object.entries(archivos).map(([ruta, c]) => [ruta.split('/').pop().replace('.json', ''), c])
);
const conContenido = (p) => {
  const c = contenidos[p.slug || 'portada'];
  return c ? { ...p, contenido: c, faq: c.faq?.length ? c.faq : p.faq } : p;
};

/** Páginas que se publican (estado "si"), con su contenido si ya está escrito. */
export const paginas = mapa.paginas.filter((p) => p.estado === 'si').map(conContenido);

/** Ruta con barra final: "" → "/", "implantes-dentales" → "/implantes-dentales/". */
export const ruta = (slug) => (slug ? `/${slug}/` : '/');

export const tratamientos = paginas.filter((p) => p.tipo === 'tratamiento');

export const sedePorId = (id) => site.sedes.find((s) => s.id === id);

/** Enlace de WhatsApp de una sede; si aún no hay número, lleva a /contacto/. */
export const enlaceTurno = (sede) =>
  sede?.whatsapp ? `https://wa.me/${sede.whatsapp.replace(/\D/g, '')}` : '/contacto/';

/** Foto de site.json > fotos solo si el archivo existe en public/ (las provisionales no
 *  se suben a Git: en Netlify o en un clon limpio la sección sale sin foto, sin enlace roto). */
export const foto = (clave) => {
  const r = site.fotos?.[clave];
  return r && existsSync(join(process.cwd(), 'public', r)) ? r : null;
};

/** Texto de dato pendiente (el validador lo cuenta como resto). */
export const pendiente = (que) => `[Pendiente: ${que}]`;
