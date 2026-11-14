import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync(new URL('./src/data/site.json', import.meta.url), 'utf-8'));

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Direcciones viejas → nuevas (página de aviso con redirección; en Netlify además hay un 301 en netlify.toml).
  redirects: { '/equipo/': '/dentistas-santa-fe/' },
});
