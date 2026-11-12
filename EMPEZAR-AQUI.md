# Cómo arrancar el chat nuevo

1. Abre Claude Code en la carpeta `D:\web\clinica-dental`.
2. Modelo: **Opus** para esta primera sesión (análisis de competencia y plan).
   Después, **Sonnet esfuerzo medio** para el resto de fases.
3. Copia el mensaje de abajo, rellena lo que está entre corchetes y pégalo.

---

```
Lee CLAUDE.md y sigue. Es una web NUEVA de clínica dental (no hay WordPress
que migrar). Método: PROMPT-WEB-NUEVA-V8.md; lee solo la sección 1 y la FASE 0.
Castellano de España, de tú, sin jerga; lo haces tú. Modo autónomo: dudas
juntas y numeradas al final.

CIUDAD/ZONA: [Valencia, barrio ..]
BÚSQUEDA PRINCIPAL: [dentista Valencia / clínica dental Valencia]
URL DE LA COMPETENCIA (las que salen arriba en Google):
[https://...]
[https://...]
[https://...]

Haz la FASE 0:
1. Pon las URL en competencia/urls.txt.
2. Ejecuta: python -I scripts/scrap.py competencia/urls.txt --rastrear 15
3. Lee SOLO informes/competencia.md (y algún competencia/texto/*.txt con grep
   si hace falta un ejemplo concreto).
4. Escribe informes/analisis-competencia.md con:
   - arquitectura de páginas común (qué páginas tienen todas);
   - tratamientos imprescindibles y en cuántas webs salen;
   - patrón de H1, H2 y H3 (ejemplos reales) por tipo de página;
   - palabras clave y variantes por página (portada, cada tratamiento,
     precios, equipo, contacto);
   - temas y enfoque de los textos (longitud, tono, precios sí/no, FAQ,
     schema, reseñas, equipo, CTAs);
   - qué hacen bien y huecos que nadie cubre (oportunidades).
5. Propón la lista de páginas de mi web con su palabra clave, su H1 y sus H2.
6. Actualiza CLAUDE.md (estado) y dame un resumen corto + preguntas numeradas.
```

---

## Más adelante (cada sesión nueva)
`Lee CLAUDE.md y sigue.` — y, si toca, la ficha completa del negocio
(plantilla en `PROMPT-WEB-NUEVA-V8.md`, apartado FICHA) en un solo mensaje.
