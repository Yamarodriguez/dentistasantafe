"""Convierte las imágenes originales a webp con su tamaño real de uso (Fase 4).

Uso:  python -I scripts/imagenes.py [--seco]
El nombre de cada webp lleva la palabra clave del H2 donde se usa (SEO de imágenes).
Idempotente: solo rehace si el original es más nuevo. Originales en la raíz y en
marca/unsplash/ (no se suben a Git); los webp de public/img/ sí, salvo provisional-*.
Necesita Pillow. Código 1 si falta algún original.
"""
import sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SECO = "--seco" in sys.argv
U = "marca/unsplash/"
REC1 = "Recepción dental elegante en tonos dorados.png"
REC2 = "05883ff8-df21-429f-949b-8de9d56c9aa4.png"

# (original, destino en public/img, ancho en píxeles)
IMAGENES = [
    ("logo.jpg", "clinica-dental.webp", 88),
    # Provisionales (renders de Yama, no se suben): héroe y «Cómo llegar»
    (REC1, "clinica-dental-santa-fe.webp", 1600),
    (REC2, "provisional-como-llegar-clinica-dental-santa-fe.webp", 900),
    # Portada (una por H2)
    (U + "consultorio.jpg", "fotos/clinica-dental-santa-fe-consultorio.webp", 900),
    # Primera sección de la portada: foto real completa del consultorio con el Od. Vera (IMG_5694 mejorada)
    ("marca/fotos-propias/consultorio-od-vera-completa.jpg", "fotos/clinica-dental-santa-fe-od-ignacio-vera.webp", 900),
    (U + "dentista-paciente.jpg", "fotos/dentista-santa-fe-clinica-dental.webp", 900),
    (U + "protesis.jpg", "fotos/tratamientos-dentales-santa-fe.webp", 900),
    (U + "sillon.jpg", "fotos/obras-sociales-clinica-dental-santa-fe.webp", 900),
    (U + "implantes.jpg", "fotos/primera-consulta-dentista-santa-fe.webp", 900),
    ("marca/fotos-propias/sala-de-espera-opiniones.jpg", "fotos/sala-de-espera-clinica-dental-santa-fe.webp", 900),  # foto real: sala de espera (IMG_5927)
    (U + "ortodoncia.jpg", "fotos/preguntas-frecuentes-clinica-dental-santa-fe.webp", 900),
    (U + "boligrafo-espigas-madera.jpg", "fotos/turno-clinica-dental-santa-fe.webp", 900),
    # Foto real (IMG_5694 mejorada; Yama confirma que es el Od. Ignacio Vera y que se publica)
    ("marca/fotos-propias/od-ignacio-vera-retrato.jpg", "fotos/od-ignacio-vera-clinica-dental-santa-fe.webp", 900),
    # Ficha del equipo: la foto completa en el consultorio (la recortada va grande en «Nuestros dentistas»)
    ("marca/fotos-propias/odontologo-consultorio-santa-fe.jpg", "fotos/od-ignacio-vera-consultorio-santa-fe.webp", 900),
    # Tratamientos (primer H2 de cada página)
    (U + "implantes.jpg", "fotos/implantes-dentales-santa-fe.webp", 900),
    # Implantes: una foto más por H2 (Yama, 2026-11-14: «fotos profesionales y bonitas»)
    (U + "implante-maqueta-dientes.jpg", "fotos/implante-dental-santa-fe-dientes-perdidos.webp", 900),
    (U + "implantes-maxilar-completo.jpg", "fotos/tipos-de-implantes-dentales-santa-fe.webp", 900),
    (U + "planificacion-tomografia.jpg", "fotos/tomografia-implantes-dentales-santa-fe.webp", 900),
    (U + "implante-corona-guante.jpg", "fotos/implante-dental-y-corona-santa-fe.webp", 900),
    (U + "protesis.jpg", "fotos/protesis-dentales-santa-fe.webp", 900),
    (U + "ortodoncia.jpg", "fotos/ortodoncia-santa-fe-brackets.webp", 900),
    (U + "alineador.jpg", "fotos/ortodoncia-invisible-santa-fe.webp", 900),
    (U + "conducto.jpg", "fotos/tratamiento-de-conducto-santa-fe.webp", 900),
    (U + "periodoncia.jpg", "fotos/periodoncia-santa-fe.webp", 900),
    (U + "estetica.jpg", "fotos/estetica-dental-santa-fe.webp", 900),
    (U + "ninos.jpg", "fotos/limpieza-dental-santa-fe.webp", 900),
    (U + "cepillo-bambu-blanco.jpg", "fotos/odontopediatra-santa-fe.webp", 900),
    # Tratamientos: 2-3 fotos más por página (Yama, 2026-11-14)
    (U + "protesis-implantes-maqueta.jpg", "fotos/protesis-sobre-implantes-santa-fe.webp", 900),
    (U + "protesis-laboratorio.jpg", "fotos/coronas-y-protesis-dentales-laboratorio-santa-fe.webp", 900),
    (U + "protesis-removible-modelo.jpg", "fotos/cuidados-protesis-removible-santa-fe.webp", 900),
    (U + "brackets-maqueta.jpg", "fotos/tipos-de-brackets-ortodoncia-santa-fe.webp", 900),
    (U + "brackets-y-alineadores-maquetas.jpg", "fotos/tratamiento-con-brackets-santa-fe.webp", 900),
    (U + "brackets-guante.jpg", "fotos/cuidados-brackets-ortodoncia-santa-fe.webp", 900),
    (U + "alineador-fondo-blanco.jpg", "fotos/alineadores-transparentes-santa-fe.webp", 900),
    (U + "alineador-colocacion.jpg", "fotos/tratamiento-con-alineadores-santa-fe.webp", 900),
    (U + "sonrisa-blanqueamiento.jpg", "fotos/blanqueamiento-dental-santa-fe.webp", 900),
    (U + "sonrisa-cuidados.jpg", "fotos/cuidados-estetica-dental-santa-fe.webp", 900),
    (U + "espejo-dental-consultorio.jpg", "fotos/duele-tratamiento-de-conducto-santa-fe.webp", 900),
    (U + "instrumental-dental-mesa.jpg", "fotos/endodoncia-santa-fe-instrumental.webp", 900),
    (U + "piezas-de-mano-sillon.jpg", "fotos/tratamiento-periodoncia-santa-fe.webp", 900),
    (U + "cepillos-en-taza.jpg", "fotos/prevenir-enfermedad-encias-santa-fe.webp", 900),
    (U + "espejo-y-explorador.jpg", "fotos/caries-operatoria-dental-santa-fe.webp", 900),
    (U + "maqueta-dientes-mesa.jpg", "fotos/bruxismo-placa-de-relajacion-santa-fe.webp", 900),
    (U + "cepillo-rosa-fondo-naranja.jpg", "fotos/selladores-fluor-ninos-santa-fe.webp", 900),
    (U + "cepillos-infantiles-vaso.jpg", "fotos/caries-dientes-de-leche-santa-fe.webp", 900),
    (U + "cepillos-colores.jpg", "fotos/miedo-al-dentista-ninos-santa-fe.webp", 900),
]

fallos = 0
for origen, destino, ancho in IMAGENES:
    o, d = RAIZ / origen, RAIZ / "public" / "img" / destino
    if not o.exists():
        print(f"FALLO falta el original: {origen}")
        fallos += 1
        continue
    if d.exists() and d.stat().st_mtime >= o.stat().st_mtime:
        print(f"ok    {destino} (al día)")
        continue
    if SECO:
        print(f"seco  haría {destino} ({ancho} px)")
        continue
    d.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(o).convert("RGB")
    alto = round(im.height * ancho / im.width)
    im.resize((ancho, alto), Image.LANCZOS).save(d, "WEBP", quality=78, method=6)
    print(f"ok    {destino} {ancho}x{alto} · {d.stat().st_size // 1024} KB")
sys.exit(1 if fallos else 0)
