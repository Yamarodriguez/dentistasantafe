"""Scraper de competencia: encabezados, estructura, textos y palabras clave.

Uso:
  python scripts/scrap.py competencia/urls.txt [--rastrear 15] [--seco]

Salida:
  competencia/datos/<id>.json   datos por pagina
  competencia/texto/<id>.txt    texto limpio por pagina
  informes/competencia.md       resumen comparado (lo unico que lee Claude)
Consola: <= 30 lineas. Sale con 1 si ninguna pagina se pudo bajar.
"""
import argparse
import json
import re
import sys
import time
import urllib.request
import urllib.robotparser
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

from bs4 import BeautifulSoup

RAIZ = Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
PAUSA = 1.0

TRATAMIENTOS = {
    "implantes": r"implant",
    "all-on-4 / carga inmediata": r"all[\s-]?on[\s-]?[46]|carga inmediata",
    "ortodoncia": r"ortodonc",
    "invisalign / alineadores": r"invisalign|alineador",
    "brackets": r"bracket",
    "endodoncia": r"endodonc|matar el nervio",
    "periodoncia": r"periodon|piorrea|enc[ií]as",
    "blanqueamiento": r"blanqueamiento",
    "carillas": r"carilla",
    "estetica dental / diseño sonrisa": r"est[ée]tica dental|dise[ñn]o de (la )?sonrisa",
    "protesis": r"pr[óo]tesis|dentadura",
    "coronas / puentes": r"corona|puente dental|puentes",
    "odontopediatria": r"odontopediatr|ni[ñn]os",
    "limpieza / higiene": r"limpieza|higiene dental|profilaxis",
    "extracciones / cirugia oral": r"extracci[óo]n|cirug[ií]a oral|muelas? del juicio",
    "empastes / caries": r"empaste|caries|obturaci",
    "bruxismo / ATM / ferula": r"bruxismo|f[ée]rula|atm\b|articulaci[óo]n temporomandibular",
    "urgencias": r"urgencia",
    "sedacion": r"sedaci[óo]n",
    "injerto / elevacion seno": r"injerto|elevaci[óo]n de seno|regeneraci[óo]n [óo]sea",
    "financiacion": r"financia",
    "primera visita gratis": r"primera visita gratis|primera consulta gratis|visita gratuita",
}
PISTAS_RASTREO = re.compile(
    r"tratamiento|servicio|especialidad|precio|tarifa|equipo|nosotros|clinica|"
    + "|".join(v for v in TRATAMIENTOS.values()),
    re.I,
)
EXCLUIR = re.compile(
    r"/(wp-content|wp-json|wp-admin|feed|tag|category|categoria|author|page/\d|cart|carrito|"
    r"aviso-legal|politica|privacidad|cookies|legal)\b|\.(jpe?g|png|webp|gif|svg|pdf|zip|mp4)$|[?#]",
    re.I,
)

STOP = set("""
a al algo algun alguna algunas alguno algunos ante antes asi aun aunque bajo bien cada como con
contra cual cuales cuando de del desde donde dos el ella ellas ellos en entre era es esa esas ese
eso esos esta estas este esto estos fue ha hace hacen hacer han hasta hay la las le les lo los mas
me mi mis mucho muy nada ni no nos nuestra nuestras nuestro nuestros o otra otras otro otros para
pero poco por porque puede pueden que se sea ser si sin sobre son su sus tambien tan te tener
tiene tienen todo todos tu tus un una unas uno unos usted ustedes y ya yo les sus está están
más también así qué cómo cuál dónde según será sido sólo solo cada vez muy hemos hacemos
ofrecemos puedes tu tus os vuestra vuestro https www com es html leer click aquí aqui ver
""".split())


