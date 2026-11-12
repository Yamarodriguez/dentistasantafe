// todo:visual — contraste AA (≥ 4,5) de cada tema de src/data/temas.json y página 404.
//   node scripts/visual.mjs         → código 1 si algo falla
//   node scripts/visual.mjs --seco  → igual (este script no escribe nada)
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const temas = JSON.parse(readFileSync(join(RAIZ, 'src/data/temas.json'), 'utf-8'));
const site = JSON.parse(readFileSync(join(RAIZ, 'src/data/site.json'), 'utf-8'));

const lum = (hex) => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const pares = [
  ['texto_color', 'fondo'], ['texto_color', 'superficie'],
  ['suave', 'fondo'], ['suave', 'superficie'],
  ['accion', '#ffffff'], ['accion', 'fondo'], ['accion_texto', 'accion'],
  ['oscuro_texto', 'oscuro'],
];

let fallos = 0;
for (const [id, t] of Object.entries(temas)) {
  if (id.startsWith('_')) continue;
  const malos = [];
  let min = 99;
  const extra = [['texto_color', 'banda'], ['suave', 'banda'], ['accion', 'banda'],
    ...(t.tintes || []).flatMap((c) => [['texto_color', c], ['accion', c]])];
  for (const [a, b] of [...pares, ...extra]) {
    const ca = t[a] ?? a;
    const cb = t[b] ?? b;
    const r = ratio(ca, cb);
    min = Math.min(min, r);
    if (r < 4.5) malos.push(`${a} sobre ${b} = ${r.toFixed(2)}`);
  }
  fallos += malos.length;
  const elegido = id === site.tema ? ' (elegido)' : '';
  console.log(`${malos.length ? 'FALLO' : 'ok   '} ${id}${elegido}: contraste mínimo ${min.toFixed(2)}`);
  malos.forEach((m) => console.log('      ' + m));
}

if (!existsSync(join(RAIZ, 'dist/404.html'))) {
  console.log('FALLO no existe dist/404.html (¿npm run build?)');
  fallos++;
} else console.log('ok    página 404');

process.exit(fallos ? 1 : 0);
