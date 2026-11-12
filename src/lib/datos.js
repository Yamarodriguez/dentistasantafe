// Acceso único a los datos: todas las plantillas leen de aquí.
import site from '../data/site.json';
import mapa from '../data/paginas.json';

export { site };

/** Páginas que se publican (estado "si"). */
export const paginas = mapa.paginas.filter((p) => p.estado === 'si');

/** Ruta con barra final: "" → "/", "implantes-dentales" → "/implantes-dentales/". */
export const ruta = (slug) => (slug ? `/${slug}/` : '/');

export const tratamientos = paginas.filter((p) => p.tipo === 'tratamiento');

export const sedePorId = (id) => site.sedes.find((s) => s.id === id);

/** Enlace de WhatsApp de una sede; si aún no hay número, lleva a /contacto/. */
export const enlaceTurno = (sede) =>
  sede?.whatsapp ? `https://wa.me/${sede.whatsapp.replace(/\D/g, '')}` : '/contacto/';

/** Texto de dato pendiente (el validador lo cuenta como resto). */
export const pendiente = (que) => `[Pendiente: ${que}]`;
