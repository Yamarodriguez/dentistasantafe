// Validador de la web construida (dist/). Uso:
//   node scripts/validar.mjs            → errores = código 1; restos [..] = aviso
//   node scripts/validar.mjs --publicar → los restos también son error (antes de publicar)
//   node scripts/validar.mjs --seco     → no escribe informes/validacion.md
// Consola ≤ 30 líneas; el detalle va a informes/validacion.md.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIST = join(RAIZ, 'dist');
const PUBLICAR = process.argv.includes('--publicar');
const SECO = process.argv.includes('--seco');

const site = JSON.parse(readFileSync(join(RAIZ, 'src/data/site.json'), 'utf-8'));
const mapa = JSON.parse(readFileSync(join(RAIZ, 'src/data/paginas.json'), 'utf-8'));
const BASE = site.url.replace(/\/$/, '');

if (!existsSync(DIST)) {
  console.log('ERROR: no existe dist/. Ejecuta antes: npm run build');
  process.exit(1);
}

const decodificar = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const htmls = [];
(function recorrer(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) recorrer(p);
    else if (f.endsWith('.html')) htmls.push(p);
  }
})(DIST);

const ruta = (fichero) => '/' + relative(DIST, fichero).split(sep).join('/').replace(/index\.html$/, '');
const tipoDe = Object.fromEntries(mapa.paginas.map((p) => [p.slug ? `/${p.slug}/` : '/', p.tipo]));
const existe = (href) => {
  const limpio = decodeURI(href.split('#')[0].split('?')[0]);
  if (!limpio) return true;
  const p = join(DIST, limpio);
  return existsSync(limpio.endsWith('/') ? join(p, 'index.html') : p);
};

const errores = [];
const restos = [];
const err = (r, m) => errores.push(`${r} — ${m}`);

for (const f of htmls) {
  const r = ruta(f);
  const html = readFileSync(f, 'utf-8');
  const uno = (re) => (html.match(re) || [])[1];

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(r, `${h1} H1 (debe haber 1)`);

  const title = decodificar(uno(/<title>([\s\S]*?)<\/title>/) ?? '');
  if (!title) err(r, 'sin title');
  if (title.length > 60) err(r, `title de ${title.length} caracteres (máx. 60)`);
  if (title.includes('|')) err(r, 'title con «|»');

  const desc = decodificar(uno(/<meta name="description" content="([^"]*)"/) ?? '');
  if (!desc) err(r, 'sin description');
  if (desc.length > 155) err(r, `description de ${desc.length} caracteres (máx. 155)`);
  if (/\p{Extended_Pictographic}/u.test(desc)) err(r, 'description con emojis');

  const canon = uno(/<link rel="canonical" href="([^"]*)"/) ?? '';
  if (canon !== BASE + r) err(r, `canonical «${canon}» (esperado ${BASE + r})`);

  const faqs = (html.match(/id="preguntas-frecuentes"/g) || []).length;
  const tipo = tipoDe[r];
  if (tipo !== 'legal' && faqs !== 1) err(r, `${faqs} bloques de FAQ (debe haber 1)`);

  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    if (!existe(href)) err(r, `enlace roto ${href}`);
  }
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(img)) err(r, `imagen sin alt: ${img.slice(0, 80)}`);
  }

  const texto = decodificar(html.replace(/<[^>]+>/g, ' '));
  const marcas = texto.match(/\[[^\]\n]{1,120}\]|\bTODO\b|lorem ipsum/gi) || [];
  if (marcas.length) restos.push({ r, n: marcas.length, ej: [...new Set(marcas)].slice(0, 6) });
}

for (const p of mapa.paginas.filter((p) => p.estado === 'si')) {
  const r = p.slug ? `/${p.slug}/` : '/';
  if (!htmls.some((f) => ruta(f) === r)) err(r, 'está en paginas.json pero no se ha generado');
}

const totalRestos = restos.reduce((a, x) => a + x.n, 0);
const L = [
  '# Validación', '',
  `Fecha: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} · páginas: ${htmls.length} · errores: ${errores.length} · restos: ${totalRestos}`, '',
  '## Errores', '', ...(errores.length ? errores.map((e) => `- ${e}`) : ['Ninguno.']), '',
  '## Restos pendientes ([..], TODO)', '',
  ...(restos.length ? restos.map((x) => `- ${x.r} (${x.n}): ${x.ej.join(' · ')}`) : ['Ninguno.']),
];
if (!SECO) {
  mkdirSync(join(RAIZ, 'informes'), { recursive: true });
  writeFileSync(join(RAIZ, 'informes/validacion.md'), L.join('\n') + '\n', 'utf-8');
}

const fallo = errores.length > 0 || (PUBLICAR && totalRestos > 0);
console.log(`[${fallo ? 'FALLO' : 'ok'}] ${htmls.length} páginas · ${errores.length} errores · ${totalRestos} restos en ${restos.length} páginas${PUBLICAR ? ' (modo publicar)' : ''}`);
errores.slice(0, 20).forEach((e) => console.log('  ' + e));
if (errores.length > 20) console.log(`  … y ${errores.length - 20} más`);
if (totalRestos && !PUBLICAR) console.log('  Restos = datos pendientes; son error con --publicar.');
if (!SECO) console.log('Detalle: informes/validacion.md');
process.exit(fallo ? 1 : 0);
