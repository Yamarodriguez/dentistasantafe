// llms.txt: resumen de la web para asistentes de IA (Fase 4). Solo datos reales:
// lo que todavía está [pendiente] no sale.
import { site, paginas, ruta, tratamientos } from '../lib/datos.js';
import { real } from '../lib/seo.js';
import { sinNegrita } from '../lib/texto.js';

export function GET() {
  const url = (p) => new URL(ruta(p.slug), site.url).href;
  const sede = site.sedes[0];
  const nombre = real(site.nombre) ? site.nombre : 'Clínica dental';
  const obras = sede.obrasSociales.filter(real).filter((o) => !/particular/i.test(o));
  const particulares = sede.obrasSociales.some((o) => /particular/i.test(o));
  const datos = [
    real(sede.direccion) && `- Dirección: ${sede.direccion}, ${sede.codigoPostal ?? ''} Santa Fe, provincia de Santa Fe (Argentina)`.replace(', ,', ','),
    real(sede.telefono) && `- Teléfono: ${sede.telefono}`,
    real(sede.horario) && `- Horario: ${sede.horario}`,
    obras.length && `- Obras sociales y prepagas (lista orientativa: al pedir turno se confirma si hay convenio): ${obras.join(', ')}.${particulares ? ' También atiende pacientes particulares.' : ''}`,
    `- Ciudad: Santa Fe de la Vera Cruz, capital de la provincia de Santa Fe (Argentina). No es la avenida Santa Fe de Buenos Aires.`,
    ...site.profesionales.filter((p) => real(p.nombre)).map((p) => `- Odontólogo: ${p.nombre} (${new URL('/dentistas-santa-fe/', site.url).href})`),
  ].filter(Boolean);
  const otras = paginas.filter((p) => !['tratamiento', 'portada', 'legal'].includes(p.tipo));
  const faq = (paginas.find((p) => p.tipo === 'portada')?.faq ?? []).filter((f) => real(f.q) && real(f.a));
  const L = [
    `# ${nombre}`,
    '',
    `> ${real(site.descripcion) ? site.descripcion : 'Clínica dental en Santa Fe (Argentina).'} Tratamientos: ${tratamientos.map((t) => t.nombre.toLowerCase()).join(', ')}.`,
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
    ...(faq.length ? ['## Preguntas frecuentes', '', ...faq.map((f) => `- ${f.q} ${sinNegrita(f.a)}`), ''] : []),
    '## Opcional',
    '',
    `- [Texto completo de la web](${new URL('/llms-full.txt', site.url).href}): portada, dentistas, cada tratamiento, obras sociales y primera consulta, con preguntas frecuentes y fuentes, en un solo archivo.`,
    '',
  ];
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
