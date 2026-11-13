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
- **Portada = estructura de COV con «clínica dental» como clave principal** (Yama, 2026-11-12,
  segunda vez que la pega; manda sobre lo anterior): H1 Clínica Dental en Santa Fe · H2 Clínica
  dental en Santa Fe con más de [X] años de experiencia · H2 ¿Por qué elegir X como tu clínica
  dental en Santa Fe? (H3: Especialistas en cada área, +[X] años, Tecnología digital,
  Financiación personalizada) · H2 Tratamientos dentales en Santa Fe (H3 por grupo, 4 recuadros
  como COV) · H2 Obras sociales y prepagas · H2 Tu primera consulta en nuestra clínica dental ·
  Promociones* · H2 Opiniones de nuestros pacientes · H2 Nuestros dentistas en Santa Fe: título y
  matrícula · Reconocimiento* · Marcas con las que trabajamos* · H2 Preguntas frecuentes sobre
  nuestra clínica dental · H2 Cómo llegar a nuestra clínica dental en Santa Fe · H2 Solicitar
  información sobre el tratamiento que necesitás. (Añadidos del estudio inicial: obras sociales,
  primera consulta, dentistas con matrícula, FAQ, cómo llegar. Ley 12094: sin «líderes»/«avanzada»,
  infinitivo en vez de imperativo.)
- **Palabras clave (Yama, 2026-11-12): «clínica dental», «dentista» y «centro odontológico»
  + Santa Fe** en toda la web, con **tono más profesional** (sin «acá», «chicos» → «niños»;
  se mantiene el vos). Portada: title «Clínica dental en Santa Fe: dentista y centro
  odontológico»; H2 «Centro odontológico en Santa Fe con más de [X] años…», «¿Por qué elegir
  X como tu dentista en Santa Fe?», «Tratamientos de nuestra clínica dental en Santa Fe»,
  «Pedir turno con el dentista en Santa Fe». Antetítulos rotan entre las 3 claves
  (site.json > antetitulos). Tratamientos: intro con «clínica dental»/«centro
  odontológico», bloques fijos «Tu dentista en Santa Fe» y «Nuestro centro odontológico en
  Santa Fe». contenido.mjs exige las 3 en cada página con texto.
- **Dibujos propios de cada tratamiento** (src/components/Dibujo.astro, SVG en colores del
  tema): índice, portada (junto a cada tratamiento) y héroe de cada tratamiento.
- Quiere **fotos de una chica sonriendo** (pendiente: elegir de Unsplash o que Yama las pase).
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
- Quiere ver la web en local: servidor `web` de `.claude/launch.json` (python http.server
  en el puerto 4403 sirviendo `dist/`; antes `npm run build`). http://localhost:4403/
- **Fotos de Unsplash descargadas con permiso de Yama (2026-11-12)**: 14 (héroe = mujer
  sonriendo; portada: consultorio, dentista con paciente, sillón, joven con alineador; una por
  tratamiento en su primer H2). La descarga directa da 401 y la web tiene control anti-robots
  (no saltárselo): se saca la URL de images.unsplash.com con WebFetch y se baja del CDN.
  Originales en marca/unsplash/ (no se suben); webp en public/img/fotos/ (sí); `scripts/imagenes.py`.
  site.json > fotos {src, alt}; créditos en /terminos/. Fotos de ambiente: nunca como pacientes.
- Foto principal (héroe): **la recepción dorada provisional** (Yama la prefiere a la de Unsplash,
  2026-11-12). Sigue sin subirse a Git → en Netlify el héroe sale sin foto hasta que Yama
  confirme que se puede publicar. «¿Por qué elegir…?»: título arriba y debajo foto | H3
  (`"disposicion": "foto-abajo"` en paginas.json).
- **Foto en cada H2 de la portada** y **nombre de archivo con la palabra clave del H2**
  (p. ej. clinica-dental-santa-fe-consultorio.webp, implantes-dentales-santa-fe.webp); alt
  descriptivo + «(imagen ilustrativa)» (son de stock: no se presentan como la clínica real).
  Tabla en scripts/imagenes.py. Tratamientos: 1 foto (primer H2); más fotos por tratamiento
  requieren descargar más (pedir permiso). **Resumen rápido** («En resumen», 4 frases de la
  lista blanca) arriba de cada tratamiento, para fragmentos de Google y buscadores con IA.
