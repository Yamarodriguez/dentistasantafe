// llms.txt: resumen de la web para asistentes de IA (Fase 4). Solo datos reales:
// lo que todavía está [pendiente] no sale.
import { site, paginas, ruta, tratamientos } from '../lib/datos.js';
import { real } from '../lib/seo.js';

export function GET() {
  const url = (p) => new URL(ruta(p.slug), site.url).href;
  const sede = site.sedes[0];
  const nombre = real(site.nombre) ? site.nombre : 'Clínica dental';
  const datos = [
    real(sede.direccion) && `- Dirección: ${sede.direccion}, ${sede.codigoPostal ?? ''} Santa Fe, provincia de Santa Fe (Argentina)`.replace(', ,', ','),
    real(sede.telefono) && `- Teléfono: ${sede.telefono}`,
    real(sede.horario) && `- Horario: ${sede.horario}`,
    sede.obrasSociales.filter(real).length && `- Obras sociales y prepagas: ${sede.obrasSociales.filter(real).join(', ')}`,
  ].filter(Boolean);
  const otras = paginas.filter((p) => !['tratamiento', 'portada', 'legal'].includes(p.tipo));
  const L = [
    `# ${nombre}`,
    '',
    `> Clínica dental en Santa Fe (Argentina): ${tratamientos.map((t) => t.nombre.toLowerCase()).join(', ')}.`,
    '',
    ...(datos.length ? ['## Datos', '', ...datos, ''] : []),
    '## Tratamientos',
    '',
    ...tratamientos.map((t) => `- [${t.h1}](${url(t)}): ${t.description}`),
    '',
    '## Información',
    '',
    ...otras.map((p) => `- [${p.h1}](${url(p)}): ${p.description}`),
    '',
    '## Opcional',
    '',
    `- [Texto completo de los tratamientos](${new URL('/llms-full.txt', site.url).href}): resumen, secciones, preguntas frecuentes y fuentes de cada tratamiento en un solo archivo.`,
    '',
  ];
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
