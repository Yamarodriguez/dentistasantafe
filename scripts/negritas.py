"""Estudio de textos de la competencia: negritas y palabras que usan, comparado con nuestra web.

Uso:
  python -I scripts/negritas.py competencia/urls-textos.txt [--rastrear 8] [--seco]

Cada línea del archivo: "<ciudad> <url>". Con --rastrear N, de cada portada se añaden hasta
N páginas internas de tratamientos. Respeta robots.txt y 1 s entre peticiones (usa scrap.py).
Salida:
  competencia/negritas/<id>.json   datos por página (negritas, texto, tratamiento)
  informes/negritas.md             resumen y huecos de palabras por tratamiento
Consola <= 30 líneas. Sale con 1 si no se pudo bajar ninguna página.
"""
import argparse
import json
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bs4 import BeautifulSoup  # noqa: E402
from scrap import bajar, permitido, ident, PAUSA, STOP, EXCLUIR  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "competencia" / "negritas"
DIST = RAIZ / "dist"

# Página de nuestra web ↔ cómo reconocer la de la competencia por su URL (el orden importa).
TIPOS = [
    ("ortodoncia-invisible-santa-fe", r"invisal|invisible|alineador"),
    ("implantes-dentales-santa-fe", r"implant"),
    ("protesis-dentales-santa-fe", r"protesis|pr%c3%b3tesis|corona|dentadura|puente"),
    ("ortodoncia-santa-fe", r"ortodon|bracket"),
    ("estetica-dental-santa-fe", r"estetic|est%c3%a9tic|carilla|blanque|sonrisa"),
    ("tratamiento-de-conducto-santa-fe", r"endodon|conducto"),
    ("periodoncia-santa-fe", r"periodon|encia|enc%c3%ada"),
    ("odontopediatra-santa-fe", r"odontoped|infantil|ninos|ni%c3%b1os"),
    ("limpieza-dental-santa-fe", r"limpieza|higiene|revision|prevencion|caries|empaste|operatoria|general"),
]
CIUDADES = re.compile(r"\b(valencia|madrid|santa fe|rosario|argentina|españa)\b", re.I)


def tipo_de(url):
    ruta = urlparse(url).path.lower()
    if ruta in ("", "/"):
        return "portada"
    for slug, rx in TIPOS:
        if re.search(rx, ruta):
            return slug
    return None


