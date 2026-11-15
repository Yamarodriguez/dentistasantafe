"""Rastreo SEO completo de UNA web (competencia o la nuestra).

Uso:  python -I scripts/rastreo_sitio.py https://ejemplo.com/ [--max 300] [--seco]
- Respeta robots.txt, 1 petición por segundo, solo HTML del mismo dominio.
- Semillas: portada + URLs de los sitemaps (robots.txt, /sitemap_index.xml, /wp-sitemap.xml).
- Por página guarda: estado, title, description, canonical, meta robots, H1-H3, palabras,
  schema (@type), imágenes y alt, y CADA enlace interno con su texto y su zona
  (menú/cabecera, pie, contenido) → para analizar el enlazado interno.
- Salida: competencia/sitios/<dominio>/paginas.json + resumen en consola (≤ 30 líneas).
  El informe lo escribe scripts/informe_sitio.py.
Código 1 si no se pudo bajar la portada.
"""
import gzip, json, re, sys, time
from collections import deque
from pathlib import Path
from urllib import robotparser
from urllib.parse import urljoin, urlparse, urldefrag
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (compatible; RastreoSEO/1.0)"
RAIZ = Path(__file__).resolve().parent.parent
args = sys.argv[1:]
SECO = "--seco" in args
MAX = int(args[args.index("--max") + 1]) if "--max" in args else 300
inicio = next(a for a in args if a.startswith("http"))
dom = urlparse(inicio).netloc
base = f"{urlparse(inicio).scheme}://{dom}"
SALIDA = RAIZ / "competencia" / "sitios" / dom.replace("www.", "")
NO_HTML = re.compile(r"\.(jpe?g|png|gif|webp|svg|pdf|zip|mp4|mp3|css|js|xml|ico|woff2?)(\?|$)", re.I)


def bajar(url):
    req = Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    with urlopen(req, timeout=25) as r:
        datos = r.read()
        if r.headers.get("Content-Encoding") == "gzip":
            datos = gzip.decompress(datos)
        return r.status, r.geturl(), r.headers.get("Content-Type", ""), datos.decode("utf-8", "replace")


def normal(u):
    u, _ = urldefrag(u)
    p = urlparse(u)
    if p.netloc != dom or NO_HTML.search(p.path) or "?" in u or "/wp-" in p.path or "/feed" in p.path:
        return None
    ruta = p.path or "/"
    return f"{p.scheme}://{p.netloc}{ruta}"


rp = robotparser.RobotFileParser()
sitemaps = []
try:
    _, _, _, txt = bajar(base + "/robots.txt")
    rp.parse(txt.splitlines())
    sitemaps = re.findall(r"(?im)^sitemap:\s*(\S+)", txt)
except Exception:
    rp.parse([])
for extra in ("/sitemap_index.xml", "/wp-sitemap.xml", "/sitemap.xml"):
    if base + extra not in sitemaps:
        sitemaps.append(base + extra)


def leer_sitemaps():
    vistos, urls, cola = set(), set(), list(sitemaps)
    while cola and len(vistos) < 40:
        s = cola.pop(0)
        if s in vistos:
            continue
        vistos.add(s)
        try:
            time.sleep(1)
            _, _, _, xml = bajar(s)
        except Exception:
            continue
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
        for l in locs:
            if l.endswith(".xml") or "sitemap" in l.split("/")[-1]:
                cola.append(l)
            else:
                urls.add(l)
    return {normal(u) for u in urls if normal(u)}, sorted(vistos)


def zona(a):
    for p in a.parents:
        if p.name in ("footer",):
            return "pie"
        if p.name in ("header", "nav"):
            return "menu"
        clases = " ".join(p.get("class") or [])
        if "location-footer" in clases or "site-footer" in clases or "footer" in (p.get("id") or ""):
            return "pie"
        if "location-header" in clases or "site-header" in clases or "menu" in clases.split("-")[:1]:
            return "menu"
    return "contenido"


