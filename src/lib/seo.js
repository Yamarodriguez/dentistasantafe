// Utilidades de la Fase 4: fechas desde Git y limpieza de datos pendientes.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/** ¿Es un dato real? (no vacío y sin [corchetes] de pendiente). */
// Un [..] es dato pendiente; un [texto](/ruta/) es un enlace del texto y sí es dato real.
export const real = (v) => typeof v === 'string' && v.trim() !== '' && !/\[[^\]]*\](?!\()/.test(v);

/** Quita recursivamente lo que no es dato real (undefined, null, strings con [..], {} y [] vacíos). */
export function limpiar(x) {
  if (Array.isArray(x)) {
    const a = x.map(limpiar).filter((v) => v !== undefined);
    return a.length ? a : undefined;
  }
  if (x && typeof x === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(x)) {
      const l = limpiar(v);
      if (l !== undefined) o[k] = l;
    }
    // Un objeto solo con @type (sin datos) se descarta; una referencia {@id} se mantiene.
    const claves = Object.keys(o).filter((k) => k !== '@type' && k !== '@context');
    return claves.length ? o : undefined;
  }
  if (typeof x === 'string') return real(x) ? x : undefined;
  return x ?? undefined;
}

const cache = new Map();
/** Fecha (AAAA-MM-DD) del último commit que tocó alguno de los ficheros; si no hay Git, hoy. */
export function fechaGit(...ficheros) {
  const clave = ficheros.join('|');
  if (cache.has(clave)) return cache.get(clave);
  let f = '';
  try {
    f = execSync(`git log -1 --format=%cs -- ${ficheros.map((x) => `"${x}"`).join(' ')}`, {
      encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch { /* sin Git: fecha de hoy */ }
  const r = f || new Date().toISOString().slice(0, 10);
  cache.set(clave, r);
  return r;
}

/** Fecha de una página: la de su texto (contenido/<slug>.json) si lo tiene; si no, la del
 *  mapa de páginas y los datos del negocio. Así cada página tiene su fecha real y no todas
 *  cambian a la vez cuando se toca site.json (los buscadores desconfían de eso). */
export const fechaPagina = (p) => {
  const texto = `src/data/contenido/${p.slug || 'portada'}.json`;
  return existsSync(texto) ? fechaGit(texto) : fechaGit('src/data/paginas.json', 'src/data/site.json');
};
