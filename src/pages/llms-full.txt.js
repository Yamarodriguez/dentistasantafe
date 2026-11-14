// llms-full.txt: el texto completo de la portada, los dentistas, cada tratamiento, obras sociales y primera consulta en Markdown, en un solo archivo,
// para que los asistentes de IA lo lean sin recorrer la web (estudio SEO/AEO, 2026-11-13).
// Mismas reglas que llms.txt: lo que está [pendiente] o [confirmar] no sale.
import { site, ruta, tratamientos, paginas } from '../lib/datos.js';
import { real, fechaPagina } from '../lib/seo.js';
import hechos from '../data/hechos.json';

// Los enlaces del texto ([texto](/ruta/)) salen con la dirección completa.
const abs = (s) => s.replace(/\]\((\/[^)\s]*)\)/g, (_, r) => `](${new URL(r, site.url).href})`);
// Mientras ninguna matrícula esté confirmada, no se habla de matrícula (un asistente podría decir que está publicada).
const sinMatricula = !site.profesionales.some((p) => real(p.matricula));
const ok = (s) => real(s) && !(sinMatricula && /matr[ií]cula/i.test(s));
// Secciones cuyo contenido es un bloque de datos aún sin confirmar o vacío: su frase de presentación sola engaña.
const SALTAR = ['porque', 'opiniones', 'marcas', 'promociones', 'reconocimientos'];
const titulo = (h) => h.replace('{nombre}', site.nombre);
const bloque = (b) => {
  if (typeof b === 'string') return ok(b) ? [abs(b), ''] : [];
  if (b.h3) return real(b.h3) ? [`### ${b.h3}`, ''] : [];
  if (b.lista) return [...b.lista.filter(ok).map((x) => `- ${abs(x)}`), ''];
  if (b.pasos) return [...b.pasos.filter(ok).map((x, i) => `${i + 1}. ${abs(x)}`), ''];
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
  const intro = c.intro ?? c.entrada;
  if (real(intro)) L.push(abs(intro), '');
  if (c.resumen?.length) L.push('## En resumen', '', ...c.resumen.filter(real).map((x) => `- ${x}`), '');
  const bloqueDe = Object.fromEntries((p.h2s ?? []).filter((h) => typeof h === 'object').map((h) => [h.t, h.bloque]));
  for (const [h2, bloques] of Object.entries(c.secciones ?? {})) {
    if (SALTAR.includes(bloqueDe[h2])) continue;
    const cuerpo = (Array.isArray(bloques) ? bloques : [bloques]).flatMap(bloque);
    // En las secciones del equipo, el dato real: quién atiende.
    if (bloqueDe[h2] === 'equipo') cuerpo.push(...site.profesionales.filter((x) => real(x.nombre)).map((x) => `- ${x.nombre}, odontólogo.`), '');
    if (real(titulo(h2)) && cuerpo.length) L.push(`## ${titulo(h2)}`, '', ...cuerpo);
  }
  const faq = (c.faq ?? []).filter((f) => ok(f.q) && ok(f.a));
  if (faq.length) L.push('## Preguntas frecuentes', '', ...faq.flatMap((f) => [`### ${f.q}`, '', abs(f.a), '']));
  const fuentes = (c.fuentes ?? []).map((id) => hechos.fuentes[id]).filter(Boolean);
  if (fuentes.length) L.push('## Fuentes', '', ...fuentes.map((f) => `- [${f.titulo}](${f.url})`), '');
  L.push('Información general: no reemplaza una consulta con un odontólogo.', '', '---', '');
  return L;
}

export function GET() {
  const nombre = real(site.nombre) ? site.nombre : 'Clínica dental';
  const deSlug = (s) => paginas.find((p) => p.slug === s);
  const portada = paginas.find((p) => p.tipo === 'portada');
  const dentistas = deSlug('dentistas-santa-fe');
  const otras = ['obras-sociales', 'primera-consulta'].map(deSlug).filter(Boolean);
  const L = [
    `# ${nombre}: texto completo de la web`,
    '',
    `> Clínica dental en Santa Fe capital (Santa Fe de la Vera Cruz, Argentina). Índice breve en ${new URL('/llms.txt', site.url).href}.`,
    '',
    ...[portada, dentistas].filter(Boolean).flatMap(pagina),
    ...tratamientos.flatMap(pagina),
    ...otras.flatMap(pagina),
  ];
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
