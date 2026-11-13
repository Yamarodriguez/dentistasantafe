// robots.txt: buscadores y robots de IA nombrados uno a uno, todos permitidos (Fase 4).
// Mientras la web esté en pruebas, el «no indexar» lo pone netlify.toml (X-Robots-Tag).
import { site } from '../lib/datos.js';

const robotsIA = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'CCBot',
  // Asistentes y buscadores con IA añadidos en el estudio SEO/AEO (2026-11-13)
  'Meta-ExternalAgent', 'Meta-ExternalFetcher', 'Amazonbot', 'DuckAssistBot',
  'MistralAI-User', 'cohere-ai', 'YouBot',
];

export function GET() {
  const lineas = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Robots de IA: permitidos para que puedan citar la web',
    ...robotsIA.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${new URL('/sitemap.xml', site.url).href}`,
    `# Resumen para asistentes de IA: ${new URL('/llms.txt', site.url).href}`,
    '',
  ];
  return new Response(lineas.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
