// Fase 6 — Auditoría (solo lee dist/ y src/data/; escribe informes/auditoria.md).
// Busca: títulos, descripciones y H1 repetidos · enlaces a «#» o vacíos · «haz/hacé clic
// aquí» · páginas huérfanas (sin enlaces desde el contenido de otra página, sin contar
// menú, pie ni migas) · cifras de la web para cotejar · textos sin autor ni fecha ·
// datos pendientes que bloquean la publicación.
// Uso: node scripts/auditoria.mjs [--seco]. Consola ≤ 30 líneas. Código 1 si hay fallos graves.
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIST = join(RAIZ, 'dist');
const SECO = process.argv.includes('--seco');
if (!existsSync(DIST)) { console.log('FALLO no existe dist/ (npm run build)'); process.exit(1); }

const deco = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const htmls = [];
(function rec(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? rec(p) : f === 'index.html' && htmls.push(p); } })(DIST);
const ruta = (f) => '/' + relative(DIST, f).split(sep).join('/').replace(/index\.html$/, '');

const paginas = htmls.map((f) => {
  const h = readFileSync(f, 'utf-8');
  const main = (h.match(/<main>([\s\S]*?)<\/main>/) || [, ''])[1];
  const sinMigas = main.replace(/<nav class="migas"[\s\S]*?<\/nav>/, '');
  return {
    r: ruta(f),
    title: deco((h.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]),
    desc: deco((h.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]),
    h1: deco((main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()),
    hrefs: [...h.matchAll(/href="([^"]*)"/g)].map((m) => m[1]),
    internos: [...sinMigas.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]),
    textos: [...main.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].map((m) => deco(m[1].replace(/<[^>]+>/g, '').trim())),
    texto: deco(main.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' '),
  };
});

const graves = [];
const avisos = [];
const dup = (campo, nombre) => {
  const m = new Map();
  paginas.forEach((p) => m.set(p[campo], [...(m.get(p[campo]) ?? []), p.r]));
  for (const [v, rs] of m) if (rs.length > 1) graves.push(`${nombre} repetido «${v}» en ${rs.join(', ')}`);
};
dup('title', 'Title'); dup('desc', 'Description'); dup('h1', 'H1');

for (const p of paginas) {
  for (const h of p.hrefs) if (h === '#' || h === '') graves.push(`${p.r}: enlace a «${h || 'vacío'}»`);
  for (const t of p.textos) if (/\b(haz|hac[eé]|pulsa|puls[aá]) clic|clic aqu[ií]|click aqu[ií]|aqu[ií]$/i.test(t)) avisos.push(`${p.r}: enlace con texto poco claro «${t}»`);
}

// Huérfanas: nadie las enlaza desde el contenido de otra página.
const entrantes = new Map(paginas.map((p) => [p.r, new Set()]));
for (const p of paginas) for (const h of p.internos) if (entrantes.has(h) && h !== p.r) entrantes.get(h).add(p.r);
const legales = ['/privacidad/', '/terminos/'];
for (const [r, de] of entrantes) if (r !== '/' && !legales.includes(r) && de.size === 0) avisos.push(`${r}: huérfana (solo se llega por el menú o el pie)`);

// Cifras: todas las cantidades con unidad, para cotejar que no se contradigan.
const cifras = new Map();
const RE = /\b(\d+(?:[.,]\d+)?(?:\s*(?:a|y|o)\s*\d+)?)\s*(meses|años|días|semanas|horas|minutos|veces|%)/gi;
for (const p of paginas) for (const m of p.texto.matchAll(RE)) {
  const k = `${m[1]} ${m[2].toLowerCase()}`;
  const ctx = p.texto.slice(Math.max(0, m.index - 60), m.index + m[0].length + 30).trim();
  cifras.set(k, [...(cifras.get(k) ?? []), `${p.r} — …${ctx}…`]);
}

// Textos sin autor ni fecha de revisión.
const dirC = join(RAIZ, 'src/data/contenido');
const sinAutor = readdirSync(dirC).filter((f) => f !== 'portada.json').map((f) => JSON.parse(readFileSync(join(dirC, f), 'utf-8')))
  .filter((c) => !c.autor || !c.revisado).map((c) => c.slug);
if (sinAutor.length) avisos.push(`${sinAutor.length} tratamientos sin odontólogo que firme ni fecha de revisión (YMYL): ${sinAutor.join(', ')}`);

// Pendientes que bloquean la publicación (resumen por tipo).
const pend = new Map();
for (const p of paginas) for (const m of p.texto.matchAll(/\[(?:Pendiente: )?([^\]]{1,90})\]/g)) {
  const k = m[1].replace(/\s+/g, ' ').slice(0, 70);
  pend.set(k, (pend.get(k) ?? 0) + 1);
}
const topPend = [...pend.entries()].sort((a, b) => b[1] - a[1]);

const L = ['# Auditoría (Fase 6)', '', `Fecha: ${new Date().toISOString().slice(0, 10)} · páginas: ${paginas.length} · graves: ${graves.length} · avisos: ${avisos.length}`, '',
  '## Graves', '', ...(graves.length ? graves.map((x) => `- ${x}`) : ['Ninguno.']), '',
  '## Avisos', '', ...(avisos.length ? avisos.map((x) => `- ${x}`) : ['Ninguno.']), '',
  '## Cifras para cotejar (que no se contradigan entre páginas)', '',
  ...[...cifras.entries()].flatMap(([k, v]) => [`- **${k}** (${v.length})`, ...[...new Set(v)].slice(0, 4).map((x) => `  - ${x}`)]), '',
  `## Datos pendientes que bloquean la publicación (${topPend.length} distintos)`, '',
  ...topPend.map(([k, n]) => `- (${n}) ${k}`), ''];
if (!SECO) { mkdirSync(join(RAIZ, 'informes'), { recursive: true }); writeFileSync(join(RAIZ, 'informes/auditoria.md'), L.join('\n')); }
console.log(`[${graves.length ? 'FALLO' : 'ok'}] ${paginas.length} páginas · ${graves.length} graves · ${avisos.length} avisos · ${cifras.size} cifras · ${topPend.length} pendientes distintos`);
[...graves, ...avisos].slice(0, 22).forEach((x) => console.log('  ' + x.slice(0, 160)));
if (!SECO) console.log('Detalle: informes/auditoria.md');
process.exit(graves.length ? 1 : 0);
