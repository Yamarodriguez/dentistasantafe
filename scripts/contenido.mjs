// todo:contenido — reglas mecánicas de la Fase 3 sobre los textos ya escritos.
// Lee src/data/contenido/*.json y la página construida en dist/. Por página:
//   - clave (regex de "conteo.clave") entre min y max veces en <main>
//   - la ciudad («Santa Fe») al menos 3 veces
//   - FAQ de 4 a 5 preguntas; H3 de texto en forma de pregunta
//   - primera frase de cada sección ≤ 35 palabras (respuesta directa)
//   - sin palabras prohibidas (superlativos, promesas: ley 12094 de Santa Fe y buena práctica)
//   - fuentes declaradas que existen en hechos.json
//   - negritas (**así**): cada una ≤ 8 palabras, en total ≤ 5 % de la página, nunca en títulos/resumen/FAQ
// Uso: node scripts/contenido.mjs [--seco]. Detalle: informes/contenido.md. Código 1 si falla.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIR = join(RAIZ, 'src/data/contenido');
const SECO = process.argv.includes('--seco');
const hechos = JSON.parse(readFileSync(join(RAIZ, 'src/data/hechos.json'), 'utf-8'));
const PROHIBIDAS = /\b(el mejor|la mejor|los mejores|las mejores|mejor cl[ií]nica|l[ií]der(es)?|excelencia|garantiza\w*|garant[ií]a total|sin dolor|indoloro|100 ?%|perfect[oa]s?|incre[ií]ble|[uú]nic[oa]s? en|n[uú]mero 1|milagro\w*)\b/gi;

const NEG_MAX_PALABRAS = 8; // competencia: 48 % de 1-3 palabras, 43 % de 4-8
const NEG_MAX_PCT = 5;      // % de las palabras visibles de la página (competencia: 3,4-4,6 %)

const deco = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const textoDe = (b) => (typeof b === 'string' ? b : b.h3 ?? (b.lista || b.pasos || []).join(' ') ?? '');

if (!existsSync(DIR)) { console.log('ok    sin textos todavía'); process.exit(0); }
const archivos = readdirSync(DIR).filter((f) => f.endsWith('.json'));
const filas = [];
let fallos = 0;

for (const f of archivos) {
  const c = JSON.parse(readFileSync(join(DIR, f), 'utf-8'));
  const slug = c.slug ?? f.replace('.json', '');
  const html = join(RAIZ, 'dist', slug === 'portada' ? '' : slug, 'index.html');
  const errores = [];
  let palabrasPagina = 0;
  if (!existsSync(html)) errores.push('no está construida (npm run build)');
  else {
    const crudo = readFileSync(html, 'utf-8');
    const main = deco((crudo.match(/<main>([\s\S]*?)<\/main>/) || [, ''])[1].replace(/<[^>]+>/g, ' '));
    palabrasPagina = main.split(/\s+/).filter(Boolean).length;
    const { clave, min, max, ciudad } = c.conteo ?? {};
    if (clave) {
      const n = (main.match(new RegExp(clave, 'gi')) || []).length;
      if (n < min || n > max) errores.push(`clave /${clave}/ ${n} veces (debe ser ${min}-${max})`);
    }
    if (ciudad) {
      const n = (main.match(new RegExp(ciudad, 'g')) || []).length;
      if (n < 3) errores.push(`«${ciudad}» solo ${n} veces (mín. 3)`);
    }
    // Las tres palabras clave de la web (clínica dental, dentista, centro odontológico): al menos 1 vez cada una.
    for (const t of c.conteo?.terminos ?? []) {
      if (!new RegExp(t, 'i').test(main)) errores.push(`no aparece «${t}»`);
    }
  }
  const nfaq = (c.faq ?? []).length;
  if (nfaq < 4 || nfaq > 5) errores.push(`${nfaq} preguntas frecuentes (deben ser 4-5)`);
  for (const [h2, bloques] of Object.entries(c.secciones ?? {})) {
    const primero = bloques.find((b) => typeof b === 'string' && !b.startsWith('[Pendiente'));
    if (primero) {
      const frase = primero.split(/(?<=[.:;])\s/)[0];
      const palabras = frase.split(/\s+/).length;
      if (palabras > 35) errores.push(`«${h2}»: primera frase de ${palabras} palabras (máx. 35)`);
    }
    for (const b of bloques) if (b.h3 && !/\?\s*$/.test(b.h3)) errores.push(`H3 sin pregunta: «${b.h3}»`);
  }
  const todo = [c.intro ?? '', c.entrada ?? '', ...(c.resumen ?? []), ...Object.values(c.secciones ?? {}).flat().map(textoDe),
    ...(c.faq ?? []).flatMap((x) => [x.q, x.a])].join(' ');
  // Negritas (**así**): cortas, sin abusar, nunca en títulos ni en el resumen (estudio de textos 2026-11-13).
  const negritas = [...todo.matchAll(/\*\*(.+?)\*\*/g)].map((m) => m[1]);
  const largas = negritas.filter((x) => x.split(/\s+/).length > NEG_MAX_PALABRAS);
  if (largas.length) errores.push(`negritas de más de ${NEG_MAX_PALABRAS} palabras: «${largas[0]}»`);
  const pal = palabrasPagina || todo.replace(/\*\*/g, '').split(/\s+/).length;
  const enNegrita = negritas.join(' ').split(/\s+/).filter(Boolean).length;
  if (enNegrita > NEG_MAX_PCT * pal / 100) errores.push(`demasiada negrita: ${enNegrita} de ${pal} palabras (máx. ${NEG_MAX_PCT} %)`);
  const enTitulos = [...Object.keys(c.secciones ?? {}), ...Object.values(c.secciones ?? {}).flat().filter((b) => b.h3).map((b) => b.h3),
    ...(c.resumen ?? []), ...(c.faq ?? []).flatMap((x) => [x.q, x.a])].filter((t) => t.includes('**'));
  if (enTitulos.length) errores.push(`negrita en un título, el resumen o la FAQ: «${enTitulos[0]}»`);
  const sueltas = (todo.replace(/\*\*(.+?)\*\*/g, '').match(/\*\*/g) || []).length;
  if (sueltas) errores.push('marca ** sin cerrar');
  const malas = [...new Set(todo.match(PROHIBIDAS) || [])];
  if (malas.length) errores.push(`palabras prohibidas: ${malas.join(', ')}`);
  for (const id of c.fuentes ?? []) if (!hechos.fuentes[id]) errores.push(`fuente desconocida: ${id}`);
  const pendientes = (todo.match(/\[Pendiente/g) || []).length;
  fallos += errores.length;
  filas.push({ slug, errores, pendientes });
}

const L = ['# Contenido (Fase 3)', '', `Páginas con texto: ${filas.length} · fallos: ${fallos}`, ''];
for (const x of filas) {
  L.push(`## /${x.slug}/ — ${x.errores.length ? 'FALLO' : 'ok'} · ${x.pendientes} pendientes de datos`);
  x.errores.forEach((e) => L.push(`- ${e}`));
  L.push('');
}
if (!SECO) { mkdirSync(join(RAIZ, 'informes'), { recursive: true }); writeFileSync(join(RAIZ, 'informes/contenido.md'), L.join('\n')); }
for (const x of filas) {
  console.log(`${x.errores.length ? 'FALLO' : 'ok   '} /${x.slug}/ (${x.pendientes} pendientes)`);
  x.errores.slice(0, 4).forEach((e) => console.log('      ' + e));
}
process.exit(fallos ? 1 : 0);
