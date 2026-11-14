// Formato de los textos de src/data/contenido/*.json (como en Markdown):
//   **negrita**            → <strong>
//   [texto](/ruta/)        → enlace interno (solo rutas propias que empiezan por «/»)
// En llms-full.txt se quedan tal cual (es Markdown).
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ENLACE = /\[([^\]\n]+)\]\((\/[a-z0-9\-/#]*)\)/g;

/** Texto → HTML seguro con **negritas** y [enlaces](/ruta/) internos. */
export const negrita = (s) =>
  escapar(String(s))
    .replace(ENLACE, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/** Texto sin marcas de negrita ni de enlace (para metadatos, schema y conteos). */
export const sinNegrita = (s) => String(s).replace(ENLACE, '$1').replace(/\*\*/g, '');
