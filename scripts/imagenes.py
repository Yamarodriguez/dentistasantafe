"""Convierte las imágenes originales a webp con su tamaño real de uso (Fase 4).

Uso:  python -I scripts/imagenes.py [--seco]
Origen y destino en la tabla IMAGENES. Idempotente: solo rehace si el original es
más nuevo. Las fotos provisionales salen con nombre provisional-* (no se suben a Git).
Necesita Pillow. Código 1 si falta algún original.
"""
import sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SECO = "--seco" in sys.argv

# (original en la raíz del proyecto, destino en public/img, ancho en píxeles)
IMAGENES = [
    ("logo.jpg", "logo-88.webp", 88),          # cabecera y pie (se ve a 44 px, x2 pantallas retina)
    ("Recepción dental elegante en tonos dorados.png", "provisional-recepcion.webp", 1600),
    ("05883ff8-df21-429f-949b-8de9d56c9aa4.png", "provisional-recepcion-2.webp", 800),
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
    im = Image.open(o).convert("RGB")
    alto = round(im.height * ancho / im.width)
    im.resize((ancho, alto), Image.LANCZOS).save(d, "WEBP", quality=80, method=6)
    print(f"ok    {destino} {ancho}x{alto} · {d.stat().st_size // 1024} KB")
sys.exit(1 if fallos else 0)
