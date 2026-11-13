// Negritas en los textos de src/data/contenido/*.json: se escriben **así** (como en Markdown).
// En la web salen como <strong>; en llms-full.txt se quedan tal cual (es Markdown).
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Texto → HTML seguro con las **negritas** como <strong>. */
export const negrita = (s) => escapar(String(s)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/** Texto sin las marcas de negrita (para metadatos, schema y conteos). */
export const sinNegrita = (s) => String(s).replace(/\*\*/g, '');