- **Foto real IMG_5694** (odontólogo en el consultorio real, 2026-11-12): convertida de HEIC con el
  decodificador de Windows (PowerShell + PresentationCore; Pillow no lee HEIC), mejorada (encuadre
  4:5, luz en sombras, contraste, tono cálido, nitidez) → marca/fotos-propias/. En local como
  provisional-odontologo-consultorio-santa-fe.webp en «Nuestros dentistas» y ficha del equipo.
  **Yama confirma (2026-11-12): es el Od. Ignacio Vera y se publica** → public/img/fotos/
  od-ignacio-vera-clinica-dental-santa-fe.webp (portada «Nuestros dentistas», equipo, schema Person.image). Recorte de retrato (cara y hombros, Yama 2026-11-12) desde marca/fotos-propias/od-ignacio-vera-retrato.jpg. Ficha del equipo (profesionales[0].foto) = la foto completa en el consultorio: od-ignacio-vera-consultorio-santa-fe.webp (Yama, 2026-11-12, **cambiado después**: ahora «Nuestros dentistas» va con el título arriba (`foto-abajo`), la foto grande = IMG_5694 completa mejorada (clinica-dental-santa-fe-od-ignacio-vera.webp) y la ficha del Od. Vera = el retrato recortado (od-ignacio-vera-clinica-dental-santa-fe.webp, también en /equipo/ y schema Person).) **Primera sección de la portada** («Clínica dental en Santa Fe con más de [X] años»): título arriba (`disposicion: foto-abajo`; sin bloque, el texto y el botón van al lado de la foto) y **la foto de stock del consultorio de siempre** (Yama probó la de IMG_5694 completa mejorada y pidió volver a la anterior, 2026-11-12; la mejorada se usa en «Nuestros dentistas»).
- Letra (Yama, 2026-11-12, captura de COV): **Open Sans** en títulos y texto; Playfair solo en
  nombres de tarjetas.
- Servicios de la portada en recuadros con dibujo (3 columnas) y obras sociales en recuadros
  con icono (pedido de Yama). Textos de los H2 que faltaban escritos (portada, obras sociales,
  primera consulta, equipo, contacto, índice); lo de la clínica va con [confirmar].

- **Menú como COV (Yama, 2026-11-12, captura)**: La clínica · Implantes · Ortodoncia ▾ (brackets,
  invisible) · Estética dental · Obras sociales · Otros tratamientos ▾ (el resto + «Todos los
  tratamientos») · Contacto · Pedir turno. Listas MENU_* en Base.astro.
- **Estudio de 4 portadas de Madrid (2026-11-12), aplicado**: FAQ de portada = 2 de salud + 3 prácticas
  (dónde/colectivo, estacionamiento, horario; respuestas [Pendiente]); H2 «Obras sociales y prepagas en Santa Fe» (2026-11-13; «Santa Fe» ya sale 41 veces en ~1.080 palabras: no añadir más, ni en los H4 de tratamientos); «odontólogo/odontología Santa Fe» (Yama, 2026-11-13) en H2 «Odontología en Santa Fe: tratamientos dentales» y «Odontólogos en Santa Fe: título y matrícula de nuestros dentistas» + antetítulos (5 variantes; el antetítulo nunca repite la clave de su H2); H2 final «Solicitar información sobre el tratamiento odontológico en Santa Fe que necesitás» (Yama, 2026-11-13); en los H2 «Santa Fe» va con espacio irrompible (no se parte en dos líneas). **Marcas** (captura de COV, 2026-11-13): sección centrada, marcas en fila (nombre en píldora o logo webp en public/img/marcas/ si existe; site.json > marcas = "Nombre" o {nombre, logo}); sigue oculta hasta que Yama diga qué marcas usa la clínica. Sin «líderes». Logos de fabricantes: pedir permiso antes de descargarlos; H2 «Cómo llegar y horario de
  nuestra clínica dental en Santa Fe» (el bloque mapa muestra el horario solo en portada); cada
  tratamiento es H4 dentro de su grupo. Propuesto y sin hacer: página de cirugía oral / muelas de
  juicio (si el Dr. Vera la hace) y blog (después de publicar).
- Fotos de «Opiniones» y «Pedir turno»: **sin personas** (Yama, 2026-11-12, no le gustaron ni el cepillo
  ni las dos mujeres). **Opiniones = foto real de la sala de espera** (IMG_5927, pedida por Yama
  2026-11-12: recorte 4:5 sin la columna, luz y color; marca/fotos-propias/sala-de-espera-opiniones.jpg,
  scratchpad mejorar-sala.py). Pedir turno = bolígrafo con espigas sobre madera clara (Sibeli Velázquez).
