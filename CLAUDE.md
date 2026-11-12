# Clínica dental — web nueva Astro + Netlify con SEO/AEO

## Quién manda
Yama, no técnico: castellano de España, de tú, sin jerga. Lo haces tú.
Modo autónomo: dudas juntas y numeradas al cierre de cada fase.
Cada informe termina con el estado del cambio (local / commit / subido).

## Método
`PROMPT-WEB-NUEVA-V8.md`. Al empezar una fase, leer solo la sección 1 y esa fase.
No abrir enteros `competencia/datos/`, `competencia/texto/` ni HTML bajado: grep.

## Ficha del negocio
Parcial (2026-11-12). Yama pasa el Instagram **@ignacio_vera_odontologia** (nombre:
«Ignacio Vera Odontología»; Instagram no se puede leer: bloqueado). Datos de Doctoralia
(https://www.doctoraliar.com/perfil/ignacio-vera), **sin confirmar** y marcados
[confirmar] en site.json: Od. Ignacio Vera, matrícula 3795/01, «Consultorios 7 de Marzo»,
Av. 7 de Marzo 1995, Santo Tomé → **NO es la clínica: Yama confirma SANTA FE CAPITAL** (dirección pendiente),
obras sociales: Swiss Medical, Medifé, Galeno, Medicus, OMINT, IAPOS, AcaSalud, Federada
Salud, IOSE, Jerárquicos Salud, Sancor Salud + particulares. Sin horario, teléfono ni web.
Resto de la ficha: pendiente (plantilla en el prompt, apartado FICHA).
Clínica con sedes en Santa Fe capital y Rosario (Argentina), pero **ESTA WEB ES SOLO DE
SANTA FE** (Yama, 2026-11-12). **Rosario = otra web después**, con la misma base: copiar
el proyecto y cambiar site.json (sus datos esperan en `_rosario_para_despues`) y
«Santa Fe» → «Rosario» en paginas.json.
Palabra clave principal: **clínica dental Santa Fe** (H1 «Clínica Dental en Santa Fe»,
como COV) + odontólogo / dentista Santa Fe; sin datos de volumen. URL de tratamiento con
ciudad: `/implantes-dentales-santa-fe/`. Sin páginas de sede: contacto en `/contacto/`.
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

## Reglas (publicidad sanitaria y textos) — comprobadas 2026-11-12
- **Ley 12094 de Santa Fe (2002)**: quien anuncie servicios profesionales debe poner
  nombre, apellido y profesión; especialidades/maestrías/doctorados solo citando la
  institución oficial que dio el título; prohibido lo que pueda inducir a error o
  sugerir que otros profesionales trabajan mal. Sanción vía Código de Faltas (art. 75).
- **Colegio de Odontólogos de Santa Fe** (Ley 3950; 1ª Circunscripción en Santa Fe):
  su Código de Ética puede tener más reglas de publicidad → **pedírselo a Yama / al
  Colegio antes de publicar**. No encontrado en internet.
- Referencia nacional (Decreto 6216/67, art. 10, reglamenta Ley 17132; rige en
  jurisdicción nacional, no seguro en Santa Fe): sin términos elogiosos, superlativos
  ni **imperativos**; el centro se anuncia con el nombre con que fue habilitado.
  → Prudencia: nombre habilitado de la clínica; pendiente decidir si «Sacá turno»
  pasa a «Turnos por WhatsApp».
- Textos de salud: solo hechos de `src/data/hechos.json` (con fuente: FDA, MedlinePlus);
  lo de la clínica, [Pendiente] hasta que Yama lo dé. Autor = odontólogo con matrícula
  + fecha de revisión en cada tratamiento. Aviso «información general».
- Fase 3: texto en `src/data/contenido/<slug>.json` (secciones por H2, bloques: párrafo,
  h3 pregunta, lista, pasos, tabla, mas=enlace; faq; fuentes; autor; revisado; conteo).
  `npm run todo` incluye `todo:contenido` (`scripts/contenido.mjs`: clave exacta 6-11,
  «Santa Fe» ≥ 3, FAQ 4-5, H3 en pregunta, 1.ª frase ≤ 35 palabras, palabras
  prohibidas, fuentes válidas). Segunda capa: un subagente revisor por página
  («buscá motivos para rechazar», sin escribir ficheros, devuelve JSON).

## Preferencias del propietario (no volver a proponer)
- Web solo de Santa Fe; Rosario aparte (no proponer web conjunta de dos sedes).
  Estructura de 18 páginas + portada tipo COV **aprobada por Yama el 2026-11-12**
  («sí, hagamos así»).
- Portada con los H1/H2/H3 de la portada de COV adaptados (Yama los pegó el 2026-11-12):
  H1 Clínica Dental en Santa Fe · H2 Clínica dental en Santa Fe con más de [X] años de
  experiencia · H2 ¿Por qué elegir X como tu clínica dental en Santa Fe? (H3 Especialistas
  en cada área, +X años de experiencia, Tecnología digital, Financiación
  personalizada) · H2 Tratamientos dentales (H3 Implantología y prótesis, Ortodoncia,
  Estética dental, Odontología general) · Promociones destacadas* · Opiniones de nuestros
  pacientes · Reconocimiento* · Marcas con las que trabajamos* · Solicitá
  información sobre el tratamiento que necesitás. (Por ley 12094: «marcas líderes» y «avanzada» quitados; «Especialistas en cada área» solo si se citan las instituciones.) Añadidos nuestros: Obras sociales y
  prepagas, Preguntas frecuentes. *solo con datos reales. Textos de COV NO se copian.
- Las afirmaciones de COV (primera consulta gratis, radiografía incluida, +X años,
  tecnología, financiación) están en site.json con `"confirmado": false` → aviso
  [Pendiente] hasta que Yama confirme que son ciertas.
- Quiere ver los diseños en local: servidores `diseno-oliva` (4403) y `diseno-dorado`
  (4401) de `.claude/launch.json`, sirviendo `dist-oliva` / `dist-dorado`
  (`TEMA=x npx astro build --outDir dist-x`).

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

## Cómo está hecha la web (Fase 1-2)
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
- Diseño (Fase 2): `src/styles/base.css` acotado a `.web`; variables desde `temas.json`;
  `npm run todo` incluye `todo:visual` (`scripts/visual.mjs`: contraste AA de cada tema,
  bandas y tintes + que exista 404). Detalle propio: línea dorada bajo cada H2 (la del
  logo). Opiniones: estrellas solo si la reseña real trae `estrellas`.

## Estado
- **Fase 3 — Textos, tanda 1 hecha (2026-11-12)**: implantes, ortodoncia, ortodoncia
  invisible, tratamiento de conducto, periodoncia. Pasan `todo:contenido` y la revisión
  de 5 subagentes (sus correcciones aplicadas: nada más allá de la fuente; procesos y
  precios de la clínica → [Pendiente]). Sin autor ni fecha de revisión (pendiente: un
  odontólogo con matrícula los revisa y firma). Tanda 2 propuesta: prótesis, estética,
  limpieza y operatoria, odontopediatra, portada → **tanda 2 hecha (2026-11-12)** con 9 fuentes nuevas (MedlinePlus, NIDCR; 81 hechos) y la revisión de 5 subagentes aplicada. Quedan sin texto: tratamientos (índice), obras sociales, primera consulta, equipo, contacto (casi todo datos de la clínica).
- Diseño: **Yama quiere ver en vivo las dos finalistas antes de elegir**
  (2026-11-12): **oliva** (rama `diseno-oliva`) y **dorado** (rama `diseno-dorado`); solo
  cambia `"tema"` en site.json. Negro y oro descartado. Estructura de COV en las dos:
  héroe con foto, primera consulta destacada y ventajas; quiénes somos con foto; por qué
  elegirnos (4); sedes; tratamientos por grupos con forma orgánica en banda crema; obras
  sociales; primera consulta; promociones/reconocimientos/marcas solo con datos reales;
  equipo; opiniones; FAQ; franja de turno; pie a color. No se copia texto de COV.
  Verlas en vivo: cuando Yama conecte Netlify, activar branch deploys (Branches and deploy
  contexts → All) → `diseno-oliva--<sitio>.netlify.app` y `diseno-dorado--<sitio>.netlify.app`.
  Al elegir: borrar el otro tema, unir esa rama a main, borrar las dos ramas.
  Capturas en `capturas/` (no se suben).
  Capturas: el navegador de la app no dibuja (ventana oculta) → Edge sin ventana, un perfil
  por captura en el scratchpad; el móvil a 390 px con un iframe (Edge no baja de ~500 px).
- Fase 1 hecha (2026-11-12) salvo el despliegue de pruebas: Yama dijo «todavía no» a
  Netlify.
- Fotos: `public/img/provisional-*.jpg` = renders de recepción que pasó Yama; parecen
  hechos con IA. **No se suben** (.gitignore) ni se publican como reales sin que Yama lo
  confirme; el validador los cuenta como resto. Las `IMG_*.HEIC` no se han podido ver.
  2026-11-12: Yama dice «aún no» a subirlas → en Netlify las versiones en vivo saldrán sin
  foto en el héroe ni en «Quiénes somos». No volver a preguntarlo hasta que traiga fotos.
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
