# Prompt web nueva Astro + SEO/AEO (V8, compacto) — clínica dental

Derivado de la V7 (migración). Aquí no hay WordPress: se quita todo lo de
migrar y queda **competencia → plan → diseño → contenido → AEO → publicar**.
Claude lee **solo la sección de la fase en curso + la sección 1**.

## FICHA (un solo mensaje, una vez)
```
Web nueva de [CLÍNICA] en Astro + Netlify. Método: PROMPT-WEB-NUEVA-V8.md.
Castellano de España, de tú, sin jerga; lo haces tú. Dudas juntas al cierre de fase.
NEGOCIO: tratamientos [..] · ciudad/barrios [..] · palabra clave [dentista X / clínica dental X]
CONTACTO: tel · WhatsApp · correo · horario · dirección · Google Business [URL]
TITULAR: razón social · NIF · nº registro sanitario · colegiados (nombre + nº)
EQUIPO/FOTOS/RESEÑAS publicables: [sí/no/dónde]
PRECIOS: [reales con fecha / "no se publican"] · financiación [sí/no]
ANALÍTICA: GA4 [..] · Search Console [..] · FORMULARIO: Web3Forms → [correo]
DOMINIO: registrador [..] · DNS en dns.txt · GITHUB/NETLIFY: [.. / créalos]
DISEÑO: 3 palabras · colores · webs que gustan (y qué) · lo que NO
```

## 1. PRINCIPIOS
1. **Nada inventado**: ni precios, ni plazos, ni tratamientos que no hagan, ni
   reseñas, ni casos, ni titulaciones. Datos sanitarios/legales → comprobación
   aparte con fuente (sector YMYL: Google exige autor real y datos verificables).
2. **Publicidad sanitaria**: antes de redactar, comprobar con fuente oficial qué
   exige la comunidad autónoma (nº de registro sanitario visible, colegiados,
   promesas de resultado, antes/después). Se apunta en `CLAUDE.md` > Reglas.
3. **Un solo sitio para cada dato**: negocio en `src/data/site.json`; páginas
   generadas desde **un** archivo de datos; cifras en **una** referencia con fecha.
4. **Nada vale sin `npm run todo` a 0** (build + validador + grep de restos).
5. Preferencias del propietario → `CLAUDE.md` > Preferencias; no se reproponen.

### Gastar menos tokens
- **Scripts, no manos**: lo que se hace dos veces se vuelve script. Todo script:
  `--seco`, idempotente, código ≠ 0 si falla, **≤ 30 líneas en consola**,
  detalle a `informes/`. Claude lee el informe, nunca el volcado.
- **No leer lo que no toca**: HTML bajado y JSON grandes, solo con grep.
- **Una sesión por fase**; `CLAUDE.md` se lee al entrar y se actualiza al salir.
- **Preguntas juntas** y numeradas al cierre ("1 sí, 2 no, 3 b").
- **Probar en una página de cada tipo**, luego todas.
- **Modelos**: Sonnet medio por defecto; Haiku para listar; grande solo para
  análisis de competencia y plan.
- **Agentes** solo para trabajo grande; encargo con «PROHIBIDO escribir ficheros;
  devuelve JSON con este esquema» y clave = `slug` fijado por script.