def bajar(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es-ES,es;q=0.9"})
    with urllib.request.urlopen(req, timeout=25) as r:
        crudo = r.read()
        cs = r.headers.get_content_charset() or "utf-8"
        return r.geturl(), crudo.decode(cs, errors="replace")


robots_cache = {}


def permitido(url):
    p = urlparse(url)
    base = f"{p.scheme}://{p.netloc}"
    if base not in robots_cache:
        rp = urllib.robotparser.RobotFileParser()
        try:
            _, txt = bajar(base + "/robots.txt")
            rp.parse(txt.splitlines())
        except Exception:
            rp = None
        robots_cache[base] = rp
    rp = robots_cache[base]
    return True if rp is None else rp.can_fetch(UA, url)


def ident(url):
    p = urlparse(url)
    ruta = re.sub(r"[^a-z0-9]+", "-", p.path.lower()).strip("-") or "portada"
    return f"{p.netloc.replace('www.', '')}__{ruta}"[:120]


def analizar(url_final, html):
    s = BeautifulSoup(html, "lxml")
    meta = lambda n: (s.find("meta", attrs={"name": n}) or {}).get("content", "")
    canon = s.find("link", rel="canonical")
    # schema
    tipos = []
    for js in s.find_all("script", type="application/ld+json"):
        try:
            d = json.loads(js.string or "")
        except Exception:
            continue
        pila = [d]
        while pila:
            x = pila.pop()
            if isinstance(x, list):
                pila.extend(x)
            elif isinstance(x, dict):
                t = x.get("@type")
                if t:
                    tipos.extend(t if isinstance(t, list) else [t])
                pila.extend(v for v in x.values() if isinstance(v, (dict, list)))
    # enlaces y CTAs (antes de limpiar)
    dominio = urlparse(url_final).netloc
    internos, externos = set(), set()
    ctas = Counter()
    for a in s.find_all("a", href=True):
        h = a["href"].strip()
        if h.startswith("tel:"):
            ctas["telefono"] += 1
        elif "wa.me" in h or "whatsapp" in h:
            ctas["whatsapp"] += 1
        elif h.startswith("mailto:"):
            ctas["correo"] += 1
        txt = a.get_text(" ", strip=True).lower()
        if re.search(r"cita|reserv|pide|solicita|llam", txt):
            ctas["boton_cita"] += 1
        absu = urldefrag(urljoin(url_final, h))[0]
        if absu.startswith("http"):
            (internos if urlparse(absu).netloc == dominio else externos).add(absu)
    imgs = s.find_all("img")
    n_img = len(imgs)
    n_sin_alt = sum(1 for i in imgs if not (i.get("alt") or "").strip())
    # encabezados en orden
    enc = [(t.name, re.sub(r"\s+", " ", t.get_text(" ", strip=True)))
           for t in s.find_all(re.compile(r"^h[1-6]$"))]
    enc = [e for e in enc if e[1]]
    # texto limpio
    for t in s(["script", "style", "noscript", "svg", "iframe", "form"]):
        t.decompose()
    cuerpo = s.find("main") or s.find("article") or s.body or s
    for t in cuerpo.find_all(["nav", "footer", "header", "aside"]):
        t.decompose()
    bloques = []
    for t in cuerpo.find_all(re.compile(r"^(h[1-6]|p|li|td|th|blockquote)$")):
        tx = re.sub(r"\s+", " ", t.get_text(" ", strip=True))
        if len(tx) > 2 and (not bloques or bloques[-1] != tx):
            pref = "#" * int(t.name[1]) + " " if t.name[0] == "h" and t.name[1:].isdigit() else ""
            bloques.append(pref + tx)
    texto = "\n".join(bloques)
    faq = bool(re.search(r"preguntas frecuentes|faq", texto, re.I)) or "FAQPage" in tipos
    return {
        "url": url_final,
        "title": (s.title.get_text(strip=True) if s.title else ""),
        "description": meta("description"),
        "canonical": canon.get("href", "") if canon else "",
        "h1": [t for n, t in enc if n == "h1"],
        "encabezados": enc,
        "palabras": len(re.findall(r"\w+", texto)),
        "schema": sorted(set(tipos)),
        "faq": faq,
        "ctas": dict(ctas),
        "imagenes": n_img,
        "img_sin_alt": n_sin_alt,
        "enlaces_internos": len(internos),
        "enlaces_externos": len(externos),
        "tratamientos": [k for k, rx in TRATAMIENTOS.items() if re.search(rx, texto, re.I)],
        "_internos": sorted(internos),
        "_texto": texto,
    }


def tokens(texto):
    pal = [w for w in re.findall(r"[a-záéíóúñü]+", texto.lower()) if len(w) > 2]
    uni = [w for w in pal if w not in STOP]
    bi = [f"{a} {b}" for a, b in zip(pal, pal[1:]) if a not in STOP and b not in STOP]
    return uni, bi


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("urls")
    ap.add_argument("--rastrear", type=int, default=0, help="paginas internas extra por dominio")
    ap.add_argument("--seco", action="store_true", help="solo lista lo que bajaria")
    a = ap.parse_args()

    semillas = [l.strip() for l in Path(a.urls).read_text(encoding="utf-8").splitlines()
                if l.strip() and not l.startswith("#")]
    if a.seco:
        print(f"[seco] {len(semillas)} URL semilla, +{a.rastrear} internas por dominio como maximo")
        for u in semillas[:20]:
            print("  ", u)
        return 0

    dd, dt = RAIZ / "competencia/datos", RAIZ / "competencia/texto"
    dd.mkdir(parents=True, exist_ok=True)
    dt.mkdir(parents=True, exist_ok=True)
    (RAIZ / "informes").mkdir(exist_ok=True)

    cola = list(semillas)
    vistos, paginas, fallos = set(), [], []
    extra = Counter()
    while cola:
        u = cola.pop(0)
        if u in vistos:
            continue
        vistos.add(u)
        if not permitido(u):
            fallos.append((u, "robots.txt lo prohibe"))
            continue
        try:
            fin, html = bajar(u)
            d = analizar(fin, html)
        except Exception as e:
            fallos.append((u, str(e)[:80]))
            continue
        finally:
            time.sleep(PAUSA)
        if d["palabras"] < 80:
            fallos.append((u, f"solo {d['palabras']} palabras (¿web con JS?)"))
        paginas.append(d)
        dom = urlparse(fin).netloc
        if a.rastrear and u in semillas:
            for l in d["_internos"]:
                if extra[dom] >= a.rastrear:
                    break
                if l not in vistos and l not in cola and PISTAS_RASTREO.search(urlparse(l).path) \
                        and not EXCLUIR.search(l) and urlparse(l).path not in ("", "/"):
                    cola.append(l)
                    extra[dom] += 1
        i = ident(fin)
        (dt / f"{i}.txt").write_text(d["_texto"], encoding="utf-8")
        guard = {k: v for k, v in d.items() if not k.startswith("_")}
        (dd / f"{i}.json").write_text(json.dumps(guard, ensure_ascii=False, indent=1), encoding="utf-8")

    if not paginas:
        print("SE HA PARADO EN: descarga — ninguna pagina bajada")
        for u, e in fallos[:10]:
            print(f"  {u}: {e}")
        return 1

    # ---------- informe ----------
    por_dom = defaultdict(list)
    for p in paginas:
        por_dom[urlparse(p["url"]).netloc.replace("www.", "")].append(p)
    df_uni, df_bi, tot_uni, tot_bi = Counter(), Counter(), Counter(), Counter()
    trat_dom = defaultdict(set)
    for dom, ps in por_dom.items():
        su, sb = set(), set()
        for p in ps:
            u, b = tokens(p["_texto"])
            tot_uni.update(u); tot_bi.update(b)
            su.update(u); sb.update(b)
            for t in p["tratamientos"]:
                trat_dom[t].add(dom)
        df_uni.update(su); df_bi.update(sb)
    n = len(por_dom)

    L = [f"# Competencia — {len(paginas)} páginas de {n} webs", "",
         f"Fecha: {time.strftime('%Y-%m-%d')} · fallos: {len(fallos)}", "",
         "## Resumen por página", "",
         "| Página | Palabras | H1 | H2 | H3 | Schema | FAQ | CTAs | Img sin alt |",
         "|---|---|---|---|---|---|---|---|---|"]
    for p in paginas:
        c = Counter(nm for nm, _ in p["encabezados"])
        cta = ", ".join(f"{k} {v}" for k, v in p["ctas"].items()) or "—"
        L.append(f"| {p['url']} | {p['palabras']} | {c['h1']} | {c['h2']} | {c['h3']} | "
                 f"{', '.join(p['schema']) or '—'} | {'sí' if p['faq'] else 'no'} | {cta} | "
                 f"{p['img_sin_alt']}/{p['imagenes']} |")
    L += ["", f"## Tratamientos: en cuántas webs aparecen (de {n})", "",
          "| Tratamiento | Webs |", "|---|---|"]
    for t in sorted(TRATAMIENTOS, key=lambda t: -len(trat_dom[t])):
        L.append(f"| {t} | {len(trat_dom[t])} |")
    L += ["", "## Palabras clave comunes (nº de webs que las usan · apariciones totales)", "",
          "**Bigramas**: " + ", ".join(f"{k} ({df_bi[k]}·{tot_bi[k]})"
                                     for k, _ in sorted(tot_bi.items(), key=lambda x: (-df_bi[x[0]], -x[1]))[:50]),
          "",
          "**Palabras**: " + ", ".join(f"{k} ({df_uni[k]}·{tot_uni[k]})"
                                     for k, _ in sorted(tot_uni.items(), key=lambda x: (-df_uni[x[0]], -x[1]))[:60]),
          "", "## Estructura por página", ""]
    for p in paginas:
        L += [f"### {p['url']}", f"- **title** ({len(p['title'])}): {p['title']}",
              f"- **description** ({len(p['description'])}): {p['description'] or '—'}", ""]
        for nm, tx in p["encabezados"]:
            ind = "  " * (int(nm[1]) - 1)
            L.append(f"{ind}- {nm.upper()}: {tx[:140]}")
        L.append("")
    if fallos:
        L += ["## Fallos", ""] + [f"- {u}: {e}" for u, e in fallos]
    (RAIZ / "informes/competencia.md").write_text("\n".join(L), encoding="utf-8")

    print(f"[ok] {len(paginas)} paginas de {n} webs · {len(fallos)} fallos")
    for dom, ps in list(por_dom.items())[:15]:
        print(f"  {dom}: {len(ps)} pag · media {sum(p['palabras'] for p in ps)//len(ps)} palabras")
    top = sorted(TRATAMIENTOS, key=lambda t: -len(trat_dom[t]))[:6]
    print("  tratamientos mas comunes: " + ", ".join(f"{t} ({len(trat_dom[t])})" for t in top))
    for u, e in fallos[:5]:
        print(f"  FALLO {u}: {e}")
    print("Detalle: informes/competencia.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
