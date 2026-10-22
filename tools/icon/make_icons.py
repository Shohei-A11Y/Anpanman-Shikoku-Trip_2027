#!/usr/bin/env python3
"""汽車のイラストのアイコンを作る（SVG→PNG）。リポジトリ直下で実行する。"""
import subprocess, pathlib, textwrap
root = pathlib.Path(__file__).resolve().parents[2]
A = root / "assets"

def art(scale):
    return f'''<g transform="translate(256 262) scale({scale}) translate(-256 -262)">
  <defs><clipPath id="b"><rect x="136" y="150" width="240" height="230" rx="62"/></clipPath></defs>
  <g fill="#fff"><ellipse cx="128" cy="130" rx="46" ry="22"/><ellipse cx="160" cy="116" rx="36" ry="24"/><ellipse cx="96" cy="136" rx="30" ry="16"/></g>
  <circle cx="392" cy="122" r="38" fill="#F4C542"/>
  <ellipse cx="256" cy="520" rx="330" ry="120" fill="#9CCB9A"/>
  <path d="M216 396 L150 520 M296 396 L362 520" stroke="#8C8C8C" stroke-width="12" stroke-linecap="round"/>
  <path d="M196 440 H316 M178 478 H334" stroke="#B9966A" stroke-width="12" stroke-linecap="round"/>
  <circle cx="256" cy="138" r="20" fill="#F4C542" stroke="#8A6A00" stroke-width="6"/>
  <rect x="136" y="150" width="240" height="230" rx="62" fill="#D9534A"/>
  <g clip-path="url(#b)"><rect x="136" y="304" width="240" height="38" fill="#F4C542"/></g>
  <rect x="164" y="178" width="184" height="112" rx="38" fill="#FFF8EC" stroke="#7A2E27" stroke-width="7"/>
  <circle cx="216" cy="226" r="13" fill="#3A2A25"/><circle cx="296" cy="226" r="13" fill="#3A2A25"/>
  <circle cx="219" cy="222" r="4" fill="#fff"/><circle cx="299" cy="222" r="4" fill="#fff"/>
  <path d="M224 252 Q256 282 288 252" fill="none" stroke="#3A2A25" stroke-width="9" stroke-linecap="round"/>
  <circle cx="188" cy="256" r="15" fill="#F29A8F"/><circle cx="324" cy="256" r="15" fill="#F29A8F"/>
  <circle cx="186" cy="326" r="17" fill="#FFF3B0" stroke="#8A6A00" stroke-width="5"/><circle cx="326" cy="326" r="17" fill="#FFF3B0" stroke="#8A6A00" stroke-width="5"/>
  <rect x="150" y="364" width="212" height="28" rx="14" fill="#4B78B0"/>
</g>'''

def svg(scale, rounded):
    rx = 112 if rounded else 0
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><clipPath id="r"><rect width="512" height="512" rx="{rx}"/></clipPath></defs><g clip-path="url(#r)"><rect width="512" height="512" fill="#CFE3F1"/>{art(scale)}</g></svg>'''

(A/"icon.svg").write_text(svg(0.96, True), encoding="utf-8")                 # ふつうのアイコン（角丸）
(A/"icon-maskable.svg").write_text(svg(0.80, False), encoding="utf-8")       # 丸や角丸に切り抜かれるアイコン（余白あり）
tmp = pathlib.Path("/tmp/icon-render"); tmp.mkdir(exist_ok=True)
def render(src, out, size):
    html = tmp / (out.stem + ".html")
    html.write_text(f'<!doctype html><body style="margin:0;background:transparent"><img src="file://{src}" width="512" height="512" style="display:block">', encoding="utf-8")
    big = tmp / (out.stem + "-512.png")
    subprocess.run(["/opt/pw-browsers/chromium", "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
                    "--window-size=512,720", "--virtual-time-budget=3000", f"--screenshot={big}", f"file://{html}"], check=True, capture_output=True)
    from PIL import Image
    im = Image.open(big).convert("RGBA").crop((0, 0, 512, 512))
    if size != 512: im = im.resize((size, size), Image.LANCZOS)
    im.save(out)
render(A/"icon.svg", A/"icon-any-512.png", 512); render(A/"icon.svg", A/"icon-any-192.png", 192)
render(A/"icon-maskable.svg", A/"icon-maskable-512.png", 512); render(A/"icon-maskable.svg", A/"icon-maskable-192.png", 192)
render(A/"icon-maskable.svg", A/"apple-touch-icon.png", 180)
print("done")