- Windows: `python` (no `python3`); regex con `\` en ficheros, nunca `node -e`.

### Git
`.gitignore` antes del primer `add` (node_modules, dist, .astro, .env, informes/,
competencia/html/, capturas*/, marca/). Nunca `git add .`. Una rama por trabajo.
Clon limpio antes de subir datos nuevos.

## FASE 0 — Competencia (scraper, casi sin tokens)
1. `competencia/urls.txt`: una URL por línea (portada + páginas de tratamiento).
2. `python scripts/scrap.py competencia/urls.txt [--rastrear 15]`
   - respeta `robots.txt`, 1 hilo, 1 s entre peticiones;
   - por página: title, description, canonical, H1-H6 en orden, palabras,
     schema (`@type`), FAQ, CTAs (tel/WhatsApp/cita), imágenes sin `alt`, enlaces;
   - `--rastrear N`: añade N páginas internas por dominio (tratamientos/servicios);
   - guarda `competencia/datos/*.json` y `competencia/texto/*.txt` (texto limpio);
   - escribe `informes/competencia.md`: tabla por web, encabezados, términos y
     bigramas más repetidos, tratamientos que aparecen y en cuántas webs.
3. Claude (modelo grande) lee **solo** `informes/competencia.md` y, si hace
   falta, un `.txt` concreto. Entrega `informes/analisis-competencia.md`:
   arquitectura común, tratamientos imprescindibles, palabras clave por página,
   patrón de H1/H2/H3, qué hacen bien, huecos que nadie cubre.
**Cierre**: lista de páginas propuesta + palabra clave de cada una, aprobada.

## FASE 1 — Plan y esqueleto
- Mapa de URL definitivo (`src/data/paginas.json`: slug, tipo, clave, h1, h2s).
- Astro con `trailingSlash:'always'`, `build.format:'directory'`, plantillas
  por tipo (portada, tratamiento, equipo, precios, contacto, legales, blog opc.).
- Validador: un H1, title ≤ 60 sin `|`, description ≤ 155 sin emojis, canonical
  absoluto con barra, una FAQ por página, 0 enlaces rotos, 0 imágenes sin `alt`.
- Despliegue de pruebas con `X-Robots-Tag: noindex`.

## FASE 2 — Diseño
2-3 direcciones con nombre (paleta con acción AA sobre blanco, pareja de letras
Fontsource latin+latin-ext, héroe, tarjeta de tratamiento, un detalle propio).
Captura de la portada en escritorio/móvil, el propietario elige, se prueba en
una rama. Reglas CSS acotadas a contenedor. `todo:visual` (contraste, 404).

## FASE 3 — Contenido por lotes de 5 páginas
Reglas fijadas **antes** de lanzar:
- respuesta directa en la 1.ª frase de cada sección; tablas para precios/plazos;
- clave en H1 y h2, 6-11 veces por página; h3 en pregunta; FAQ 4-5 cortas;
- cada tratamiento: qué es, para quién, pasos, duración, cuidados, precio
  orientativo (si lo hay en la referencia), autor colegiado y fecha de revisión;
- tuteo de España; lista blanca de hechos con fuente.
Verificación en dos capas: script que cuenta + verificador LLM por página que
busca motivos para rechazar. Fallos mecánicos → script, no otra ronda.

## FASE 4 — AEO técnico y conversión
`robots.txt` con robots de IA nombrados, `llms.txt`, sitemap, fechas reales desde
Git. Schema: `Dentist` (LocalBusiness) con site.json, `MedicalProcedure`/`Service`
por tratamiento, `Person` para el equipo, `BreadcrumbList`, `FAQPage`. Formulario
AJAX, WhatsApp, botón «Pedir cita» → página de cita. Velocidad: webp, tamaños
reales, sin lazy arriba.

## FASE 5 — Publicar
DNS en el registrador: A `@` a Netlify, `www` CNAME, borrar AAAA viejos, **no
tocar MX/SPF/DKIM/TXT**. Mismo día: quitar `noindex`, redirección de
`*.netlify.app`, envío de prueba, Search Console + sitemap. Google Business con la URL.

## FASE 6 — Auditoría (solo lee)
Títulos/descripciones duplicados, enlaces a `#`, «Haz clic aquí», huérfanas,
cifras que se contradicen, afirmaciones sanitarias sin fuente. Al mes: Search Console.

## ERRORES YA PAGADOS (no repetir)
Datos falsos publicados → comprobación aparte · `$1`/`undefined` tras regex →
grep de restos · reglas cambiadas a mitad → fijarlas antes · verificar por lote
→ página a página · agentes escribiendo ficheros → prohibido · `|` en títulos →
fuera · páginas casi iguales → texto propio · cifra distinta en cada página →
referencia única · sin correo tras DNS → no tocar MX · formulario a página en
inglés → AJAX · menú blanco sobre blanco → CSS acotado.

## CLAUDE.md (lo crea Claude en la Fase 0)
Quién manda y cómo hablarle · ficha resumida · decisiones y preferencias ·
reglas (las de la sección 1) · estado: fase, hecho (fecha, commit), pendiente.
