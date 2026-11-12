"""Convierte las imágenes originales a webp con su tamaño real de uso (Fase 4).

Uso:  python -I scripts/imagenes.py [--seco]
Origen y destino en la tabla IMAGENES. Idempotente: solo rehace si el original es
más nuevo. Originales en la raíz (logo) y en marca/unsplash/ (no se suben a Git);
los webp de public/img/ sí se suben. Necesita Pillow. Código 1 si falta algún original.
"""
import sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SECO = "--seco" in sys.argv
U = "marca/unsplash/"

# (original, destino en public/img, ancho en píxeles)
IMAGENES = [
    ("logo.jpg", "logo-88.webp", 88),                       # cabecera y pie (44 px x2)
    (U + "sonrisa-heroe.jpg", "fotos/sonrisa-heroe.webp", 1600),   # héroe de portada
    (U + "consultorio.jpg", "fotos/consultorio.webp", 900),        # secciones (se ven a ~500 px)
    (U + "dentista-paciente.jpg", "fotos/dentista-paciente.webp", 900),
    (U + "sillon.jpg", "fotos/sillon.webp", 900),
    (U + "sonrisa-turno.jpg", "fotos/sonrisa-turno.webp", 900),
    (U + "implantes.jpg", "fotos/implantes.webp", 900),
    (U + "protesis.jpg", "fotos/protesis.webp", 900),
    (U + "ortodoncia.jpg", "fotos/ortodoncia.webp", 900),
    (U + "alineador.jpg", "fotos/alineador.webp", 900),
    (U + "conducto.jpg", "fotos/conducto.webp", 900),
    (U + "periodoncia.jpg", "fotos/periodoncia.webp", 900),
    (U + "estetica.jpg", "fotos/estetica.webp", 900),
    (U + "ninos.jpg", "fotos/limpieza.webp", 900),        # joven cepillándose → Limpieza
    (U + "limpieza.jpg", "fotos/ninos.webp", 900),        # cepillos de colores → Odontopediatría
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
