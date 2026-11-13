// llms-full.txt: el texto completo de cada tratamiento en Markdown, en un solo archivo,
// para que los asistentes de IA lo lean sin recorrer la web (estudio SEO/AEO, 2026-11-13).
// Mismas reglas que llms.txt: lo que está [pendiente] o [confirmar] no sale.
import { site, ruta, tratamientos } from '../lib/datos.js';
import { real, fechaPagina } from '../lib/seo.js';
import hechos from '../data/hechos.json';

const bloque = (b) => {
  if (typeof b === 'string') return real(b) ? [b, ''] : [];
  if (b.h3) return real(b.h3) ? [`### ${b.h3}`, ''] : [];
  if (b.lista) return [...b.lista.filter(real).map((x) => `- ${x}`), ''];
  if (b.pasos) return [...b.pasos.filter(real).map((x, i) => `${i + 1}. ${x}`), ''];
  if (b.mas) return [`Más información: [${b.mas.t}](${new URL(b.mas.href, site.url).href})`, ''];
  if (b.tabla) {
    const filas = b.tabla.filas.filter((f) => f.every(real));
    if (!filas.length) return [];
    return [`| ${b.tabla.cab.join(' | ')} |`, `|${b.tabla.cab.map(() => ' --- |').join('')}`,
      ...filas.map((f) => `| ${f.join(' | ')} |`), ''];
  }
  return [];
};

function pagina(p) {
  const c = p.contenido;
  if (!c) return [];
  const L = [`# ${p.h1}`, '', `URL: ${new URL(ruta(p.slug), site.url).href}`,
    `Actualizado: ${fechaPagina(p)}`, ''];
  if (real(c.intro)) L.push(c.intro, '');
  if (c.resumen?.length) L.push('## En resumen', '', ...c.resumen.filter(real).map((x) => `- ${x}`), '');
  for (const [h2, bloques] of Object.entries(c.secciones ?? {})) {
    const cuerpo = (Array.isArray(bloques) ? bloques : [bloques]).flatMap(bloque);
    if (real(h2) && cuerpo.length) L.push(`## ${h2}`, '', ...cuerpo);
  }
  const faq = (c.faq ?? []).filter((f) => real(f.q) && real(f.a));
  if (faq.length) L.push('## Preguntas frecuentes', '', ...faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']));
  const fuentes = (c.fuentes ?? []).map((id) => hechos.fuentes[id]).filter(Boolean);
  if (fuentes.length) L.push('## Fuentes', '', ...fuentes.map((f) => `- [${f.titulo}](${f.url})`), '');
  L.push('Información general: no reemplaza una consulta con un odontólogo.', '', '---', '');
  return L;
}

export function GET() {
  const nombre = real(site.nombre) ? site.nombre : 'Clínica dental';
  const L = [
    `# ${nombre}: texto completo de los tratamientos`,
    '',
    `> Clínica dental en Santa Fe (Argentina). Índice breve en ${new URL('/llms.txt', site.url).href}.`,
    '',
    ...tratamientos.flatMap(pagina),
  ];
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