def analizar(url, html):
    s = BeautifulSoup(html, "lxml")
    meta = lambda n: (s.find("meta", attrs={"name": n}) or {}).get("content", "")
    can = s.find("link", rel="canonical")
    tipos = set()
    for js in s.find_all("script", type="application/ld+json"):
        tipos.update(re.findall(r'"@type"\s*:\s*"([^"]+)"', js.string or ""))
    for t in s(["script", "style", "noscript"]):
        t.decompose()
    enlaces = []
    for a in s.find_all("a", href=True):
        destino = normal(urljoin(url, a["href"]))
        if destino:
            enlaces.append({"a": destino, "texto": " ".join(a.get_text(" ").split())[:80],
                            "zona": zona(a), "nofollow": "nofollow" in (a.get("rel") or [])})
    externos = sorted({urljoin(url, a["href"]) for a in s.find_all("a", href=True)
                       if urlparse(urljoin(url, a["href"])).netloc not in ("", dom)
                       and urljoin(url, a["href"]).startswith("http")})
    imgs = s.find_all("img")
    cuerpo = s.find("main") or s.body or s
    return {
        "url": url,
        "title": (s.title.string or "").strip() if s.title else "",
        "description": meta("description"),
        "robots": meta("robots"),
        "canonical": can.get("href", "") if can else "",
        "h1": [" ".join(h.get_text(" ").split()) for h in s.find_all("h1")],
        "h2": [" ".join(h.get_text(" ").split()) for h in s.find_all("h2")],
        "h3": [" ".join(h.get_text(" ").split()) for h in s.find_all("h3")],
        "palabras": len(cuerpo.get_text(" ").split()),
        "schema": sorted(tipos),
        "imagenes": len(imgs),
        "img_sin_alt": sum(1 for i in imgs if not (i.get("alt") or "").strip()),
        "img_alts": [i.get("alt", "") for i in imgs][:40],
        "enlaces": enlaces,
        "externos": externos[:60],
    }


def main():
    if not rp.can_fetch(UA, inicio):
        print("FALLO robots.txt no permite la portada"); sys.exit(1)
    en_sitemap, archivos_sitemap = leer_sitemaps()
    print(f"sitemaps leídos: {len(archivos_sitemap)} · URLs en sitemap: {len(en_sitemap)}")
    if SECO:
        print(f"[seco] rastrearía hasta {MAX} páginas de {dom}"); return
    cola = deque([normal(inicio)] + sorted(en_sitemap))
    vistas, paginas, fallos = set(), [], []
    while cola and len(paginas) < MAX:
        u = cola.popleft()
        if not u or u in vistas:
            continue
        vistas.add(u)
        if not rp.can_fetch(UA, u):
            fallos.append((u, "robots.txt")); continue
        time.sleep(1)
        try:
            estado, final, tipo, html = bajar(u)
        except Exception as e:
            fallos.append((u, str(e)[:80])); continue
        if "html" not in tipo:
            continue
        d = analizar(final, html)
        d["estado"], d["pedida"] = estado, u
        paginas.append(d)
        for e in d["enlaces"]:
            if e["a"] not in vistas:
                cola.append(e["a"])
    SALIDA.mkdir(parents=True, exist_ok=True)
    (SALIDA / "paginas.json").write_text(json.dumps({
        "dominio": dom, "fecha": time.strftime("%Y-%m-%d"), "sitemaps": archivos_sitemap,
        "en_sitemap": sorted(en_sitemap), "paginas": paginas, "fallos": fallos}, ensure_ascii=False, indent=1),
        encoding="utf-8")
    print(f"[ok] {len(paginas)} páginas rastreadas · {len(fallos)} fallos · {dom}")
    for u, m in fallos[:8]:
        print(f"  FALLO {u}: {m}")
    print(f"Datos: {SALIDA / 'paginas.json'}")


main()
