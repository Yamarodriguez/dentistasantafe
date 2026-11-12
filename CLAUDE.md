# Clínica dental — web nueva Astro + Netlify con SEO/AEO

## Quién manda
Yama, no técnico: castellano de España, de tú, sin jerga. Lo haces tú.
Modo autónomo: dudas juntas y numeradas al cierre de cada fase.
Cada informe termina con el estado del cambio (local / commit / subido).

## Método
`PROMPT-WEB-NUEVA-V8.md`. Al empezar una fase, leer solo la sección 1 y esa fase.
No abrir enteros `competencia/datos/`, `competencia/texto/` ni HTML bajado: grep.

## Ficha del negocio
Pendiente (la da Yama; plantilla en el prompt, apartado FICHA).
**DOS SEDES: Santa Fe capital y Rosario (Argentina)** (Yama, 2026-11-12; barrios pendientes).
Palabras clave principales: **odontólogo Santa Fe** y **odontólogo Rosario** (una página por
sede); sin datos de volumen.
Textos de la web: español de Argentina **con vos** (recomendado, sin confirmar): «turno»,
«odontólogo», «tratamiento de conducto», «guardia», «matrícula», «ortopedia», «operatoria»,
«placas de relajación». Normativa sanitaria y legal: argentina/santafesina, no española.
Dominio candidato: dentistasantafe.com (recomendado: «Santa Fe» = también la provincia,
cubre Rosario). odontologiasantafe.net descartado: el .com es de un competidor
(Odontología Integral Olivia). Mirar .com.ar. Sin decidir.
Competidor que pasa Yama: drarenzulli.com.
Webs de Valencia (dentalblanch.es, centroodontologicovalenciano.com, pilarroig.com,
clinicamanzanera.com): solo como **modelo** de estructura, no como competencia local.
**Diseño de referencia (Yama): https://centroodontologicovalenciano.com/** → analizar en FASE 2
(colores, tipografía, bloques, fotos); la plantilla de tratamiento se describe en el apartado 9 del análisis.

## Preferencias del propietario (no volver a proponer)
- (vacío)

## Herramientas ya hechas
- `scripts/scrap.py` — scraper de competencia (Python estándar + bs4 + lxml;
  `requests` NO está instalado, usa urllib). Probado el 2026-11-12.
  `python -I scripts/scrap.py competencia/urls.txt --rastrear 15`
  → `competencia/datos/*.json`, `competencia/texto/*.txt`, `informes/competencia.md`.
  Respeta robots.txt, 1 s entre peticiones, marca páginas < 80 palabras (posible JS).
- `npm run todo` = build + `scripts/validar.mjs` (un H1, title ≤ 60 sin `|`, description
  ≤ 155 sin emojis, canonical absoluto con barra, 1 FAQ por página salvo legales, 0 enlaces
  rotos, 0 img sin alt; restos `[..]`/TODO = aviso, **error con `--publicar`**).
  Detalle en `informes/validacion.md`. Probado con una página rota a propósito (caza los 6 fallos).
- **Astro 5** (no 7): en este Windows, Control de aplicaciones bloquea el binario nativo
  `satteri` de Astro 7. No cambiar la seguridad de Windows; quedarse en Astro 5.

## Cómo está hecha la web (Fase 1)
- `src/data/site.json` = datos del negocio (sedes, profesionales, obras sociales, opiniones).
- `src/data/paginas.json` = mapa de URL (slug, tipo, clave, title, description, h1, h2s, faq,
  estado). `estado: "pendiente"` no se genera (guardia, precios).
- Un H2 es texto (se redacta en Fase 3) o `{t, bloque}` que se rellena con datos
  (`src/components/Bloque.astro`: sedes, tratamientos, obras, equipo, opiniones, faq, mapa,
  horario, turno). Dato vacío → «[Pendiente: …]», nunca inventado.
- Plantillas en `src/plantillas/` (Portada, Sede, Tratamiento, Generica); una sola ruta
  `src/pages/[...slug].astro`. Tratamiento añade siempre: quién te atiende, obra social,
  dónde te lo hacemos, opiniones, FAQ.
- `netlify.toml`: build `npm run todo`, cabecera `X-Robots-Tag: noindex` (quitar en Fase 5)
  + `"indexar": false` en site.json.

## Estado
- Fase actual: **1 — Plan y esqueleto: hecha (2026-11-12) salvo el despliegue de pruebas**,
  que espera a que Yama conecte el repo en Netlify. 19 páginas, `npm run todo` a 0 errores
  (296 restos = datos pendientes). Siguiente: **FASE 2 — Diseño** (referencia COV).
- Fase 0 **cerrada el 2026-11-12**: Yama aprueba la lista de páginas del apartado 13
  (dos sedes, 19 páginas + legales).
- Hecho (2026-11-12): Valencia como **modelo** (13 webs, 153 páginas,
  `competencia/urls.txt` → `informes/competencia-valencia.md`) + Santa Fe como
  **competencia local** (4 webs, `competencia/urls-santafe.txt` →
  `informes/competencia-santafe.md`). Todo sumado en `informes/analisis-competencia.md`
  (apartados 9–11; el 8 es la versión Valencia, superada).
  + Rosario (5 webs que pasa Yama, `competencia/urls-rosario.txt` →
  `informes/competencia-rosario.md`, apartado 12: confirma nivel bajo, vos,
  WhatsApp, «ortopedia», «placas de relajación», «operatoria», matrícula 0 de 9,
  obras sociales 1 de 9 y para decir que no).
  Ojo: `informes/competencia.md` = la última pasada del scraper (ahora Rosario).
- Claves: competencia argentina muy floja (webs de 1 página, sin página por tratamiento,
  sin FAQ ni schema); arriba salen directorios (Doctoralia, odontologos.com.ar) →
  web + Google Business **por sede** + Doctoralia. Hueco: **obras sociales y prepagas**.
- Arquitectura (apartado 13): páginas de sede `/santa-fe/` y `/rosario/` (posicionan
  la ciudad); **un solo** tratamiento para las dos ciudades, URL sin ciudad
  (`/implantes-dentales/`), H1 «[Tratamiento] en Santa Fe y Rosario» + H2 «¿Dónde te
  lo hacemos?». Página por tratamiento y ciudad solo si hay contenido distinto de verdad.
  Schema: organización + un `Dentist` por sede.
- Antes de redactar: comprobar con fuente oficial la normativa argentina/santafesina
  de publicidad sanitaria y datos personales (principio 2).
- Pendiente de Yama: nombre de la clínica, barrio y dirección de cada sede,
  tratamientos y profesionales por sede, obras sociales por sede, guardia sí/no,
  precios sí/no, confirmar vos, dominio, fichas de Google Maps, ficha completa.
- Git: repo `https://github.com/Yamarodriguez/dentistasantafe.git` (público), rama `main`,
  primer commit 2026-11-12. Nunca `git add .`. `informes/` y `competencia/datos|texto/`
  no se suben (.gitignore). Imágenes sueltas en la raíz (logo.jpg, IMG_*.HEIC, 2 PNG de
  recepción) sin subir: ver qué son en FASE 2 y moverlas a `marca/` o a `public/`.