def sin_tildes(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def palabras(texto):
    t = sin_tildes(CIUDADES.sub(" ", texto.lower()))
    return [w for w in re.findall(r"[a-zñ]{3,}", t)]


def ngramas(ws):
    limpias = [w for w in ws if w not in STOP_N]
    uni = set(limpias)
    bi = {f"{a} {b}" for a, b in zip(ws, ws[1:]) if a not in STOP_N and b not in STOP_N}
    return uni, bi


STOP_N = {sin_tildes(w) for w in STOP} | set(
    "nuestro nuestra clinica dental dentista consulta tratamiento tratamientos paciente pacientes "
    "puede pueden mejor gracias cita llamar contacto equipo".split())


def analizar(url, html):
    s = BeautifulSoup(html, "lxml")
    for t in s(["script", "style", "noscript", "header", "footer", "nav", "form", "aside", "svg"]):
        t.decompose()
    cuerpo = s.find("main") or s.body or s
    texto = " ".join(cuerpo.get_text(" ").split())
    negritas = []
    for b in cuerpo.find_all(["strong", "b"]):
        if b.find_parent(["h1", "h2", "h3", "h4", "a", "button"]):
            continue  # en títulos o botones no cuenta como negrita de texto
        x = " ".join(b.get_text(" ").split())
        if 2 <= len(x) <= 120:
            negritas.append(x)
    n = len(texto.split())
    primeras = " ".join(texto.split()[:150])
    return {
        "palabras": n,
        "negritas": negritas,
        "palabras_en_negrita": sum(len(x.split()) for x in negritas),
        "negrita_arriba": any(x in primeras for x in negritas),
        "texto": texto,
    }


def enlaces_tratamiento(base, html, n):
    s = BeautifulSoup(html, "lxml")
    dom = urlparse(base).netloc
    vistos, out = set(), []
    for a in s.find_all("a", href=True):
        u = urldefrag(urljoin(base, a["href"].strip()))[0]
        if urlparse(u).netloc != dom or EXCLUIR.search(u) or u in vistos or u.rstrip("/") == base.rstrip("/"):
            continue
        vistos.add(u)
        if tipo_de(u) not in (None, "portada"):
            out.append(u)
    # una página por tipo de tratamiento primero, luego el resto
    por_tipo, resto = {}, []
    for u in out:
        t = tipo_de(u)
        if t in por_tipo:
            resto.append(u)
        else:
            por_tipo[t] = u
    return (list(por_tipo.values()) + resto)[:n]


def nuestras_paginas():
    """Texto visible de main en dist/ por slug (hay que compilar antes)."""
    out = {}
    for f in DIST.glob("**/index.html"):
        slug = f.parent.relative_to(DIST).as_posix()
        slug = "portada" if slug == "." else slug
        s = BeautifulSoup(f.read_text(encoding="utf-8"), "lxml")
        for t in s(["script", "style", "header", "footer", "nav", "svg"]):
            t.decompose()
        m = s.find("main") or s.body
        out[slug] = " ".join(m.get_text(" ").split())
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lista")
    ap.add_argument("--rastrear", type=int, default=0)
    ap.add_argument("--seco", action="store_true")
    ap.add_argument("--solo-informe", action="store_true", help="rehace el informe con lo ya bajado (solo webs de la lista)")
    a = ap.parse_args()
    entradas = []
    for linea in (RAIZ / a.lista).read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if linea and not linea.startswith("#"):
            ciudad, url = linea.split(None, 1)
            entradas.append((ciudad, url))
    if a.seco:
        print(f"{len(entradas)} portadas; se rastrearían hasta {a.rastrear} páginas por web")
        return 0
    if a.solo_informe:
        dominios = {urlparse(u).netloc.replace("www.", "") for _, u in entradas}
        paginas = [json.loads(f.read_text(encoding="utf-8")) for f in sorted(SALIDA.glob("*.json"))]
        paginas = [p for p in paginas if urlparse(p["url"]).netloc.replace("www.", "") in dominios]
        informe(paginas, 0)
        return 0
    SALIDA.mkdir(parents=True, exist_ok=True)
    paginas, fallos = [], 0
    cola = [(c, u, True) for c, u in entradas]
    while cola:
        ciudad, url, es_portada = cola.pop(0)
        if not permitido(url):
            fallos += 1
            continue
        try:
            final, html = bajar(url)
        except Exception:
            fallos += 1
            continue
        time.sleep(PAUSA)
        d = analizar(final, html)
        d.update(url=final, ciudad=ciudad, tipo=tipo_de(final) or ("portada" if es_portada else None))
        (SALIDA / f"{ident(final)}.json").write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
        paginas.append(d)
        if es_portada and a.rastrear:
            cola[0:0] = [(ciudad, u, False) for u in enlaces_tratamiento(final, html, a.rastrear)]
    if not paginas:
        print("ERROR: no se pudo bajar ninguna página")
        return 1
    informe(paginas, fallos)
    return 0


def informe(paginas, fallos):
    L = ["# Textos de la competencia: negritas y palabras clave", ""]
    # 1. Negritas por ciudad
    L += ["## 1. Negritas por ciudad", "",
          "| Ciudad | Páginas | Con negritas | Negritas por página (media) | % palabras en negrita | Negrita en las 150 primeras palabras |",
          "|---|---|---|---|---|---|"]
    por_ciudad = defaultdict(list)
    for p in paginas:
        por_ciudad[p["ciudad"]].append(p)
    for c, ps in sorted(por_ciudad.items()):
        con = [p for p in ps if p["negritas"]]
        media = sum(len(p["negritas"]) for p in ps) / len(ps)
        pct = 100 * sum(p["palabras_en_negrita"] for p in ps) / max(1, sum(p["palabras"] for p in ps))
        arriba = sum(p["negrita_arriba"] for p in ps)
        L.append(f"| {c} | {len(ps)} | {len(con)} | {media:.1f} | {pct:.1f} % | {arriba} |")
    L.append("")
    # 2. Qué ponen en negrita
    largo = Counter()
    contiene = Counter()
    for p in paginas:
        for x in set(p["negritas"]):
            n = len(x.split())
            largo["1-3 palabras" if n <= 3 else "4-8 palabras" if n <= 8 else "frase larga (9+)"] += 1
            t = sin_tildes(x.lower())
            for nombre, rx in [("tratamiento", r"implant|ortodon|invisal|alinead|bracket|carilla|blanque|endodon|conducto|periodon|encia|protesis|corona|odontoped|limpieza"),
                               ("ciudad", r"valencia|madrid|santa fe|rosario"),
                               ("clinica/dentista", r"clinica|dentista|odontolog|centro"),
                               ("cifra/plazo/precio", r"\d|precio|euro|€|mes|dia|hora|ano"),
                               ("beneficio/resultado", r"sin dolor|natural|segur|rapid|comod|duradero|estetic")]:
                if re.search(rx, t):
                    contiene[nombre] += 1
    total = sum(largo.values()) or 1
    L += ["## 2. Qué ponen en negrita", "", f"{total} negritas distintas en {len(paginas)} páginas.", ""]
    L += [f"- Largo: " + ", ".join(f"{k} {100 * v / total:.0f} %" for k, v in largo.most_common())]
    L += [f"- Contienen {k}: {100 * v / total:.0f} %" for k, v in contiene.most_common()]
    frec = Counter()
    for p in paginas:
        for x in set(p["negritas"]):
            frec[CIUDADES.sub("{ciudad}", x.lower()).strip(" .:,")] += 1
    L += ["", "Las más repetidas (en varias páginas):", ""]
    L += [f"- «{x}» ({n})" for x, n in frec.most_common(40) if n >= 2]
    L.append("")
    # 3. Huecos de palabras por tratamiento
    nuestras = nuestras_paginas()
    L += ["## 3. Palabras que usa la competencia y nuestra página no", "",
          "Por tratamiento: términos (y pares de palabras) que salen en al menos el 30 % de las páginas",
          "de la competencia de ese tratamiento (mínimo 3) y no salen en la nuestra. Sin nombres de ciudad.", ""]
    por_tipo = defaultdict(list)
    for p in paginas:
        if p["tipo"]:
            por_tipo[p["tipo"]].append(p)
    for slug in ["portada"] + [s for s, _ in TIPOS]:
        ps = por_tipo.get(slug, [])
        if not ps or slug not in nuestras:
            continue
        df_u, df_b = Counter(), Counter()
        for p in ps:
            u, b = ngramas(palabras(p["texto"]))
            df_u.update(u)
            df_b.update(b)
        nu, nb = ngramas(palabras(nuestras[slug]))
        minimo = max(3, round(0.3 * len(ps)))
        hu = [(w, n) for w, n in df_u.most_common() if n >= minimo and w not in nu][:25]
        hb = [(w, n) for w, n in df_b.most_common() if n >= minimo and w not in nb][:20]
        media = sum(p["palabras"] for p in ps) / len(ps)
        L += [f"### {slug} — {len(ps)} páginas de la competencia (media {media:.0f} palabras; la nuestra {len(nuestras[slug].split())})", "",
              "Palabras: " + (", ".join(f"{w} ({n})" for w, n in hu) or "—"), "",
              "Pares: " + (", ".join(f"{w} ({n})" for w, n in hb) or "—"), ""]
    L += [f"Páginas bajadas: {len(paginas)} · fallidas o bloqueadas por robots.txt: {fallos}", ""]
    destino = RAIZ / "informes" / "negritas.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text("\n".join(L), encoding="utf-8")
    print(f"[ok] {len(paginas)} páginas · {fallos} fallidas · {total} negritas distintas")
    for c, ps in sorted(por_ciudad.items()):
        print(f"  {c}: {len(ps)} páginas, {sum(bool(p['negritas']) for p in ps)} con negritas")
    print(f"Detalle: informes/negritas.md")


if __name__ == "__main__":
    sys.exit(main())