- «¿Por qué elegir…?»: recuadros como COV (blancos, esquinas redondeadas, icono propio en círculo
  suave, título Open Sans 700 centrado, texto gris centrado). Iconos por título en Bloque.astro.
  **6 motivos (Yama, 2026-11-12)**: título a la izquierda + 2 motivos a la derecha («Obras sociales y
  prepagas», «Atención para toda la familia»); debajo, foto | los 4 de COV. Los que pasan de 4 en
  site.json > porque salen arriba (Bloque parte="arriba").

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
- **Análisis SEO a fondo de COV (2026-11-12)** → `informes/cov-seo.md`: ≈ 190 URL (36 páginas,
  138 blog, 16 categorías), 0 enlaces en el texto de sus tratamientos, mucha canibalización en
  el blog. El servidor de COV corta a los rastreadores: no insistir (el clasificador lo bloquea
  como saltarse el control anti-robots); usar WebFetch. Backlinks: requiere Ahrefs vía `/mcp`.
  Propuestas sin hacer: blog ordenado (después de publicar), tratamientos principales en el pie,
  enlazar Doctoralia solo cuando el perfil tenga la dirección de Santa Fe.
- **Fase 6 — Auditoría hecha (2026-11-12)** (antes de publicar): `npm run auditoria`
  (`scripts/auditoria.mjs`, solo lee) + revisor de los 10 textos juntos. Resumen con
  prioridades en `informes/auditoria-resumen.md`: 0 graves mecánicos; ALTA = servicios sin
  confirmar, firma del odontólogo, 46 datos pendientes, bloques de riesgo legal; MEDIA/BAJA
  = 13 arreglos de texto y enlaces → **hechos el 2026-11-12** (descripciones sin promesas pendientes,
  placa bacteriana / de relajación, prótesis fija/removible, retenedor tras brackets, «Cómo evitar
  que avance» en periodoncia, enlaces internos, obras sociales enlazada, siglas explicadas).
  Queda solo la firma del odontólogo. Al mes de publicar: Search Console.
- **Fase 4 — AEO técnico y conversión: hecha (2026-11-12)**, salvo lo que depende de
  datos. `robots.txt` (robots de IA nombrados y permitidos), `llms.txt` (solo datos
  reales) y `sitemap.xml` (lastmod = último commit del texto de cada página) salen de
  `src/pages/*.js`. JSON-LD en `src/lib/schema.js`: Dentist (portada y contacto),
  MedicalWebPage + MedicalProcedure (tratamientos, con citas y reviewedBy/lastReviewed
  cuando haya autor), Person (equipo), BreadcrumbList, FAQPage; lo [pendiente] se omite
  (`limpiar`). Open Graph en Base. Formulario AJAX Web3Forms (`Formulario.astro`),
  desactivado hasta `site.json > formulario.web3forms_key`. Botones en infinitivo
  «Pedir turno» (no imperativo, por prudencia legal). Imágenes webp con
  `python -I scripts/imagenes.py` (logo 88 px; fotos provisionales no se suben); foto
  del héroe precargada. Validador ampliado: JSON-LD válido y sin [..], tipos por
  página, sitemap/robots/llms, img con width/height y webp.
  Pendiente para activar: clave Web3Forms (correo de la clínica), dirección, teléfono,
  horario, mapa → el schema Dentist se completa solo.
- **Fase 3 — Textos, tanda 1 hecha (2026-11-12)**: implantes, ortodoncia, ortodoncia
  invisible, tratamiento de conducto, periodoncia. Pasan `todo:contenido` y la revisión
  de 5 subagentes (sus correcciones aplicadas: nada más allá de la fuente; procesos y
  precios de la clínica → [Pendiente]). Sin autor ni fecha de revisión (pendiente: un
  odontólogo con matrícula los revisa y firma). Tanda 2 propuesta: prótesis, estética,
  limpieza y operatoria, odontopediatra, portada → **tanda 2 hecha (2026-11-12)** con 9 fuentes nuevas (MedlinePlus, NIDCR; 81 hechos) y la revisión de 5 subagentes aplicada. Quedan sin texto: tratamientos (índice), obras sociales, primera consulta, equipo, contacto (casi todo datos de la clínica).
- Diseño: **ELEGIDO DORADO SERENO (Yama, 2026-11-12; dijo primero «oliva» y lo corrigió:
  «dorado, no oliva»)**. Solo queda el tema dorado en temas.json; unido a `main` (840f618).
  Ramas viejas (fase-1-esqueleto, fase-2-diseno, diseno-oliva, diseno-dorado) siguen en GitHub:
  el permiso para borrarlas fue denegado; las borra Yama si quiere. Estructura de COV:
  héroe con foto, primera consulta destacada y ventajas; quiénes somos con foto; por qué
  elegirnos (4); sedes; tratamientos por grupos con forma orgánica en banda crema; obras
  sociales; primera consulta; promociones/reconocimientos/marcas solo con datos reales;
  equipo; opiniones; FAQ; franja de turno; pie a color. No se copia texto de COV.
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
