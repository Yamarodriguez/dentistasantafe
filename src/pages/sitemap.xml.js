// sitemap.xml con fechas reales del último cambio en Git (Fase 4).
import { site, paginas, ruta } from '../lib/datos.js';
import { fechaPagina } from '../lib/seo.js';

export function GET() {
  const urls = paginas
    .filter((p) => p.tipo !== 'legal')
    .map((p) => `  <url><loc>${new URL(ruta(p.slug), site.url).href}</loc><lastmod>${fechaPagina(p)}</lastmod></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
